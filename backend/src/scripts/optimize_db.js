const pool = require('../config/database');

async function optimizeDb() {
    const connection = await pool.initDatabase();

    try {
        await connection.execute('SET profiling = 1;');
        console.log('✅ Profiling enabled. Use SHOW PROFILES; to see slow queries.');
    } catch (e) {
        console.error('Warning: SET profiling = 1 failed:', e.message);
    }

    const indexes = [
        "CREATE INDEX idx_rooms_hotel_id ON rooms(hotel_id)",
        "CREATE INDEX idx_rooms_price ON rooms(price)",
        "CREATE INDEX idx_hotels_city ON hotels(location)",
        "CREATE INDEX idx_bookings_user_id ON bookings(user_id)",
        "CREATE INDEX idx_bookings_entity_id ON bookings(entity_id)",
        "CREATE INDEX idx_wishlist_user_id ON wishlist(user_id)",
        "CREATE INDEX idx_wishlist_entity_id ON wishlist(entity_id)"
    ];

    for (const statement of indexes) {
        try {
            await connection.execute(statement);
            console.log(`✅ Index created: ${statement}`);
        } catch (e) {
            if (e.code === 'ER_DUP_KEYNAME') {
                console.log(`⚠️ Index already exists: ${statement}`);
            } else {
                console.error(`❌ Error with index ${statement}:`, e.message);
            }
        }
    }

    console.log('✅ Database optimization completed.');
    process.exit(0);
}

optimizeDb();
