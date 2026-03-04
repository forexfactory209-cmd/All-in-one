require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { initDatabase } = require('./src/config/database');

async function migrate() {
    try {
        console.log("Setting up Tunnel and getting MySQL connection pool...");
        const connection = await initDatabase();

        console.log('Running database.sql...');
        const sql1 = fs.readFileSync(path.join(__dirname, 'database.sql'), 'utf8');
        await connection.query(sql1);

        console.log('Running setup_reports_disputes.sql...');
        const sql2 = fs.readFileSync(path.join(__dirname, 'setup_reports_disputes.sql'), 'utf8');
        await connection.query(sql2);

        console.log('Running add_payments_table.sql...');
        const sql3 = fs.readFileSync(path.join(__dirname, 'add_payments_table.sql'), 'utf8');
        await connection.query(sql3);

        console.log('Running JS bookings & users table creation...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(50),
                role ENUM('Admin', 'Owner', 'Guest') DEFAULT 'Guest',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                entity_type ENUM('Property', 'Room') NOT NULL,
                entity_id INT NOT NULL,
                check_in DATE NOT NULL,
                check_out DATE NOT NULL,
                total_price DECIMAL(10, 2) NOT NULL,
                status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') DEFAULT 'Pending',
                payment_status ENUM('Unpaid', 'Paid', 'Refunded') DEFAULT 'Unpaid',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        console.log('Running table schema updates (making URLs longer, adding optional columns)...');
        try { await connection.execute('ALTER TABLE properties MODIFY COLUMN main_image VARCHAR(1024)'); } catch (e) { }
        try { await connection.execute('ALTER TABLE hotels MODIFY COLUMN main_image VARCHAR(1024)'); } catch (e) { }
        try { await connection.execute('ALTER TABLE property_images MODIFY COLUMN image_url VARCHAR(1024)'); } catch (e) { }

        const [propCols] = await connection.execute('SHOW COLUMNS FROM properties');
        if (!propCols.map(c => c.Field).includes('owner_name')) {
            await connection.execute('ALTER TABLE properties ADD COLUMN owner_name VARCHAR(255), ADD COLUMN owner_phone VARCHAR(50), ADD COLUMN owner_email VARCHAR(255)');
        }

        const [hotelCols] = await connection.execute('SHOW COLUMNS FROM hotels');
        if (!hotelCols.map(c => c.Field).includes('owner_name')) {
            await connection.execute('ALTER TABLE hotels ADD COLUMN owner_name VARCHAR(255), ADD COLUMN owner_phone VARCHAR(50), ADD COLUMN owner_email VARCHAR(255)');
        }

        const [imageCols] = await connection.execute('SHOW COLUMNS FROM property_images');
        if (!imageCols.map(c => c.Field).includes('hotel_id')) {
            await connection.execute('ALTER TABLE property_images ADD COLUMN hotel_id INT AFTER property_id');
        }

        try { await connection.execute('ALTER TABLE property_images MODIFY COLUMN property_id INT NULL'); } catch (e) { }

        console.log('✅ VPS Database Migration Complete.');
        process.exit(0);

    } catch (e) {
        console.error('❌ Error during migration:', e);
        process.exit(1);
    }
}

migrate();
