const pool = require('../../config/database');

class PaymentsRepository {
    async findAll() {
        const [rows] = await pool.execute(`
            SELECT p.*, b.total_price as booking_amount, u.full_name as guest_name, u.phone as guest_phone,
            CASE 
                WHEN b.entity_type = 'Property' THEN prop.name 
                WHEN b.entity_type = 'Room' THEN h.name 
            END as entity_name
            FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            JOIN users u ON b.user_id = u.id
            LEFT JOIN properties prop ON b.entity_type = 'Property' AND b.entity_id = prop.id
            LEFT JOIN rooms r ON b.entity_type = 'Room' AND b.entity_id = r.id
            LEFT JOIN hotels h ON r.hotel_id = h.id
            ORDER BY p.created_at DESC
        `);
        return rows;
    }

    async findById(id) {
        const [rows] = await pool.execute(`
            SELECT p.*, b.total_price as booking_amount, b.check_in, b.check_out, 
            u.full_name as guest_name, u.phone as guest_phone, u.email as guest_email,
            CASE 
                WHEN b.entity_type = 'Property' THEN prop.name 
                WHEN b.entity_type = 'Room' THEN h.name 
            END as entity_name,
            CASE 
                WHEN b.entity_type = 'Property' THEN prop.location 
                WHEN b.entity_type = 'Room' THEN h.location 
            END as location
            FROM payments p
            JOIN bookings b ON p.booking_id = b.id
            JOIN users u ON b.user_id = u.id
            LEFT JOIN properties prop ON b.entity_type = 'Property' AND b.entity_id = prop.id
            LEFT JOIN rooms r ON b.entity_type = 'Room' AND b.entity_id = r.id
            LEFT JOIN hotels h ON r.hotel_id = h.id
            WHERE p.id = ?
        `, [id]);
        return rows[0] || null;
    }

    async create(paymentData) {
        const { booking_id, transaction_id, amount, method_name, provider, method_type, status = 'Pending' } = paymentData;
        const [result] = await pool.execute(
            'INSERT INTO payments (booking_id, transaction_id, amount, method_name, provider, method_type, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [booking_id, transaction_id, amount, method_name, provider, method_type, status]
        );
        return result.insertId;
    }

    async updateStatus(id, status, verified_by = null) {
        const query = verified_by
            ? 'UPDATE payments SET status = ?, verified_by = ?, verified_at = CURRENT_TIMESTAMP WHERE id = ?'
            : 'UPDATE payments SET status = ? WHERE id = ?';

        const params = verified_by ? [status, verified_by, id] : [status, id];

        const [result] = await pool.execute(query, params);
        return result.affectedRows > 0;
    }

    async findByBookingId(bookingId) {
        const [rows] = await pool.execute('SELECT * FROM payments WHERE booking_id = ?', [bookingId]);
        return rows[0] || null;
    }

    async updateByBookingId(bookingId, paymentData) {
        const { amount, status, method_name } = paymentData;
        const [result] = await pool.execute(
            'UPDATE payments SET amount = ?, status = ?, method_name = ? WHERE booking_id = ?',
            [amount, status, method_name, bookingId]
        );
        return result.affectedRows > 0;
    }
}

module.exports = new PaymentsRepository();
