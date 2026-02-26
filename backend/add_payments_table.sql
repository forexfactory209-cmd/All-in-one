-- Add Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    method_name VARCHAR(50) NOT NULL, -- ZAAD, eDahab, Sahal, Mastercard, etc.
    provider VARCHAR(100), -- Hormuud, Somtel, IBS Bank, etc.
    method_type ENUM('Mobile', 'Card', 'Bank Transfer', 'Cash') DEFAULT 'Mobile',
    status ENUM('Pending', 'Success', 'Failed', 'Refunded') DEFAULT 'Pending',
    verified_at TIMESTAMP NULL,
    verified_by INT, -- ID of the admin who verified it
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Note: Ensure this is executed in the database to enable the payment tracking features.
