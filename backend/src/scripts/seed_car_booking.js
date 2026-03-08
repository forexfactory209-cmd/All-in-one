require('dotenv').config();
const { initDatabase } = require('../config/database');
const pool = require('../config/database');

async function seedBooking() {
    try {
        await initDatabase();
        
        console.log('Seeding a test car booking...');
        
        // Find a car
        const [cars] = await pool.query('SELECT id FROM rental_cars LIMIT 1');
        if (cars.length === 0) {
            console.log('No cars found. Please add a car first.');
            process.exit(0);
        }
        const carId = cars[0].id;

        // Find a user
        const [users] = await pool.query('SELECT id FROM users LIMIT 1');
        if (users.length === 0) {
            console.log('No users found.');
            process.exit(0);
        }
        const userId = users[0].id;

        const [result] = await pool.query(`
            INSERT INTO car_bookings (
                user_id, car_id, pickup_date, return_date, pickup_location, dropoff_location,
                total_price, deposit, insurance_plan, status, payment_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            userId, carId, '2026-03-12 10:00:00', '2026-03-15 10:00:00', 'Hargeisa Airport', 'Hotel Maansoor',
            120.00, 200.00, 'Basic', 'pending', 'unpaid'
        ]);

        const bookingId = result.insertId;

        await pool.query(`
            INSERT INTO driver_info (
                booking_id, full_name, phone_number, email, license_number, license_country
            ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
            bookingId, 'John Doe', '+252631234567', 'john@example.com', 'SL-123456', 'Somaliland'
        ]);

        console.log('✅ Test booking seeded successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed:', err);
        process.exit(1);
    }
}

seedBooking();
