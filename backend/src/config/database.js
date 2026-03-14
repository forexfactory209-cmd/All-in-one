const mysql = require('mysql2/promise');
const { createTunnel } = require('tunnel-ssh');
require('dotenv').config();

let pool = null;

async function initDatabase() {
    const localPort = parseInt(process.env.DB_LOCAL_PORT) || 3310;

    if (process.env.USE_SSH_TUNNEL === 'false') {
        console.log('🌐 USE_SSH_TUNNEL=false: Connecting to MySQL directly...');
        pool = mysql.createPool({
            host: process.env.DB_HOST || '127.0.0.1',
            port: parseInt(process.env.DB_PORT) || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        
        try {
            const connection = await pool.getConnection();
            console.log('✅ MySQL connected directly!');
            connection.release();
        } catch (err) {
            console.error('❌ Direct MySQL connection failed:', err.message);
            throw err;
        }
        return pool;
    }

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
        console.log(`🔑 Opening SSH tunnels → ${process.env.SSH_HOST}:22 ...`);

        const tunnelOptions = { autoClose: false };
        const sshOptionsWithAuth = { ...sshOptions };

        // Wrap createTunnel in a Promise and handle events correctly
        const startTunnel = (serverOptions, sshOptions, forwardOptions) => {
            return new Promise((resolve, reject) => {
                try {
                    // In some versions of tunnel-ssh, createTunnel returns the server instance immediately.
                    // If it's a callback-based API, it might behave differently.
                    // We'll wrap it carefully to catch the 'listening' event.
                    const server = createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
                    
                    if (server && typeof server.on === 'function') {
                        server.on('listening', () => resolve(server));
                        server.on('error', (err) => {
                            if (err.code === 'EADDRINUSE') {
                                resolve(server);
                            } else {
                                reject(err);
                            }
                        });
                    } else if (server && typeof server.then === 'function') {
                        // If it returns a promise, await it
                        server.then(resolve).catch(reject);
                    } else {
                        // If it returns something else or doesn't have .on, it might be a newer/different API
                        // Let's fallback to assuming it's already working or use the callback if provided.
                        console.log('⚠️ Tunnel object has no .on() method, attempting to continue...');
                        resolve(server);
                    }
                } catch (err) {
                    reject(err);
                }
            });
        };

        const [mysqlTunnel, redisTunnel] = await Promise.all([
            startTunnel(serverOptions, sshOptionsWithAuth, forwardOptions),
            startTunnel(
                { port: 6379 },
                sshOptionsWithAuth,
                { srcAddr: '127.0.0.1', srcPort: 6379, dstAddr: '127.0.0.1', dstPort: 6379 }
            )
        ]);

        // Only attach error listeners if the objects support it
        if (mysqlTunnel && typeof mysqlTunnel.on === 'function') {
            mysqlTunnel.on('error', (err) => console.error('⚠️ MySQL Tunnel Error:', err.message));
        }
        if (redisTunnel && typeof redisTunnel.on === 'function') {
            redisTunnel.on('error', (err) => console.error('⚠️ Redis Tunnel Error:', err.message));
        }

        console.log(`✅ SSH tunnels open: MySQL (${localPort}) and Redis (6379)`);

        // Wait a small bit for the tunnels to stabilize
        await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (err) {
        if (err.code === 'EADDRINUSE') {
            console.log(`⚠️ SSH tunnel port ${localPort} (or 6379) already in use. Assuming tunnel is already up.`);
        } else {
            console.error('❌ SSH tunnel failed:', err.message);
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
