require('dotenv').config();
const { initDatabase } = require('../config/database');

async function createNotificationTables() {
    const pool = await initDatabase();
    console.log('Running notifications table migration...');

    const createQueries = `
        CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            type ENUM('Push', 'Email', 'SMS', 'InApp') NOT NULL DEFAULT 'InApp',
            status ENUM('Pending', 'Sent', 'Failed') NOT NULL DEFAULT 'Pending',
            metadata JSON DEFAULT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            read_at TIMESTAMP NULL DEFAULT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS notification_settings (
            user_id INT PRIMARY KEY,
            push_enabled BOOLEAN DEFAULT TRUE,
            sms_enabled BOOLEAN DEFAULT FALSE,
            email_enabled BOOLEAN DEFAULT TRUE,
            promotions_enabled BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `;

    try {
        const connection = await pool.getConnection();
        await connection.query(createQueries);
        console.log('✅ Notification tables created successfully.');
        connection.release();
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed creating tables:', err);
        process.exit(1);
    }
}

createNotificationTables();
