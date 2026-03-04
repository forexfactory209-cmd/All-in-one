const pool = require('../config/database');

async function checkIndexExists(tableName, indexName) {
    const [rows] = await pool.execute(
        'SELECT COUNT(1) as count FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = ? AND index_name = ?',
        [tableName, indexName]
    );
    return rows[0].count > 0;
}

async function addIndex(tableName, indexName, columns) {
    const exists = await checkIndexExists(tableName, indexName);
    if (!exists) {
        console.log(`Adding index ${indexName} to ${tableName}...`);
        await pool.execute(`CREATE INDEX ${indexName} ON ${tableName}(${columns})`);
    } else {
        console.log(`Index ${indexName} already exists on ${tableName}.`);
    }
}

async function runMigration() {
    try {
        console.log('🚀 Starting Robust Performance Index Migration...');

        // 1. Hotels Indexes
        await addIndex('hotels', 'idx_hotels_location', 'location');
        await addIndex('hotels', 'idx_hotels_status', 'status');

        // 2. Rooms Indexes
        await addIndex('rooms', 'idx_rooms_hotel_id', 'hotel_id');
        await addIndex('rooms', 'idx_rooms_price', 'price');
        await addIndex('rooms', 'idx_rooms_status', 'status');

        // 3. Properties Indexes
        await addIndex('properties', 'idx_properties_location', 'location');
        await addIndex('properties', 'idx_properties_status', 'status');
        await addIndex('properties', 'idx_properties_price', 'price_per_night');

        // 4. Bookings Indexes
        await addIndex('bookings', 'idx_bookings_user_id', 'user_id');
        await addIndex('bookings', 'idx_bookings_entity', 'entity_type, entity_id');
        await addIndex('bookings', 'idx_bookings_status', 'status');

        console.log('✅ Performance indexes added successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

runMigration();
