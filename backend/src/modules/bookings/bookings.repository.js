const pool = require('../../config/database');
const { redis } = require('../../config/redis');

class BookingsRepository {
    async findAll(limit = 10, offset = 0) {
        const safeLimit = Math.min(parseInt(limit) || 10, 50);
        const safeOffset = Math.max(parseInt(offset) || 0, 0);

        const [rows] = await pool.execute(`
            SELECT b.*, u.full_name as guest_name, u.phone as guest_phone,
            CASE 
                WHEN b.entity_type = 'Property' THEN p.name 
                WHEN b.entity_type = 'Room' THEN h.name 
            END as title,
            CASE 
                WHEN b.entity_type = 'Property' THEN p.location 
                WHEN b.entity_type = 'Room' THEN h.location 
            END as location,
            pay.method_name as actual_payment_method
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            LEFT JOIN properties p ON b.entity_type = 'Property' AND b.entity_id = p.id
            LEFT JOIN rooms r ON b.entity_type = 'Room' AND b.entity_id = r.id
            LEFT JOIN hotels h ON r.hotel_id = h.id
            LEFT JOIN payments pay ON pay.booking_id = b.id
            WHERE b.deleted_at IS NULL 
            AND u.deleted_at IS NULL
            AND (p.id IS NULL OR p.deleted_at IS NULL)
            AND (r.id IS NULL OR (r.deleted_at IS NULL AND h.deleted_at IS NULL))
            ORDER BY b.created_at DESC
            LIMIT ? OFFSET ?
        `, [safeLimit.toString(), safeOffset.toString()]);
        return rows;
    }

    async countAll() {
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM bookings WHERE deleted_at IS NULL');
        return rows[0].count;
    }

