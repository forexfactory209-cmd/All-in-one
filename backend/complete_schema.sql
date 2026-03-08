-- =====================================================
-- SOMSTAY — Complete Database Schema
-- Run this file once to build the full schema.
-- Safe to re-run (uses CREATE TABLE IF NOT EXISTS).
-- =====================================================

SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- 1. USERS
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    full_name     VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password      VARCHAR(255) NOT NULL DEFAULT 'ADMIN_CREATED_NO_LOGIN',
    phone         VARCHAR(50),
    gender        VARCHAR(20),
    dob           DATE,
    city          VARCHAR(255),
    district      VARCHAR(255),
    address       TEXT,
    national_id   VARCHAR(100),
    profile_image VARCHAR(255),
    role          ENUM('Admin', 'Owner', 'Guest') DEFAULT 'Guest',
    status        ENUM('Active', 'Inactive', 'Blocked') DEFAULT 'Active',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 2. PROPERTIES (vacation rentals / standalone units)
-- =====================================================
CREATE TABLE IF NOT EXISTS properties (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    type            ENUM('Home', 'Apartment', 'Villa', 'Cabin', 'Loft') DEFAULT 'Home',
    price_per_night DECIMAL(10, 2) NOT NULL,
    status          ENUM('Active', 'Inactive', 'Fully Booked', 'Pending') DEFAULT 'Pending',
    location        VARCHAR(255) NOT NULL,
    address         TEXT,
    latitude        DECIMAL(10, 8),
    longitude       DECIMAL(11, 8),
    main_image      VARCHAR(255),
    rating          DECIMAL(3, 1) DEFAULT 0.0,
    review_count    INT DEFAULT 0,
    owner_id        INT,
    bedrooms        INT DEFAULT 1,
    bathrooms       INT DEFAULT 1,
    max_guests      INT DEFAULT 2,
    owner_name      VARCHAR(255),
    owner_phone     VARCHAR(50),
    owner_email     VARCHAR(255),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 3. HOTELS
-- =====================================================
CREATE TABLE IF NOT EXISTS hotels (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(255) NOT NULL,
    description      TEXT,
    type             VARCHAR(50) DEFAULT 'Hotel',
    location         VARCHAR(255) NOT NULL,
    address          TEXT,
    latitude         DECIMAL(10, 8),
    longitude        DECIMAL(11, 8),
    total_rooms      INT NOT NULL DEFAULT 0,
    available_rooms  INT NOT NULL DEFAULT 0,
    base_price       DECIMAL(10, 2) DEFAULT 0.00,
    rating           DECIMAL(3, 1) DEFAULT 0.0,
    status           ENUM('Active', 'Inactive', 'Fully Booked', 'Under Renovation') DEFAULT 'Active',
    main_image       VARCHAR(255),
    owner_name       VARCHAR(255),
    owner_phone      VARCHAR(50),
    owner_email      VARCHAR(255),
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 4. ROOMS (belong to hotels)
-- =====================================================
CREATE TABLE IF NOT EXISTS rooms (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id    INT NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    type        VARCHAR(50) NOT NULL,
    price       DECIMAL(10, 2) NOT NULL,
    beds        INT DEFAULT 1,
    max_guests  INT DEFAULT 2,
    status      ENUM('Available', 'Booked', 'Maintenance', 'Occupied') DEFAULT 'Available',
    image_url   VARCHAR(255),
    description TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 5. AMENITIES
-- =====================================================
CREATE TABLE IF NOT EXISTS amenities (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 6. IMAGES (shared table for properties, hotels, rooms)
-- =====================================================
CREATE TABLE IF NOT EXISTS property_images (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT DEFAULT NULL,
    hotel_id    INT DEFAULT NULL,
    room_id     INT DEFAULT NULL,
    image_url   VARCHAR(500) NOT NULL,
    is_main     TINYINT(1) DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (hotel_id)    REFERENCES hotels(id)    ON DELETE CASCADE,
    FOREIGN KEY (room_id)     REFERENCES rooms(id)     ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 7. PROPERTY AMENITIES LINK
-- =====================================================
CREATE TABLE IF NOT EXISTS property_amenities (
    property_id INT NOT NULL,
    amenity_id  INT NOT NULL,
    PRIMARY KEY (property_id, amenity_id),
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (amenity_id)  REFERENCES amenities(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 8. HOTEL AMENITIES LINK
-- =====================================================
CREATE TABLE IF NOT EXISTS hotel_amenities (
    hotel_id   INT NOT NULL,
    amenity_id INT NOT NULL,
    PRIMARY KEY (hotel_id, amenity_id),
    FOREIGN KEY (hotel_id)    REFERENCES hotels(id)    ON DELETE CASCADE,
    FOREIGN KEY (amenity_id)  REFERENCES amenities(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 9. BOOKINGS (unified engine — Property OR Room)
-- =====================================================
CREATE TABLE IF NOT EXISTS bookings (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT NOT NULL,
    entity_type    ENUM('Property', 'Room') NOT NULL,
    entity_id      INT NOT NULL,
    check_in       DATE NOT NULL,
    check_out      DATE NOT NULL,
    total_price    DECIMAL(10, 2) NOT NULL,
    status         ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') DEFAULT 'Pending',
    payment_status ENUM('Unpaid', 'Paid', 'Refunded') DEFAULT 'Unpaid',
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 10. PAYMENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    booking_id   INT NOT NULL,
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    amount       DECIMAL(10, 2) NOT NULL,
    method_name  VARCHAR(50) NOT NULL,
    provider     VARCHAR(100),
    method_type  ENUM('Mobile', 'Card', 'Bank Transfer', 'Cash') DEFAULT 'Mobile',
    status       ENUM('Pending', 'Success', 'Failed', 'Refunded') DEFAULT 'Pending',
    verified_at  TIMESTAMP NULL,
    verified_by  INT DEFAULT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id)  REFERENCES bookings(id)  ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id)     ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 11. DISPUTES
-- =====================================================
CREATE TABLE IF NOT EXISTS disputes (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    booking_id     INT NOT NULL,
    user_id        INT NOT NULL,
    subject        VARCHAR(255) NOT NULL,
    description    TEXT NOT NULL,
    priority       ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') DEFAULT 'MEDIUM',
    status         ENUM('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED') DEFAULT 'OPEN',
    admin_response TEXT,
    resolved_at    TIMESTAMP NULL,
    resolved_by    INT DEFAULT NULL,
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id)  REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id)     REFERENCES users(id)    ON DELETE CASCADE,
    FOREIGN KEY (resolved_by) REFERENCES users(id)    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 12. WISHLIST
-- =====================================================
CREATE TABLE IF NOT EXISTS wishlist (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    entity_type ENUM('Hotel', 'Property') NOT NULL,
    entity_id   INT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_wishlist (user_id, entity_type, entity_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 13. SYSTEM SETTINGS (key-value store)
-- =====================================================
CREATE TABLE IF NOT EXISTS system_settings (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    setting_key   VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_group VARCHAR(50) NOT NULL DEFAULT 'general',
    label         VARCHAR(150),
    description   TEXT,
    value_type    ENUM('string', 'boolean', 'number', 'json') DEFAULT 'string',
    is_public     TINYINT(1) DEFAULT 0,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 14. ANALYTICS SNAPSHOTS (optional caching table)
-- =====================================================
CREATE TABLE IF NOT EXISTS analytics_snapshots (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    snapshot_date    DATE NOT NULL UNIQUE,
    total_revenue    DECIMAL(15, 2) DEFAULT 0,
    total_bookings   INT DEFAULT 0,
    active_properties INT DEFAULT 0,
    pending_payments INT DEFAULT 0,
    created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- SEED DATA
-- =====================================================

-- Default Admin User (password: Admin@123 — bcrypt hash placeholder)
INSERT IGNORE INTO users (id, full_name, email, password, role, status)
VALUES (1, 'System Admin', 'admin@somstay.com', '$2b$10$placeholder_hash_change_me', 'Admin', 'Active');

-- Default Guest User (used as placeholder for mobile app bookings)
INSERT IGNORE INTO users (id, full_name, email, password, role, status)
VALUES (2, 'Guest User', 'guest@somstay.com', 'GUEST_NO_LOGIN', 'Guest', 'Active');

-- Sample Hotel
INSERT IGNORE INTO hotels (id, name, description, type, location, address, total_rooms, available_rooms, base_price, status, main_image, rating, owner_name, owner_phone, owner_email)
VALUES (1, 'Hargeisa Grand Hotel', 'A luxurious hotel in the heart of Hargeisa', 'Hotel', 'Hargeisa', '26 June Road, Hargeisa, Somaliland', 20, 18, 80.00, 'Active', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', 4.5, 'Ahmed Mohamed', '+252 63 4000000', 'contact@hgh.so');

-- Sample Rooms
INSERT IGNORE INTO rooms (id, hotel_id, room_number, type, price, beds, max_guests, status, image_url, description)
VALUES
  (1, 1, '101', 'Standard', 60.00, 1, 2, 'Available', 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80', 'Comfortable standard room with city view'),
  (2, 1, '201', 'Deluxe', 100.00, 2, 2, 'Available', 'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80', 'Spacious deluxe room with twin beds and balcony'),
  (3, 1, '301', 'Executive Suite', 180.00, 2, 4, 'Available', 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80', 'Premium suite with living area and panoramic view');

-- Sample Property
INSERT IGNORE INTO properties (id, name, description, type, price_per_night, status, location, address, main_image, rating, owner_name, owner_phone, owner_email, bedrooms, bathrooms, max_guests)
VALUES (1, 'Ocean View Apartment', 'A beautiful sea-facing apartment with modern amenities', 'Apartment', 120.00, 'Active', 'Berbera', 'Berbera Coastal Road, Berbera, Somaliland', 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80', 4.8, 'Faadumo Hassan', '+252 63 5000000', 'faadumo@email.com', 2, 1, 4);

-- Sample Amenities
INSERT IGNORE INTO amenities (name, icon) VALUES
    ('WiFi', 'wifi'),
    ('Air Conditioning', 'thermometer-snowflake'),
    ('Parking', 'car'),
    ('Swimming Pool', 'pool'),
    ('Gym', 'dumbbell'),
    ('Restaurant', 'utensils'),
    ('Room Service', 'concierge-bell'),
    ('TV', 'tv'),
    ('Kitchen', 'kitchen-set'),
    ('Balcony', 'tree'),
    ('Hot Water', 'droplet'),
    ('Laundry', 'shirt');

-- Link amenities to hotel
INSERT IGNORE INTO hotel_amenities (hotel_id, amenity_id) VALUES (1,1),(1,2),(1,3),(1,5),(1,6),(1,7);

-- Link amenities to property
INSERT IGNORE INTO property_amenities (property_id, amenity_id) VALUES (1,1),(1,2),(1,8),(1,9),(1,10);

-- Default System Settings
INSERT IGNORE INTO system_settings (setting_key, setting_value, setting_group, label, value_type, is_public) VALUES
    ('site_name',              'Somstay',                         'general',       'Platform Name',           'string',  1),
    ('site_tagline',           'Your Premium Stay in Somaliland', 'general',       'Tagline',                 'string',  1),
    ('support_email',          'support@somstay.com',             'general',       'Support Email',           'string',  1),
    ('support_phone',          '+252 63 000 0000',                'general',       'Support Phone',           'string',  1),
    ('default_currency',       'USD',                             'general',       'Default Currency',        'string',  1),
    ('timezone',               'Africa/Nairobi',                  'general',       'Timezone',                'string',  0),
    ('min_booking_days',       '1',                               'booking',       'Minimum Stay (nights)',   'number',  1),
    ('max_booking_days',       '30',                              'booking',       'Maximum Stay (nights)',   'number',  1),
    ('cancellation_hours',     '24',                              'booking',       'Cancellation Window (h)', 'number',  1),
    ('auto_confirm_bookings',  'false',                           'booking',       'Auto-confirm Bookings',   'boolean', 0),
    ('platform_fee_percent',   '10',                              'payments',      'Platform Fee (%)',        'number',  0),
    ('tax_rate_percent',       '0',                               'payments',      'Tax Rate (%)',            'number',  1),
    ('email_notifications',    'true',                            'notifications', 'Email Notifications',     'boolean', 0),
    ('sms_notifications',      'true',                            'notifications', 'SMS Notifications',       'boolean', 0),
    ('push_notifications',     'true',                            'notifications', 'Push Notifications',      'boolean', 0),
    ('notify_admin_on_booking','true',                            'notifications', 'Notify Admin on Booking', 'boolean', 0),
    ('maintenance_mode',       'false',                           'security',      'Maintenance Mode',        'boolean', 0),
    ('session_timeout_hours',  '24',                              'security',      'Session Timeout (h)',     'number',  0),
    ('max_login_attempts',     '5',                               'security',      'Max Login Attempts',      'number',  0);
