const mysql = require('mysql2/promise');
const { createTunnel } = require('tunnel-ssh');
require('dotenv').config();

let pool = null;

async function initDatabase() {
    const localPort = parseInt(process.env.DB_LOCAL_PORT) || 3307;

    const tunnelOptions = { autoClose: false }; // CRITICAL: Stop tunnel from closing itself when idle
    const sshOptions = {
        host: process.env.SSH_HOST,
        port: parseInt(process.env.SSH_PORT) || 22,
        username: process.env.SSH_USER,
        password: process.env.SSH_PASS,
        keepaliveInterval: 10000, // Send keepalive every 10s
        keepaliveCountMax: 3      // Max 3 missed before failing
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

        // Wait a small bit for the tunnel to stabilize before MySQL connects
        await new Promise(resolve => setTimeout(resolve, 2000));

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
        connectTimeout: 30000, // Increased to 30 seconds
        idleTimeout: 60000,    // 60 seconds
        maxIdle: 10
    });

    try {
        const connection = await pool.getConnection();
        console.log('✅ MySQL connected via SSH tunnel!');

        // --- AUTOMATIC INDEX ENFORCEMENT ---
        try {
            await connection.execute('SET profiling = 1;');
            console.log('✅ Profiling enabled.');

            const indexes = [
                "CREATE INDEX idx_rooms_hotel_id ON rooms(hotel_id)",
                "CREATE INDEX idx_rooms_price ON rooms(price)",
                "CREATE INDEX idx_rooms_availability ON rooms(id, status, deleted_at)",
                "CREATE INDEX idx_hotels_location ON hotels(location)",
                "CREATE INDEX idx_hotels_base_price ON hotels(base_price)",
                "CREATE INDEX idx_wishlist_lookup ON wishlist(user_id, entity_type, entity_id)",
                "CREATE INDEX idx_bookings_availability ON bookings(entity_id, entity_type, check_in, check_out, status, deleted_at)",
                "CREATE INDEX idx_bookings_user ON bookings(user_id, status)",
                "CREATE INDEX idx_property_images_room ON property_images(room_id)",
                "CREATE INDEX idx_property_images_hotel ON property_images(hotel_id)",
                "CREATE INDEX idx_property_images_car ON property_images(car_id)"
            ];

            let added = 0;
            for (const idx of indexes) {
                try {
                    await connection.execute(idx);
                    added++;
                } catch (e) { /* ignore existing duplicate indexes */ }
            }
            if (added > 0) console.log(`✅ Dynamically added ${added} new DB indexes for optimal speed.`);
            else console.log(`✅ All DB indexes already present.`);
        } catch (e) {
            console.error('⚠️ Warning: DB Index optimization failed:', e.message);
        }

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