    async create(bookingData) {
        const { user_id, entity_type, entity_id, check_in, check_out, total_price, status, payment_status } = bookingData;
        console.log('DEBUG: BookingsRepository.create - Received bookingData:', JSON.stringify(bookingData, null, 2));

        // Ensure entity_type is valid ENUM ('Property', 'Room', 'Car', 'Tour')
        let normalizedEntityType = entity_type;
        if (entity_type && typeof entity_type === 'string') {
            // Capitalize first letter, lowercase the rest (e.g. 'property' -> 'Property')
            normalizedEntityType = entity_type.charAt(0).toUpperCase() + entity_type.slice(1).toLowerCase();
        }

        // Validate entity_type against ENUM values
        const validEntityTypes = ['Property', 'Room', 'Car', 'Tour'];
        if (!validEntityTypes.includes(normalizedEntityType)) {
            console.error(`DEBUG: Invalid entity_type: ${entity_type}`);
            throw new Error(`Invalid entity_type: ${entity_type}. Must be one of ${validEntityTypes.join(', ')}`);
        }

        // Normalize payment_status for ENUM ('Unpaid', 'Paid', 'Refunded')
        let normalizedPaymentStatus = 'Unpaid';
        if (payment_status && payment_status.toUpperCase() === 'PAID') normalizedPaymentStatus = 'Paid';
        if (payment_status && payment_status.toUpperCase() === 'REFUNDED') normalizedPaymentStatus = 'Refunded';

        // 1. Inventory Locking via Redis Lock
        const lockKey = `lock:booking:${normalizedEntityType}:${entity_id}`;
        const lockValue = `${user_id}-${Date.now()}`;
        const lockTtlSeconds = 15; // Lock the entity for 15 seconds max

        console.log(`DEBUG: Attempting Redis lock for ${lockKey}`);

        // Try to acquire lock
        let lockAcquired = false;
        try {
            lockAcquired = await redis.set(lockKey, lockValue, 'NX', 'EX', lockTtlSeconds);
        } catch (redisErr) {
            console.warn('⚠️ Redis lock failed (Redis might be down), proceeding without lock:', redisErr.message);
            lockAcquired = true; // Fallback to DB-only locking if Redis is down
        }

        if (!lockAcquired) {
            console.error(`DEBUG: Redis lock failed for ${lockKey}`);
            throw new Error('This accommodation is currently being booked by someone else. Please try again in a few moments.');
        }

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            console.log(`DEBUG: Checking overlapping bookings for ${normalizedEntityType} ID ${entity_id}`);

            // 2. Check Availability (with lock to prevent double bookings)
            const [overlapping] = await connection.execute(`
                SELECT id FROM bookings 
                WHERE entity_type = ? AND entity_id = ? 
                AND status != 'Cancelled' 
                AND deleted_at IS NULL
                AND check_in < ? AND check_out > ?
                FOR UPDATE
            `, [normalizedEntityType, entity_id, check_out, check_in]);

            if (overlapping.length > 0) {
                console.error(`DEBUG: Overlapping bookings found: ${overlapping.length}`);
                throw new Error('These dates are no longer available.');
            }

            console.log('DEBUG: Inserting booking into database...');

            // 3. Insert Booking
            const [result] = await connection.execute(
                'INSERT INTO bookings (user_id, entity_type, entity_id, check_in, check_out, total_price, status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [user_id, normalizedEntityType, entity_id, check_in, check_out, total_price, status || 'Pending', normalizedPaymentStatus]
            );

            console.log(`DEBUG: Booking inserted successfully with ID: ${result.insertId}`);

            await connection.commit();
            return result.insertId;
        } catch (error) {
            console.error('DEBUG: Database transaction error:', error.message);
            await connection.rollback();
            throw error;
        } finally {
            // Always release the database connection
            connection.release();
            
            // Release the Redis lock if we still own it
            try {
                const currentLockValue = await redis.get(lockKey);
                if (currentLockValue === lockValue) {
                    await redis.del(lockKey);
                    console.log(`DEBUG: Redis lock released for ${lockKey}`);
                }
            } catch (redisErr) {
                // Ignore redis cleanup errors
            }
        }
    }

    async findByUserId(userId) {
        console.log('DEBUG: BookingsRepository.findByUserId - Querying for userId:', userId);
        // We might want to join with properties/rooms to get details
        const [rows] = await pool.execute(`
            SELECT b.*, 
            CASE 
                WHEN b.entity_type = 'Property' THEN p.name 
                WHEN b.entity_type = 'Room' THEN h.name 
                WHEN b.entity_type = 'Car' THEN CONCAT(c.make, ' ', c.model)
            END as title,
            CASE 
                WHEN b.entity_type = 'Property' THEN p.location 
                WHEN b.entity_type = 'Room' THEN h.location 
                WHEN b.entity_type = 'Car' THEN 'Local Rental'
            END as location,
            CASE 
                WHEN b.entity_type = 'Property' THEN p.main_image 
                WHEN b.entity_type = 'Room' THEN r.image_url 
                WHEN b.entity_type = 'Car' THEN (SELECT image_url FROM property_images WHERE car_id = c.id LIMIT 1)
            END as main_image
            FROM bookings b
            LEFT JOIN properties p ON b.entity_type = 'Property' AND b.entity_id = p.id
            LEFT JOIN rooms r ON b.entity_type = 'Room' AND b.entity_id = r.id
            LEFT JOIN hotels h ON r.hotel_id = h.id
            LEFT JOIN rental_cars c ON b.entity_type = 'Car' AND b.entity_id = c.id
            WHERE b.user_id = ? AND b.deleted_at IS NULL
            ORDER BY b.created_at DESC
        `, [userId]);
        console.log(`DEBUG: BookingsRepository.findByUserId - Found ${rows.length} rows`);
        return rows;
    }

    async findById(id) {
        const [rows] = await pool.execute(`
            SELECT b.*, u.full_name as guest_name, u.phone as guest_phone, u.email as guest_email,
            CASE 
                WHEN b.entity_type = 'Property' THEN p.name 
                WHEN b.entity_type = 'Room' THEN h.name 
            END as entity_name,
            CASE 
                WHEN b.entity_type = 'Property' THEN p.location 
                WHEN b.entity_type = 'Room' THEN h.location 
            END as location,
            CASE 
                WHEN b.entity_type = 'Room' THEN r.room_number
                ELSE NULL
            END as unit_number,
            CASE 
                WHEN b.entity_type = 'Room' THEN r.type
                ELSE p.type
            END as unit_type,
            pay.method_name as actual_payment_method
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            LEFT JOIN properties p ON b.entity_type = 'Property' AND b.entity_id = p.id
            LEFT JOIN rooms r ON b.entity_type = 'Room' AND b.entity_id = r.id
            LEFT JOIN hotels h ON r.hotel_id = h.id
            LEFT JOIN payments pay ON pay.booking_id = b.id
            WHERE b.id = ? AND b.deleted_at IS NULL
        `, [id]);
        return rows[0] || null;
    }

    async updateStatus(id, status, paymentStatus) {
        const updateFields = [];
        const values = [];

        if (status) {
            updateFields.push('status = ?');
            values.push(status);
        }
        if (paymentStatus) {
            let normalized = 'Unpaid';
            if (paymentStatus.toUpperCase() === 'PAID') normalized = 'Paid';
            if (paymentStatus.toUpperCase() === 'REFUNDED') normalized = 'Refunded';
            updateFields.push('payment_status = ?');
            values.push(normalized);
        }

        if (updateFields.length === 0) return false;

        values.push(id);
        const [result] = await pool.execute(`UPDATE bookings SET ${updateFields.join(', ')} WHERE id = ? AND deleted_at IS NULL`, values);
        return result.affectedRows > 0;
    }

    async update(id, bookingData) {
        const updateFields = {};
        if (bookingData.check_in !== undefined) updateFields.check_in = bookingData.check_in;
        if (bookingData.check_out !== undefined) updateFields.check_out = bookingData.check_out;
        if (bookingData.total_price !== undefined) updateFields.total_price = bookingData.total_price;
        if (bookingData.status !== undefined) updateFields.status = bookingData.status;

        if (bookingData.payment_status !== undefined) {
            let normalized = 'Unpaid';
            if (bookingData.payment_status.toUpperCase() === 'PAID') normalized = 'Paid';
            if (bookingData.payment_status.toUpperCase() === 'REFUNDED') normalized = 'Refunded';
            updateFields.payment_status = normalized;
        }

        if (Object.keys(updateFields).length === 0) return false;

        const fields = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updateFields), id];

        const [result] = await pool.execute(`UPDATE bookings SET ${fields} WHERE id = ? AND deleted_at IS NULL`, values);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const [result] = await pool.execute('UPDATE bookings SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new BookingsRepository();
