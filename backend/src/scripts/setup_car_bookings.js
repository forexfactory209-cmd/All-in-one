require('dotenv').config();
const { initDatabase } = require('../config/database');
const pool = require('../config/database');

async function setup() {
    try {
        await initDatabase();
        
        console.log('Creating car_bookings table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS car_bookings (
                id INT PRIMARY KEY AUTO_INCREMENT,
                user_id INT,
                car_id INT,
                pickup_date DATETIME,
                return_date DATETIME,
                pickup_location VARCHAR(200),
                dropoff_location VARCHAR(200),
                total_price DECIMAL(10,2),
                deposit DECIMAL(10,2),
                status ENUM('pending','confirmed','active','completed','cancelled') DEFAULT 'pending',
                payment_status ENUM('unpaid','paid','refunded') DEFAULT 'unpaid',
                insurance_plan VARCHAR(100),
                delivery_type VARCHAR(50),
                hotel_id INT DEFAULT NULL,
                hotel_room VARCHAR(50),
                delivery_time VARCHAR(20),
                add_ons JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (car_id) REFERENCES rental_cars(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        console.log('Creating driver_info table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS driver_info (
                id INT PRIMARY KEY AUTO_INCREMENT,
                booking_id INT,
                full_name VARCHAR(200),
                phone_number VARCHAR(50),
                email VARCHAR(200),
                dob DATE,
                nationality VARCHAR(100),
                city VARCHAR(100),
                country VARCHAR(100),
                license_number VARCHAR(100),
                license_country VARCHAR(100),
                license_expiry DATE,
                license_photo VARCHAR(255),
                passport_photo VARCHAR(255),
                selfie_photo VARCHAR(255),
                emergency_name VARCHAR(200),
                emergency_phone VARCHAR(50),
                emergency_relation VARCHAR(100),
                FOREIGN KEY (booking_id) REFERENCES car_bookings(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        console.log('Creating car_inspections table...');
        await pool.query(`
            CREATE TABLE IF NOT EXISTS car_inspections (
                id INT PRIMARY KEY AUTO_INCREMENT,
                booking_id INT,
                inspection_type ENUM('pickup','return'),
                fuel_level VARCHAR(50),
                mileage INT,
                damage_notes TEXT,
                photos JSON,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (booking_id) REFERENCES car_bookings(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);

        console.log('Adding indexes for performance...');
        await pool.query('CREATE INDEX idx_car_bookings_dates ON car_bookings(pickup_date, return_date);').catch(() => {});
        await pool.query('CREATE INDEX idx_car_bookings_car_id ON car_bookings(car_id);').catch(() => {});
        await pool.query('CREATE INDEX idx_car_bookings_user_id ON car_bookings(user_id);').catch(() => {});

        console.log('✅ Car bookings setup completed securely!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Failed:', err);
        process.exit(1);
    }
}

setup();
