const { createTunnel } = require('tunnel-ssh');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function optimizeDb() {
    const localPort = 3311; // Use a different port to avoid EADDRINUSE
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

    console.log(`🔑 Opening SSH tunnel on proxy port ${localPort}...`);
    let tunnel;
    try {
        tunnel = await createTunnel({ autoClose: true }, { port: localPort }, sshOptions, forwardOptions);
        await new Promise(res => setTimeout(res, 2000));
    } catch (e) {
        console.error('❌ Tunnel failed:', e.message);
        process.exit(1);
    }

    const pool = mysql.createPool({
        host: '127.0.0.1',
        port: localPort,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        connectionLimit: 1
    });

    try {
        const connection = await pool.getConnection();
        console.log('✅ Connected. Applying Critical Indexes...');

        const queries = [
            "CREATE INDEX idx_rooms_hotel_id ON rooms(hotel_id)",
            "CREATE INDEX idx_rooms_price ON rooms(price)",
            "CREATE INDEX idx_rooms_created_at ON rooms(created_at)",
            "CREATE INDEX idx_hotels_city ON hotels(location)",
            "CREATE INDEX idx_wishlist_user_id ON wishlist(user_id)",
            "CREATE INDEX idx_wishlist_entity_id ON wishlist(entity_id)",
            "CREATE UNIQUE INDEX idx_wishlist_unique ON wishlist(user_id, entity_type, entity_id)",
            "CREATE INDEX idx_bookings_user_id ON bookings(user_id)",
            "CREATE INDEX idx_bookings_entity_id ON bookings(entity_id)"
        ];

        let i = 0;
        for (const sql of queries) {
            try {
                await connection.execute(sql);
                i++;
                console.log(`✅ [CREATED] ${sql}`);
            } catch (err) {
                if (err.code === 'ER_DUP_KEYNAME') {
                    console.log(`⚠️ [EXISTS] ${sql}`);
                } else {
                    console.error(`❌ [FAILED] ${sql} => ${err.message}`);
                }
            }
        }

        console.log(`\n🎉 Applied ${i} new indices.`);

        console.log('\n--- EXPLAIN: GET /api/v1/hotels?city=Hargeisa ---');
        const [plan1] = await connection.execute("EXPLAIN SELECT * FROM hotels WHERE location = 'Hargeisa'");
        console.table(plan1);

        console.log('\n--- EXPLAIN: GET /api/v1/rooms?wishlistOnly=true ---');
        const [plan2] = await connection.execute("EXPLAIN SELECT r.id FROM rooms r JOIN hotels h ON r.hotel_id = h.id WHERE r.id IN (1,2) AND h.location = 'Hargeisa'");
        console.table(plan2);

        connection.release();
    } catch(err) {
        console.error('DB Error:', err.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

optimizeDb();
