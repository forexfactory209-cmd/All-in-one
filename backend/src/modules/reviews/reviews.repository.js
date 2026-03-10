const pool = require('../../config/database');

class ReviewsRepository {
    /**
     * Create a new review
     */
    async create(data) {
        const {
            user_id, entity_type, entity_id, booking_id,
            rating, title, body,
            cleanliness, service, value, location
        } = data;

        const [result] = await pool.execute(`
            INSERT INTO reviews
                (user_id, entity_type, entity_id, booking_id, rating, title, body, cleanliness, service, value, location, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Approved')
        `, [
            user_id, entity_type, entity_id, booking_id || null,
            rating, title || null, body || null,
            cleanliness || null, service || null, value || null, location || null
        ]);

        // Update the aggregate rating on the parent entity
        await this._refreshEntityRating(entity_type, entity_id);

        return result.insertId;
    }

    /**
     * Get all reviews for an entity (hotel, room, or property)
     */
    async findByEntity(entity_type, entity_id, { limit = 10, offset = 0, sort = 'newest' } = {}) {
        const orderBy = sort === 'highest' ? 'r.rating DESC'
                      : sort === 'lowest'  ? 'r.rating ASC'
                      : 'r.created_at DESC';

        const safeLimit  = Math.min(parseInt(limit) || 10, 50);
        const safeOffset = Math.max(parseInt(offset) || 0, 0);

        const [rows] = await pool.execute(`
            SELECT r.*,
                   u.full_name   AS reviewer_name,
                   u.created_at  AS reviewer_since
            FROM   reviews r
            JOIN   users   u ON r.user_id = u.id
            WHERE  r.entity_type = ?
              AND  r.entity_id   = ?
              AND  r.status      = 'Approved'
              AND  r.deleted_at  IS NULL
            ORDER  BY ${orderBy}
            LIMIT  ? OFFSET ?
        `, [entity_type, entity_id, safeLimit.toString(), safeOffset.toString()]);

        return rows;
    }

    /**
     * Count reviews for a given entity
     */
    async countByEntity(entity_type, entity_id) {
        const [rows] = await pool.execute(`
            SELECT COUNT(*) AS count
            FROM   reviews
            WHERE  entity_type = ? AND entity_id = ?
              AND  status = 'Approved' AND deleted_at IS NULL
        `, [entity_type, entity_id]);
        return rows[0].count;
    }

    /**
     * Rating statistics (average per category + distribution)
     */
    async statsByEntity(entity_type, entity_id) {
        const [rows] = await pool.execute(`
            SELECT
                ROUND(AVG(rating), 1)      AS avg_rating,
                COUNT(*)                   AS total,
                ROUND(AVG(cleanliness), 1) AS avg_cleanliness,
                ROUND(AVG(service),     1) AS avg_service,
                ROUND(AVG(value),       1) AS avg_value,
                ROUND(AVG(location),    1) AS avg_location,
                SUM(rating = 5)  AS five_star,
                SUM(rating >= 4 AND rating < 5) AS four_star,
                SUM(rating >= 3 AND rating < 4) AS three_star,
                SUM(rating >= 2 AND rating < 3) AS two_star,
                SUM(rating < 2)  AS one_star
            FROM  reviews
            WHERE  entity_type = ? AND entity_id = ?
              AND  status = 'Approved' AND deleted_at IS NULL
        `, [entity_type, entity_id]);
        return rows[0];
    }

    /**
     * Find one review by ID
     */
    async findById(id) {
        const [rows] = await pool.execute(`
            SELECT r.*, u.full_name AS reviewer_name
            FROM   reviews r
            JOIN   users   u ON r.user_id = u.id
            WHERE  r.id = ? AND r.deleted_at IS NULL
        `, [id]);
        return rows[0] || null;
    }

    /**
     * Check if this user already reviewed this booking
     */
    async findByUserAndBooking(user_id, booking_id) {
        const [rows] = await pool.execute(`
            SELECT id FROM reviews
            WHERE user_id = ? AND booking_id = ? AND deleted_at IS NULL
        `, [user_id, booking_id]);
        return rows[0] || null;
    }

    /**
     * Get all reviews left by a specific user
     */
    async findByUser(user_id, limit = 20, offset = 0) {
        const [rows] = await pool.execute(`
            SELECT r.*,
                CASE r.entity_type
                    WHEN 'Hotel'    THEN h.name
                    WHEN 'Room'     THEN CONCAT(rm.type, ' Room - ', rh.name)
                    WHEN 'Property' THEN p.name
                END AS entity_name,
                CASE r.entity_type
                    WHEN 'Hotel'    THEN h.main_image
                    WHEN 'Room'     THEN rm.image_url
                    WHEN 'Property' THEN p.main_image
                END AS entity_image
            FROM  reviews r
            LEFT JOIN hotels     h  ON r.entity_type = 'Hotel'    AND r.entity_id = h.id
            LEFT JOIN rooms      rm ON r.entity_type = 'Room'     AND r.entity_id = rm.id
            LEFT JOIN hotels     rh ON rm.hotel_id = rh.id
            LEFT JOIN properties p  ON r.entity_type = 'Property' AND r.entity_id = p.id
            WHERE r.user_id = ? AND r.deleted_at IS NULL
            ORDER BY r.created_at DESC
            LIMIT ? OFFSET ?
        `, [user_id, limit.toString(), offset.toString()]);
        return rows;
    }

