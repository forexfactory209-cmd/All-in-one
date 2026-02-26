const pool = require('../../config/database');

class DisputesRepository {
    async findAll() {
        const [rows] = await pool.execute(`
            SELECT d.*, u.full_name as guest_name
            FROM disputes d
            JOIN users u ON d.user_id = u.id
            JOIN bookings b ON d.booking_id = b.id
            ORDER BY d.created_at DESC
        `);
        return rows;
    }

    async findById(id) {
        const [rows] = await pool.execute(`
            SELECT d.*, u.full_name as guest_name
            FROM disputes d
            JOIN users u ON d.user_id = u.id
            JOIN bookings b ON d.booking_id = b.id
            WHERE d.id = ?
        `, [id]);
        return rows[0];
    }

    async create(disputeData) {
        const { booking_id, user_id, subject, description, priority } = disputeData;
        const [result] = await pool.execute(
            'INSERT INTO disputes (booking_id, user_id, subject, description, priority) VALUES (?, ?, ?, ?, ?)',
            [booking_id, user_id, subject, description, priority || 'MEDIUM']
        );
        return result.insertId;
    }

    async updateStatus(id, status, admin_response = null, resolved_by = null) {
        let query = 'UPDATE disputes SET status = ?, updated_at = CURRENT_TIMESTAMP';
        const params = [status];

        if (admin_response) {
            query += ', admin_response = ?';
            params.push(admin_response);
        }

        if (status === 'RESOLVED' || status === 'CLOSED') {
            query += ', resolved_at = CURRENT_TIMESTAMP, resolved_by = ?';
            params.push(resolved_by);
        }

        query += ' WHERE id = ?';
        params.push(id);

        const [result] = await pool.execute(query, params);
        return result.affectedRows > 0;
    }
}

module.exports = new DisputesRepository();
