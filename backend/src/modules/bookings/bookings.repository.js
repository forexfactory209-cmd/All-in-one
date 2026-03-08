const pool = require('../../config/database');

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

        // Normalize payment_status for ENUM ('Unpaid', 'Paid', 'Refunded')
        let normalizedPaymentStatus = 'Unpaid';
        if (payment_status && payment_status.toUpperCase() === 'PAID') normalizedPaymentStatus = 'Paid';
        if (payment_status && payment_status.toUpperCase() === 'REFUNDED') normalizedPaymentStatus = 'Refunded';

        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            // 1. Check Availability (with lock to prevent double bookings)
            const [overlapping] = await connection.execute(`
                SELECT id FROM bookings 
                WHERE entity_type = ? AND entity_id = ? 
                AND status != 'Cancelled' 
                AND deleted_at IS NULL
                AND check_in < ? AND check_out > ?
                FOR UPDATE
            `, [entity_type, entity_id, check_out, check_in]);

            if (overlapping.length > 0) {
                throw new Error('These dates are no longer available.');
            }

            // 2. Insert Booking
            const [result] = await connection.execute(
                'INSERT INTO bookings (user_id, entity_type, entity_id, check_in, check_out, total_price, status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [user_id, entity_type, entity_id, check_in, check_out, total_price, status || 'Pending', normalizedPaymentStatus]
            );

            await connection.commit();
            return result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    async findByUserId(userId) {
        // We might want to join with properties/rooms to get details
        const [rows] = await pool.execute(`
            SELECT b.*, 
            CASE 
                WHEN b.entity_type = 'Property' THEN p.name 
                WHEN b.entity_type = 'Room' THEN h.name 
            END as title,
            CASE 
                WHEN b.entity_type = 'Property' THEN p.location 
                WHEN b.entity_type = 'Room' THEN h.location 
            END as location
            FROM bookings b
            LEFT JOIN properties p ON b.entity_type = 'Property' AND b.entity_id = p.id
            LEFT JOIN rooms r ON b.entity_type = 'Room' AND b.entity_id = r.id
            LEFT JOIN hotels h ON r.hotel_id = h.id
            WHERE b.user_id = ? AND b.deleted_at IS NULL
            ORDER BY b.created_at DESC
        `, [userId]);
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
