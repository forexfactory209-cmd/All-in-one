require('dotenv').config();
const mysql = require('mysql2/promise');

async function runSetup() {
    try {
        console.log('Connecting to existing tunnel on port', process.env.DB_LOCAL_PORT || 3307);
        const pool = mysql.createPool({
            host: '127.0.0.1',
            port: parseInt(process.env.DB_LOCAL_PORT) || 3310,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        });

        console.log('Creating rental_cars table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS rental_cars (
                id             INT AUTO_INCREMENT PRIMARY KEY,
                make           VARCHAR(255) NOT NULL,
                model          VARCHAR(255) NOT NULL,
                year           INT,
                description    TEXT,
                price_per_day  DECIMAL(10, 2) NOT NULL,
                status         ENUM('Active', 'Inactive', 'Rented', 'Maintenance') DEFAULT 'Active',
                location       VARCHAR(255) NOT NULL,
                transmission   ENUM('Automatic', 'Manual') DEFAULT 'Automatic',
                seats          INT DEFAULT 4,
                doors          INT DEFAULT 4,
                main_image     VARCHAR(255),
                owner_name     VARCHAR(255),
                owner_phone    VARCHAR(50),
                owner_email    VARCHAR(255),
                rating         DECIMAL(3, 1) DEFAULT 0.0,
                created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        console.log('Creating city_tours table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS city_tours (
                id             INT AUTO_INCREMENT PRIMARY KEY,
                title          VARCHAR(255) NOT NULL,
                description    TEXT,
                price_per_person DECIMAL(10, 2) NOT NULL,
                duration_hours INT DEFAULT 1,
                location       VARCHAR(255) NOT NULL,
                status         ENUM('Active', 'Inactive', 'Fully Booked') DEFAULT 'Active',
                max_participants INT DEFAULT 10,
                main_image     VARCHAR(255),
                guide_name     VARCHAR(255),
                guide_phone    VARCHAR(50),
                rating         DECIMAL(3, 1) DEFAULT 0.0,
                created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        console.log('Updating bookings table...');
        await pool.query(`
            ALTER TABLE bookings MODIFY COLUMN entity_type ENUM('Property', 'Room', 'Car', 'Tour') NOT NULL;
        `);

        console.log('Updating property_images table...');
        try {
            await pool.query(`ALTER TABLE property_images ADD COLUMN car_id INT DEFAULT NULL;`);
        } catch(e) { console.log('car_id column may already exist', e.message); }
        
        try {
            await pool.query(`ALTER TABLE property_images ADD COLUMN tour_id INT DEFAULT NULL;`);
        } catch(e) { console.log('tour_id column may already exist', e.message); }

        try {
            await pool.query(`ALTER TABLE property_images ADD CONSTRAINT fk_car FOREIGN KEY (car_id) REFERENCES rental_cars(id) ON DELETE CASCADE;`);
        } catch(e) { console.log('fk_car constraint may already exist', e.message); }

        try {
            await pool.query(`ALTER TABLE property_images ADD CONSTRAINT fk_tour FOREIGN KEY (tour_id) REFERENCES city_tours(id) ON DELETE CASCADE;`);
        } catch(e) { console.log('fk_tour constraint may already exist', e.message); }

        console.log('✅ Services tables created successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating tables:', error);
        process.exit(1);
    }
}

runSetup();
