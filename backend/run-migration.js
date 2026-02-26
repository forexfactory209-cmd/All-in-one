const pool = require('./src/config/database');

async function migrate() {
    try {
        console.log('Starting migration...');

        // Increase image URL lengths
        console.log('Increasing URL lengths...');
        await pool.execute('ALTER TABLE properties MODIFY COLUMN main_image VARCHAR(1024)');
        await pool.execute('ALTER TABLE hotels MODIFY COLUMN main_image VARCHAR(1024)');
        await pool.execute('ALTER TABLE property_images MODIFY COLUMN image_url VARCHAR(1024)');

        // Check properties columns
        const [propCols] = await pool.execute('SHOW COLUMNS FROM properties');
        const propColNames = propCols.map(c => c.Field);

        if (!propColNames.includes('owner_name')) {
            console.log('Adding owner columns to properties...');
            await pool.execute('ALTER TABLE properties ADD COLUMN owner_name VARCHAR(255), ADD COLUMN owner_phone VARCHAR(50), ADD COLUMN owner_email VARCHAR(255)');
        }

        // Check hotels columns
        const [hotelCols] = await pool.execute('SHOW COLUMNS FROM hotels');
        const hotelColNames = hotelCols.map(c => c.Field);

        if (!hotelColNames.includes('owner_name')) {
            console.log('Adding owner columns to hotels...');
            await pool.execute('ALTER TABLE hotels ADD COLUMN owner_name VARCHAR(255), ADD COLUMN owner_phone VARCHAR(50), ADD COLUMN owner_email VARCHAR(255)');
        }

        // Check property_images for hotel_id
        const [imageCols] = await pool.execute('SHOW COLUMNS FROM property_images');
        const imageColNames = imageCols.map(c => c.Field);

        if (!imageColNames.includes('hotel_id')) {
            console.log('Adding hotel_id column to property_images...');
            await pool.execute('ALTER TABLE property_images ADD COLUMN hotel_id INT AFTER property_id');
        }

        // Make property_id nullable to support hotel images
        console.log('Making property_id nullable in property_images...');
        await pool.execute('ALTER TABLE property_images MODIFY COLUMN property_id INT NULL');

        console.log('✅ Migration successful');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    }
}

migrate();
