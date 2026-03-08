const { createTunnel } = require('tunnel-ssh');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function applyProductionFixes() {
    const localPort = 3312; 
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
        console.log('✅ Connected. Applying Critical Production Fixes...');

        const queries = [
            // 1. Foreign keys
            // Clean up potentially orphaned rows before adding FKs
            "DELETE FROM rooms WHERE hotel_id NOT IN (SELECT id FROM hotels)",
            "ALTER TABLE rooms ADD CONSTRAINT fk_rooms_hotel FOREIGN KEY IF NOT EXISTS (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE",
            
            "DELETE FROM bookings WHERE user_id NOT IN (SELECT id FROM users)",
            "ALTER TABLE bookings ADD CONSTRAINT fk_bookings_user FOREIGN KEY IF NOT EXISTS (user_id) REFERENCES users(id) ON DELETE CASCADE",
            
            "DELETE FROM wishlist WHERE user_id NOT IN (SELECT id FROM users)",
            "ALTER TABLE wishlist ADD CONSTRAINT fk_wishlist_user FOREIGN KEY IF NOT EXISTS (user_id) REFERENCES users(id) ON DELETE CASCADE",

            // 2 & 3. NOT NULL & DEFAULTS
            // MySQL 8 handles these fine via MODIFY
            "ALTER TABLE hotels MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'Active'",
            "ALTER TABLE rooms MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'Available'",
            "ALTER TABLE bookings MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'Pending'",

            // 4. Soft Delete Columns (deleted_at)
            "ALTER TABLE hotels ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL",
            "ALTER TABLE rooms ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL",
            "ALTER TABLE bookings ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL",
            "ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL DEFAULT NULL"
        ];

        for (const sql of queries) {
            try {
                // If simple query execution errors happen on duplicate FK due to old mysql versions, we ignore it securely
                await connection.execute(sql.replace(" IF NOT EXISTS", ""));
                console.log(`✅ [SUCCESS] ${sql}`);
            } catch (err) {
                if (err.code === 'ER_DUP_KEYNAME' || err.code === 'ER_FK_DUP_NAME' || err.code === 'ER_DUP_FIELDNAME' || err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
                    console.log(`⚠️ [EXISTS/IGNORED] ${sql} (${err.code})`);
                } else if (err.code === 'ER_PARSE_ERROR' && sql.includes('CONSTRAINT')) {
                    console.log(`⚠️ [SKIPPED] ${sql} (FK syntax not supported precisely this way in this DB version)`);
                } else {
                    console.error(`❌ [FAILED] ${sql} => ${err.message}`);
                }
            }
        }

        console.log('\n--- EXPLAIN ANALYZE: GET /api/v1/hotels?city=Hargeisa ---');
        try {
            const [plan1] = await connection.execute("EXPLAIN ANALYZE SELECT * FROM hotels WHERE location = 'Hargeisa' AND deleted_at IS NULL");
            console.log(plan1[0]['EXPLAIN']);
        } catch (e) {
            console.log('EXPLAIN ANALYZE unsupported, doing standard EXPLAIN:');
            const [plan1] = await connection.execute("EXPLAIN SELECT * FROM hotels WHERE location = 'Hargeisa' AND deleted_at IS NULL");
            console.table(plan1);
        }

        connection.release();
    } catch(err) {
        console.error('DB Error:', err.message);
    } finally {
        await pool.end();
        process.exit(0);
    }
}

applyProductionFixes();
