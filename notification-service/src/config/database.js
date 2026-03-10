const mysql = require('mysql2/promise');
const { createTunnel } = require('tunnel-ssh');

require('dotenv').config();

let pool = null;

async function initDatabase() {
    const localPort = 3312; // Different local port to avoid conflict with backend's tunnel

    const tunnelOptions = { autoClose: false };
    const sshOptions = {
        host: process.env.SSH_HOST,
        port: parseInt(process.env.SSH_PORT) || 22,
        username: process.env.SSH_USER,
        password: process.env.SSH_PASS,
        keepaliveInterval: 10000,
        keepaliveCountMax: 3
    };
    const forwardOptions = {
        srcAddr: '127.0.0.1',
        srcPort: localPort,
        dstAddr: '127.0.0.1',
        dstPort: parseInt(process.env.DB_PORT) || 3306,
    };
    const serverOptions = { port: localPort };

    try {
        console.log(`[Database] 🔑 Opening SSH tunnel → ${process.env.SSH_HOST}:22 ...`);
        await createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
        console.log(`[Database] ✅ SSH tunnel open on local port ${localPort}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (err) {
        if (err.code === 'EADDRINUSE') {
            console.log(`[Database] ⚠️ SSH tunnel port ${localPort} already in use. Assuming tunnel is already up.`);
        } else {
            console.error('[Database] ❌ SSH tunnel failed:', err.message);
            throw err;
        }
    }

    pool = mysql.createPool({
        host: '127.0.0.1',
        port: localPort,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        multipleStatements: true,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        enableKeepAlive: true,
        connectTimeout: 30000,
        idleTimeout: 60000,
        maxIdle: 10
    });

    try {
        const connection = await pool.getConnection();
        console.log('[Database] ✅ MySQL connected successfully!');
        connection.release();
    } catch (err) {
        console.error('[Database] ❌ MySQL connection failed:', err.message);
        throw err;
    }

    return pool;
}

const poolProxy = new Proxy({}, {
    get(_, prop) {
        if (prop === 'initDatabase') return initDatabase;
        if (!pool) {
            throw new Error(`Database not initialised. Call initDatabase() first.`);
        }
        const value = pool[prop];
        return typeof value === 'function' ? value.bind(pool) : value;
    }
});

module.exports = poolProxy;
