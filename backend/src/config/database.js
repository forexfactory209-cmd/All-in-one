const mysql = require('mysql2/promise');
const { createTunnel } = require('tunnel-ssh');
require('dotenv').config();

let pool = null;

async function initDatabase() {
    const localPort = parseInt(process.env.DB_LOCAL_PORT) || 3307;

    const tunnelOptions = { autoClose: true };
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
        dstPort: parseInt(process.env.DB_PORT) || 3306,
    };
    const serverOptions = { port: localPort };

    try {
        console.log(`🔑 Opening SSH tunnel → ${process.env.SSH_HOST}:22 ...`);
        await createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
        console.log(`✅ SSH tunnel open on local port ${localPort}`);
    } catch (err) {
        console.error('❌ SSH tunnel failed:', err.message);
        throw err;
    }

    pool = mysql.createPool({
        host: '127.0.0.1',
        port: localPort,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        multipleStatements: true,
        waitForConnections: true,
        connectionLimit: 20,
        queueLimit: 0,
        enableKeepAlive: true,
        keepAliveInitialDelay: 0,
        connectTimeout: 20000 // 20 seconds for remote VPS
    });

    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL connected via SSH tunnel!');
        connection.release();
    } catch (err) {
        console.error('❌ MySQL connection failed:', err.message);
        throw err;
    }

    return pool;
}

const poolProxy = new Proxy({}, {
    get(_, prop) {
        if (prop === 'initDatabase') return initDatabase;
        if (prop === 'then') return undefined; // so it doesn't look like a promise

        if (!pool) {
            throw new Error(`Database not yet initialised. Make sure initDatabase() is awaited in server.js before any request arrives.`);
        }
        const value = pool[prop];
        return typeof value === 'function' ? value.bind(pool) : value;
    }
});

module.exports = poolProxy;
