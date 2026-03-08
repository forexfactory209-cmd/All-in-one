const db = require('../config/database');
const { initDatabase } = require('../config/database');

async function runSetup() {
    try {
        console.log('Connecting to database...');
        await initDatabase();
        
        console.log('Creating rental_cars table...');
        await db.query(`
            CREATE TABLE IF NOT EXISTS rental_cars (
                id             INT AUTO_INCREMENT PRIMARY KEY,
                make           VARCHAR(255) NOT NULL,
                model          VARCHAR(255) NOT NULL,
                year           INT,
                description    TEXT,
                price_per_day  DECIMAL(10, 2) NOT NULL,
                status         ENUM('Available', 'Rented', 'Maintenance', 'Inactive') DEFAULT 'Available',
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
        await db.query(`
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
        await db.query(`
            ALTER TABLE bookings MODIFY COLUMN entity_type ENUM('Property', 'Room', 'Car', 'Tour') NOT NULL;
        `);

        console.log('Updating property_images table...');
        try {
            await db.query(`ALTER TABLE property_images ADD COLUMN car_id INT DEFAULT NULL;`);
        } catch(e) { console.log('car_id column may already exist', e.message); }
        
        try {
            await db.query(`ALTER TABLE property_images ADD COLUMN tour_id INT DEFAULT NULL;`);
        } catch(e) { console.log('tour_id column may already exist', e.message); }

        try {
            await db.query(`ALTER TABLE property_images ADD CONSTRAINT fk_car FOREIGN KEY (car_id) REFERENCES rental_cars(id) ON DELETE CASCADE;`);
        } catch(e) { console.log('fk_car constraint may already exist', e.message); }

        try {
            await db.query(`ALTER TABLE property_images ADD CONSTRAINT fk_tour FOREIGN KEY (tour_id) REFERENCES city_tours(id) ON DELETE CASCADE;`);
        } catch(e) { console.log('fk_tour constraint may already exist', e.message); }

        console.log('✅ Services tables created successfully.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating tables:', error);
        process.exit(1);
    }
}

runSetup();
