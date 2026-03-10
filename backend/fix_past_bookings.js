const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
    const conn = await mysql.createConnection({
        host: '127.0.0.1',
        port: 3310,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    try {
        console.log('--- Fixing Past Bookings ---');

        // 1. Mark past bookings as Completed
        const [updateResult] = await conn.execute(`
            UPDATE bookings 
            SET status = 'Completed' 
            WHERE check_out < NOW() 
              AND status IN ('Confirmed', 'Pending')
              AND deleted_at IS NULL
        `);
        console.log(`Updated ${updateResult.affectedRows} past bookings to 'Completed'.`);

        // 2. Ensure User 1 has at least one completed booking for testing the Review Prompt
        const userId = 1;

        // Check if there is already a completed booking for User 1 that is NOT reviewed
        const [pending] = await conn.execute(`
            SELECT b.id 
            FROM   bookings b
            WHERE  b.user_id = ? 
              AND  b.status = 'Completed' 
              AND  b.deleted_at IS NULL
              AND NOT EXISTS (
                  SELECT 1 FROM reviews r 
                  WHERE r.booking_id = b.id AND r.deleted_at IS NULL
              )
            LIMIT 1
        `, [userId]);

        if (pending.length === 0) {
            console.log('No unreviewed completed bookings for User 1. Creating a sample one...');
            
            // Get a valid room for the booking
            const [rooms] = await conn.execute('SELECT id, price FROM rooms LIMIT 1');
            if (rooms.length > 0) {
                const room = rooms[0];
                const now = new Date();
                
                // Set dates in the past
                const checkInDate = new Date(now);
                checkInDate.setDate(now.getDate() - 5);
                
                const checkOutDate = new Date(now);
                checkOutDate.setDate(now.getDate() - 1);

                const formatDate = (date) => date.toISOString().split('T')[0];

                await conn.execute(`
                    INSERT INTO bookings (user_id, entity_type, entity_id, check_in, check_out, total_price, status, payment_status)
                    VALUES (?, 'Room', ?, ?, ?, ?, 'Completed', 'Paid')
                `, [
                    userId, 
                    room.id, 
                    formatDate(checkInDate), 
                    formatDate(checkOutDate), 
                    (room.price || 50) * 4
                ]);
                console.log('Sample completed booking created for User 1 (Room ID: ' + room.id + ').');
            } else {
                console.log('No rooms found to create a sample booking.');
            }
        } else {
            console.log('User 1 already has at least one unreviewed completed booking.');
        }

        console.log('--- Done ---');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await conn.end();
    }
}

run();
