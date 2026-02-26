-- Database Schema for Somstay

-- Properties Table (Unified for Vacation Rentals and general listings)
CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('Home', 'Apartment', 'Villa', 'Cabin', 'Loft') DEFAULT 'Home',
    price_per_night DECIMAL(10, 2) NOT NULL,
    status ENUM('Active', 'Inactive', 'Fully Booked', 'Pending') DEFAULT 'Pending',
    location VARCHAR(255) NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    main_image VARCHAR(255),
    rating DECIMAL(2, 1) DEFAULT 0.0,
    review_count INT DEFAULT 0,
    owner_id INT, -- To be linked with users table
    bedrooms INT DEFAULT 1,
    bathrooms INT DEFAULT 1,
    max_guests INT DEFAULT 2,
    owner_name VARCHAR(255),
    owner_phone VARCHAR(50),
    owner_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Hotels Table (Specialized for hospitality inventories)
CREATE TABLE IF NOT EXISTS hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    total_rooms INT NOT NULL,
    available_rooms INT NOT NULL,
    base_price DECIMAL(10, 2),
    rating DECIMAL(2, 1) DEFAULT 0.0,
    status ENUM('Active', 'Inactive', 'Fully Booked', 'Under Renovation') DEFAULT 'Active',
    main_image VARCHAR(255),
    owner_name VARCHAR(255),
    owner_phone VARCHAR(50),
    owner_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Property/Hotel Images
CREATE TABLE IF NOT EXISTS property_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property_id INT, -- Can be null if it's a hotel or room
    hotel_id INT,    -- Can be null if it's a property or room
    room_id INT,     -- Can be null if it's a property or hotel
    image_url VARCHAR(255) NOT NULL,
    is_main BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Amenities Table
CREATE TABLE IF NOT EXISTS amenities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50)
);

-- Property Amenities Link Table
CREATE TABLE IF NOT EXISTS property_amenities (
    property_id INT,
    amenity_id INT,
    PRIMARY KEY (property_id, amenity_id)
);

-- Hotel Amenities Link Table
CREATE TABLE IF NOT EXISTS hotel_amenities (
    hotel_id INT,
    amenity_id INT,
    PRIMARY KEY (hotel_id, amenity_id)
);

-- Rooms Table (Detailed inventory for hotels)
CREATE TABLE IF NOT EXISTS rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT NOT NULL,
    room_number VARCHAR(20) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'Standard', 'Deluxe', 'Executive Suite', etc.
    price DECIMAL(10, 2) NOT NULL,
    beds INT DEFAULT 1,
    max_guests INT DEFAULT 2,
    status ENUM('Available', 'Booked', 'Maintenance', 'Occupied') DEFAULT 'Available',
    image_url VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

-- Users Table (Identity Management)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    gender VARCHAR(20),
    dob DATE,
    city VARCHAR(255),
    district VARCHAR(255),
    address TEXT,
    national_id VARCHAR(100),
    role ENUM('Admin', 'Owner', 'Guest') DEFAULT 'Guest',
    status ENUM('Active', 'Inactive', 'Blocked') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bookings Table (Unified Booking Engine)
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
);

