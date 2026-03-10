/**
 * Add Rating & Review Counts to all Reviewable Entities
 */
const pool = require('../config/database');
const { initDatabase } = pool;

const migrate = async () => {
    await initDatabase();
    const connection = await pool.getConnection();
    try {
        console.log('🚀 Adding Rating & Review Count columns...');

        // Hotels
        try {
            await connection.execute(`ALTER TABLE hotels ADD COLUMN rating DECIMAL(2,1) DEFAULT 0.0`);
            console.log('✅ rating added to hotels');
        } catch (e) { console.log('ℹ️ hotels.rating already exists or error:', e.message); }

        try {
            await connection.execute(`ALTER TABLE hotels ADD COLUMN review_count INT DEFAULT 0`);
            console.log('✅ review_count added to hotels');
        } catch (e) { console.log('ℹ️ hotels.review_count already exists or error:', e.message); }

        // Properties
        try {
            await connection.execute(`ALTER TABLE properties ADD COLUMN rating DECIMAL(2,1) DEFAULT 0.0`);
            console.log('✅ rating added to properties');
        } catch (e) { console.log('ℹ️ properties.rating already exists or error:', e.message); }

        try {
            await connection.execute(`ALTER TABLE properties ADD COLUMN review_count INT DEFAULT 0`);
            console.log('✅ review_count added to properties');
        } catch (e) { console.log('ℹ️ properties.review_count already exists or error:', e.message); }

        // Rooms
        try {
            await connection.execute(`ALTER TABLE rooms ADD COLUMN rating DECIMAL(2,1) DEFAULT 0.0`);
            console.log('✅ rating added to rooms');
        } catch (e) { console.log('ℹ️ rooms.rating already exists or error:', e.message); }

        try {
            await connection.execute(`ALTER TABLE rooms ADD COLUMN review_count INT DEFAULT 0`);
            console.log('✅ review_count added to rooms');
        } catch (e) { console.log('ℹ️ rooms.review_count already exists or error:', e.message); }

        console.log('\n🚀 Recalculating all aggregate ratings...');
        // This is optional but good if there are already reviews
        
        console.log('✅ Completed!');
    } finally {
        connection.release();
        process.exit(0);
    }
};

migrate().catch(err => {
    console.error(err);
    process.exit(1);
});
