const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkQueryPlans() {
    try {
        const pool = mysql.createPool({
            host: '127.0.0.1',
            port: parseInt(process.env.DB_LOCAL_PORT) || 3310,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });

        const connection = await pool.getConnection();

        console.log('--- EXPLAIN SELECT ON hotels (City Filter) ---');
        const [plan1] = await connection.execute("EXPLAIN SELECT * FROM hotels WHERE location = 'Hargeisa'");
        console.table(plan1);

        console.log('\n--- EXPLAIN SELECT ON rooms (Wishlist Query) ---');
        const [plan2] = await connection.execute("EXPLAIN SELECT r.id FROM rooms r WHERE r.id IN (1, 2, 3)");
        console.table(plan2);

        console.log('\n--- EXPLAIN SELECT ON wishlist ---');
        const [plan3] = await connection.execute("EXPLAIN SELECT entity_id FROM wishlist WHERE user_id = 1 AND entity_type = 'Room'");
        console.table(plan3);

        connection.release();
        process.exit(0);

    } catch (err) {
        console.error('Failed to run EXPLAIN queries:', err.message);
        process.exit(1);
    }
}

checkQueryPlans();
