const pool = require('./src/config/database');
const { initDatabase } = require('./src/config/database');
const cache = require('./src/utils/cache');

async function setup() {
    try {
        console.log('🔄 Initializing Database...');
        await initDatabase();

        console.log('🏗️ Creating wishlist table if not exists...');
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS wishlist (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                entity_type ENUM('Hotel', 'Property') NOT NULL,
                entity_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY (user_id, entity_type, entity_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('✅ Wishlist table ready.');

        console.log('🧹 Clearing Redis cache to remove stale data...');
        // We use delByPattern with '*' to clear everything
        await cache.delByPattern('*');
        console.log('✅ Cache cleared.');

        console.log('🚀 Setup completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Setup failed:', err.message);
        process.exit(1);
    }
}

setup();
