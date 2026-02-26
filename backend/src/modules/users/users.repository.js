const pool = require('../../config/database');

class UsersRepository {
    async findAll() {
        const [rows] = await pool.execute(`
            SELECT u.id, u.full_name, u.email, u.phone, u.role, u.status, u.city, u.district, u.address, u.national_id, u.created_at, u.updated_at,
            (SELECT COUNT(*) FROM bookings b WHERE b.user_id = u.id) as booking_count,
            (SELECT MAX(created_at) FROM bookings b WHERE b.user_id = u.id) as last_booking
            FROM users u
            ORDER BY u.created_at DESC
        `);
        return rows;
    }

    async findById(id) {
        const [rows] = await pool.execute('SELECT id, full_name, email, phone, role, gender, dob, city, district, address, national_id, status, created_at FROM users WHERE id = ?', [id]);
        return rows[0] || null;
    }

    async findByEmail(email) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0] || null;
    }

    async create(userData) {
        const {
            full_name,
            email = `guest_${Date.now()}@somstay.local`,
            password = 'ADMIN_CREATED_NO_LOGIN',
            phone,
            role,
            gender,
            dob,
            city,
            district,
            address,
            national_id,
            status = 'Active'
        } = userData;

        // Ensure dob is in YYYY-MM-DD format regardless of type (ISO string, Date object, etc)
        let formattedDob = null;
        if (dob && dob !== '') {
            if (typeof dob === 'string' && dob.includes('T')) {
                formattedDob = dob.split('T')[0];
            } else if (typeof dob === 'string') {
                formattedDob = dob;
            } else if (dob instanceof Date) {
                formattedDob = dob.toISOString().split('T')[0];
            } else {
                formattedDob = dob;
            }
        }

        const [result] = await pool.execute(
            'INSERT INTO users (full_name, email, password, phone, role, gender, dob, city, district, address, national_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [full_name, email, password, phone || null, role || 'Guest', gender || null, formattedDob, city || null, district || null, address || null, national_id || null, status || 'Active']
        );
        return result.insertId;
    }

    async update(id, userData) {
        const updateFields = {};
        const allowedFields = ['full_name', 'email', 'phone', 'role', 'gender', 'dob', 'city', 'district', 'address', 'national_id', 'status'];

        allowedFields.forEach(field => {
            if (userData[field] !== undefined) {
                let value = userData[field];
                // Ensure dob is formatted correctly or set to null if empty
                if (field === 'dob') {
                    if (value === '' || value === null) {
                        value = null;
                    } else if (typeof value === 'string' && value.includes('T')) {
                        value = value.split('T')[0];
                    } else if (typeof value === 'string') {
                        value = value;
                    } else if (value instanceof Date) {
                        value = value.toISOString().split('T')[0];
                    }
                }
                updateFields[field] = value;
            }
        });

        if (Object.keys(updateFields).length === 0) return false;

        const fields = Object.keys(updateFields).map(key => `${key} = ?`).join(', ');
        const values = [...Object.values(updateFields), id];

        const [result] = await pool.execute(`UPDATE users SET ${fields} WHERE id = ?`, values);
        return result.affectedRows > 0;
    }

    async delete(id) {
        const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
}

module.exports = new UsersRepository();