    /**
     * Soft-delete a review
     */
    async delete(id, user_id) {
        const [result] = await pool.execute(`
            UPDATE reviews SET deleted_at = NOW()
            WHERE id = ? AND user_id = ? AND deleted_at IS NULL
        `, [id, user_id]);
        return result.affectedRows > 0;
    }

    /**
     * Check if a booking is eligible for review (Completed status, belongs to user)
     */
    async isBookingEligible(booking_id, user_id) {
        const [rows] = await pool.execute(`
            SELECT id, entity_type, entity_id
            FROM   bookings
            WHERE  id = ? AND user_id = ?
              AND  status = 'Completed'
              AND  deleted_at IS NULL
        `, [booking_id, user_id]);
        return rows[0] || null;
    }

    /**
     * Get completed bookings that haven't been reviewed yet (for review prompts)
     */
    async findUnreviewedBookings(user_id) {
        const [rows] = await pool.execute(`
            SELECT b.id AS booking_id, b.entity_type, b.entity_id, b.check_out,
                CASE b.entity_type
                    WHEN 'Hotel'    THEN h.name
                    WHEN 'Room'     THEN CONCAT(rm.type, ' Room - ', rh.name)
                    WHEN 'Property' THEN p.name
                END AS entity_name,
                CASE b.entity_type
                    WHEN 'Hotel'    THEN h.main_image
                    WHEN 'Room'     THEN rm.image_url
                    WHEN 'Property' THEN p.main_image
                END AS entity_image
            FROM  bookings b
            LEFT JOIN hotels     h  ON b.entity_type = 'Hotel'    AND b.entity_id = h.id
            LEFT JOIN rooms      rm ON b.entity_type = 'Room'     AND b.entity_id = rm.id
            LEFT JOIN hotels     rh ON rm.hotel_id = rh.id
            LEFT JOIN properties p  ON b.entity_type = 'Property' AND b.entity_id = p.id
            WHERE b.user_id    = ?
              AND b.status     = 'Completed'
              AND b.deleted_at IS NULL
              AND NOT EXISTS (
                  SELECT 1 FROM reviews r
                  WHERE r.booking_id = b.id AND r.deleted_at IS NULL
              )
            ORDER BY b.check_out DESC
            LIMIT 10
        `, [user_id]);
        return rows;
    }

    // ─── Private Helpers ────────────────────────────────────────────────────────

    async _refreshEntityRating(entity_type, entity_id) {
        const [rows] = await pool.execute(`
            SELECT ROUND(AVG(rating), 1) AS avg, COUNT(*) AS cnt
            FROM   reviews
            WHERE  entity_type = ? AND entity_id = ?
              AND  status = 'Approved' AND deleted_at IS NULL
        `, [entity_type, entity_id]);

        const { avg, cnt } = rows[0];

        if (entity_type === 'Hotel') {
            await pool.execute(`UPDATE hotels      SET rating = ?, review_count = ? WHERE id = ?`, [avg, cnt, entity_id]);
        } else if (entity_type === 'Property') {
            await pool.execute(`UPDATE properties  SET rating = ?, review_count = ? WHERE id = ?`, [avg, cnt, entity_id]);
        } else if (entity_type === 'Room') {
            // Update the room's own rating
            await pool.execute(`UPDATE rooms SET rating = ?, review_count = ? WHERE id = ?`, [avg, cnt, entity_id]);

            // Also bubble up/recalculate the hotel's rating based on all room reviews
            const [roomRows] = await pool.execute(`SELECT hotel_id FROM rooms WHERE id = ?`, [entity_id]);
            if (roomRows[0]) {
                const hotelId = roomRows[0].hotel_id;
                const [hotelStats] = await pool.execute(`
                    SELECT ROUND(AVG(r.rating), 1) AS avg, COUNT(*) AS cnt
                    FROM   reviews r
                    JOIN   rooms   rm ON r.entity_type = 'Room' AND r.entity_id = rm.id
                    WHERE  rm.hotel_id = ? AND r.status = 'Approved' AND r.deleted_at IS NULL
                `, [hotelId]);
                
                if (hotelStats[0]) {
                    await pool.execute(`UPDATE hotels SET rating = ?, review_count = ? WHERE id = ?`,
                        [hotelStats[0].avg || 0, hotelStats[0].cnt || 0, hotelId]);
                }
            }
        }
    }
}

module.exports = new ReviewsRepository();
