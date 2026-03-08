const pool = require('../config/database');

async function seedCoordinates() {
    try {
        console.log('--- Starting Coordinate Seeder ---');
        
        // Use a different port to avoid conflict with the running server
        process.env.DB_LOCAL_PORT = '3311';
        
        // Initialize the database (opens SSH tunnel etc)
        await pool.initDatabase();
        
        // Fetch all hotels that don't have coordinates
        const [hotels] = await pool.execute('SELECT id, name, location FROM hotels WHERE latitude IS NULL OR longitude IS NULL');
        
        if (hotels.length === 0) {
            console.log('✅ All hotels already have coordinates.');
            process.exit(0);
        }

        console.log(`Found ${hotels.length} hotels missing coordinates. Seeding them in Hargeisa area...`);

        // Base coordinates for Hargeisa
        const baseLat = 9.5624;
        const baseLng = 44.0670;

        for (const hotel of hotels) {
            // Add a small random offset so they don't overlap perfectly
            const latOffset = (Math.random() - 0.5) * 0.04;
            const lngOffset = (Math.random() - 0.5) * 0.04;
            
            const newLat = baseLat + latOffset;
            const newLng = baseLng + lngOffset;

            await pool.execute(
                'UPDATE hotels SET latitude = ?, longitude = ? WHERE id = ?',
                [newLat, newLng, hotel.id]
            );
            console.log(`📍 Updated ${hotel.name} with [${newLat.toFixed(6)}, ${newLng.toFixed(6)}]`);
        }

        console.log('--- Seeding Complete ---');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedCoordinates();
