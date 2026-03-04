const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function syncSchema() {
    console.log('Starting schema synchronization using Root...');

    const config = {
        host: process.env.DB_HOST,
        user: 'root',
        password: 'Ducaysane@2026!Systems',
        database: process.env.DB_NAME
    };

    const wishlistTable = `
    CREATE TABLE IF NOT EXISTS wishlist (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        entity_type ENUM('Hotel', 'Property') NOT NULL,
        entity_id INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_wishlist (user_id, entity_type, entity_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`;

    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log('✅ Root connection established.');

        // 1. Ensure core tables from database.sql exist
        const sqlPath = path.join(__dirname, 'database.sql');
        if (fs.existsSync(sqlPath)) {
            const sql = fs.readFileSync(sqlPath, 'utf8');
            const statements = sql.split(';').filter(s => s.trim());
            for (let statement of statements) {
                try {
                    await connection.execute(statement);
                } catch (e) {
                    // Ignore errors about tables already existing if not using CREATE IF NOT EXISTS
                    if (!e.message.includes('already exists')) {
                        console.warn('Statement warning:', e.message);
                    }
                }
            }
            console.log('✅ Core tables verified/created.');
        }

        // 2. Ensure wishlist table exists
        await connection.execute(wishlistTable);
        console.log('✅ Wishlist table verified/created.');

        // 3. Comparison / Check for missing columns
        const [columns] = await connection.execute('SHOW COLUMNS FROM hotels');
        const columnNames = columns.map(c => c.Field);
        console.log('Hotels columns:', columnNames);

        console.log('🚀 Schema synchronization complete!');
    } catch (error) {
        console.error('❌ Error during schema sync:', error.message);
    } finally {
        if (connection) await connection.end();
        process.exit();
    }
}

syncSchema();
