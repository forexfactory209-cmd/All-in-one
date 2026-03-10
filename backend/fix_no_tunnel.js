const mysql = require('mysql2/promise');
require('dotenv').config();

async function fix() {
    try {
        const pool = mysql.createPool({
            host: '127.0.0.1',
            port: 3310,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        console.log('Adding reviews_count to rental_cars...');
        try {
            await pool.execute('ALTER TABLE rental_cars ADD COLUMN reviews_count INT DEFAULT 0 AFTER rating');
            console.log('✅ Added reviews_count');
        } catch (e) {
            console.log('reviews_count may already exist:', e.message);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
fix();
