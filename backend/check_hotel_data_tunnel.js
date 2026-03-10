const mysql = require('mysql2/promise');
const { createTunnel } = require('tunnel-ssh');
require('dotenv').config();

async function check() {
    const localPort = 3317;
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

        const [hotels] = await pool.execute('SELECT * FROM hotels');
        const [rooms] = await pool.execute('SELECT * FROM rooms');
        console.log('Hotels:', JSON.stringify(hotels, null, 2));
        console.log('Rooms:', JSON.stringify(rooms, null, 2));

        process.exit(0);
    } catch (err) {
        console.error('❌ Failed:', err);
        process.exit(1);
    }
}
check();
