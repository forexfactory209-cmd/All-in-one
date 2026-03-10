const db = require('./src/config/database');

async function fix() {
    try {
        await db.initDatabase();
        console.log('Adding reviews_count to rental_cars...');
        try {
            await db.execute('ALTER TABLE rental_cars ADD COLUMN reviews_count INT DEFAULT 0 AFTER rating');
            console.log('✅ Added reviews_count');
        } catch (e) {
            console.log('reviews_count may already exist');
        }

        console.log('Ensuring driver_info fields match frontend names...');
        // The frontend uses license_photo, passport_photo, selfie_photo. 
        // setup_car_bookings.js has them.

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
fix();
