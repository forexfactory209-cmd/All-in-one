/**
 * Reviews & Ratings Migration Script
 * Creates the reviews table and adds review_count to hotels/properties
 * Run: node src/scripts/migrate-reviews.js
 */
require('dotenv').config();
const { initDatabase } = require('../config/database');

const migration = async () => {
    console.log('🚀 Running Reviews & Ratings migration...');
    const pool = require('../config/database');
    await initDatabase();

    const connection = await pool.getConnection();
    try {
        // 1. Create reviews table
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS reviews (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                user_id     INT NOT NULL,
                entity_type ENUM('Hotel', 'Room', 'Property') NOT NULL,
                entity_id   INT NOT NULL,
                booking_id  INT,
                rating      DECIMAL(2,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
                title       VARCHAR(150),
                body        TEXT,
                cleanliness DECIMAL(2,1),
                service     DECIMAL(2,1),
                value       DECIMAL(2,1),
                location    DECIMAL(2,1),
                status      ENUM('Pending', 'Approved', 'Flagged', 'Rejected') DEFAULT 'Approved',
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at  TIMESTAMP NULL,
                FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
                FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
                UNIQUE KEY uq_one_review_per_booking (user_id, booking_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
        `);
        console.log('✅ reviews table created (or already exists)');

        // 2. Add index for fast lookups
        try {
            await connection.execute(`
                ALTER TABLE reviews
                    ADD INDEX idx_entity (entity_type, entity_id),
                    ADD INDEX idx_user   (user_id),
                    ADD INDEX idx_status (status);
            `);
            console.log('✅ Indexes added to reviews');
        } catch (e) {
            if (e.code === 'ER_DUP_KEYNAME') {
                console.log('ℹ️  Indexes already exist, skipping.');
            } else throw e;
        }

        // 3. Add review_count to hotels if not present
        try {
            await connection.execute(`ALTER TABLE hotels ADD COLUMN review_count INT DEFAULT 0`);
            console.log('✅ review_count added to hotels');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('ℹ️  review_count already exists on hotels.');
            else throw e;
        }

        // 4. Ensure properties.review_count exists
        try {
            await connection.execute(`ALTER TABLE properties ADD COLUMN review_count INT DEFAULT 0`);
            console.log('✅ review_count added to properties');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('ℹ️  review_count already exists on properties.');
            else throw e;
        }

        console.log('\n✅ Reviews migration completed!');
    } finally {
        connection.release();
        process.exit(0);
    }
};

migration().catch(err => {
    console.error('❌ Migration failed:', err);
    process.exit(1);
});
