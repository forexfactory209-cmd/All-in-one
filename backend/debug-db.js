const pool = require('./src/config/database');

async function debugData() {
    try {
        console.log('--- DEBUGGING DATA ---');

        const [props] = await pool.query('SELECT id, name, owner_name, owner_phone, owner_email, main_image FROM properties ORDER BY id DESC LIMIT 2');
        console.log('LATEST PROPERTIES:', JSON.stringify(props, null, 2));

        if (props.length > 0) {
            const lastId = props[0].id;
            const [imgs] = await pool.query('SELECT * FROM property_images WHERE property_id = ?', [lastId]);
            console.log(`IMAGES FOR PROPERTY ${lastId}:`, JSON.stringify(imgs, null, 2));

            const [amens] = await pool.query('SELECT * FROM property_amenities WHERE property_id = ?', [lastId]);
            console.log(`AMENITIES FOR PROPERTY ${lastId}:`, JSON.stringify(amens, null, 2));
        }

        const [hotels] = await pool.query('SELECT id, name, owner_name, owner_phone, owner_email, main_image FROM hotels ORDER BY id DESC LIMIT 2');
        console.log('LATEST HOTELS:', JSON.stringify(hotels, null, 2));

        if (hotels.length > 0) {
            const lastHotelId = hotels[0].id;
            const [hotelImgs] = await pool.query('SELECT * FROM property_images WHERE hotel_id = ?', [lastHotelId]);
            console.log(`IMAGES FOR HOTEL ${lastHotelId}:`, JSON.stringify(hotelImgs, null, 2));
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Debug failed:', error.message);
        process.exit(1);
    }
}

debugData();
