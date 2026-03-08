require('dotenv').config();
const mysql = require('mysql2/promise');

(async () => {
    try {
        const pool = mysql.createPool({
            host: '127.0.0.1',
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            port: parseInt(process.env.DB_LOCAL_PORT) || 3310
        });

        const [columns] = await pool.execute('DESCRIBE rental_cars');
        console.log('COLUMNS:', JSON.stringify(columns, null, 2));
        await pool.end();
    } catch (err) {
        console.error('ERROR:', err.message);
    }
})();
