require('dotenv').config();
const mysql = require('mysql2/promise');
const { createTunnel } = require('tunnel-ssh');

(async () => {
    const localPort = 3323;
    const sshOptions = {
        host: process.env.SSH_HOST,
        port: parseInt(process.env.SSH_PORT) || 22,
        username: process.env.SSH_USER,
        password: process.env.SSH_PASS
    };
    const forwardOptions = {
        srcAddr: '127.0.0.1',
        srcPort: localPort,
        dstAddr: '127.0.0.1',
        dstPort: parseInt(process.env.DB_PORT) || 3306
    };

    console.log('--- DB FIX START ---');
    try {
        await createTunnel({ autoClose: true }, { port: localPort }, sshOptions, forwardOptions);
        await new Promise(res => setTimeout(res, 2000));
        
        const pool = mysql.createPool({
            host: '127.0.0.1',
            port: localPort,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        const tables = ['properties', 'hotels', 'rooms', 'users', 'bookings', 'wishlist'];
        for (const table of tables) {
            try {
                // Check if column exists first
                const [columns] = await pool.execute(`SHOW COLUMNS FROM ${table} LIKE 'deleted_at'`);
                if (columns.length === 0) {
                    await pool.execute(`ALTER TABLE ${table} ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL`);
                    console.log(`✅ Added deleted_at to ${table}`);
                } else {
                    console.log(`ℹ️ Table ${table} already has deleted_at`);
                }
            } catch (err) {
                console.error(`❌ Error on ${table}:`, err.message);
            }
        }
        await pool.end();
    } catch (err) {
        console.error('❌ Tunnel Error:', err.message);
    }
    console.log('--- DB FIX DONE ---');
    process.exit(0);
})();
