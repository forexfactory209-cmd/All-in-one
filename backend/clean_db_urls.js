const pool = require('./src/config/database');

async function clean() {
    try {
        await pool.initDatabase();

        console.log('Cleaning hotels table...');
        // Update main_image in hotels table
        // We'll replace 'http://localhost:5000/uploads/' with empty string or relative path
        const [hotels] = await pool.execute('SELECT id, main_image FROM hotels');
        for (const h of hotels) {
            if (h.main_image && h.main_image.includes('localhost:5000/uploads/')) {
                const newImg = h.main_image.split('/uploads/')[1];
                await pool.execute('UPDATE hotels SET main_image = ? WHERE id = ?', [newImg, h.id]);
                console.log(`Updated hotel ${h.id} main_image to ${newImg}`);
            }
        }

        console.log('Cleaning property_images table...');
        const [images] = await pool.execute('SELECT id, image_url FROM property_images');
        for (const img of images) {
            if (img.image_url && img.image_url.includes('localhost:5000/uploads/')) {
                const newImg = img.image_url.split('/uploads/')[1];
                await pool.execute('UPDATE property_images SET image_url = ? WHERE id = ?', [newImg, img.id]);
                console.log(`Updated image ${img.id} to ${newImg}`);
            }
        }

        console.log('Done cleaning database URLs.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
clean();
