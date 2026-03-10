const mysql = require('mysql2/promise');
const { createTunnel } = require('tunnel-ssh');
require('dotenv').config();

async function fix() {
    const localPort = 3315; // Different port to avoid conflict
    try {
        const tunnelOptions = { autoClose: false };
        const sshOptions = {
            host: process.env.SSH_HOST,
            port: parseInt(process.env.SSH_PORT) || 22,
            username: process.env.SSH_USER,
            password: process.env.SSH_PASS,
        };
        const forwardOptions = {
            srcAddr: '127.0.0.1',
            srcPort: localPort,
            dstAddr: '127.0.0.1',
            dstPort: 3306,
        };
        const serverOptions = { port: localPort };

        await createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
        console.log(`SSH tunnel open on port ${localPort}`);
        await new Promise(resolve => setTimeout(resolve, 2000));

        const pool = mysql.createPool({
            host: '127.0.0.1',
            port: localPort,
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
        console.error('❌ Failed:', err);
        process.exit(1);
    }
}
fix();
