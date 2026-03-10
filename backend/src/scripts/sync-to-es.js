const hotelsRepository = require('../modules/hotels/hotels.repository');
const hotelsSearchService = require('../modules/hotels/hotels.search.service');
const { initIndex, checkConnection } = require('../utils/elasticsearch');

const syncAll = async () => {
    console.log('🚀 Starting initial sync to Elasticsearch...');
    
    const isConnected = await checkConnection();
    if (!isConnected) {
        console.error('❌ Aborting sync: Could not connect to Elasticsearch.');
        process.exit(1);
    }

    try {
        await require('../config/database').initDatabase();
    } catch (dbError) {
        console.error('❌ Database initialization failed:', dbError);
        process.exit(1);
    }

    await initIndex();

    try {
        // Fetch all hotels (including deleted ones? No, only active/exists)
        const hotels = await hotelsRepository.findAll(1000, 0, {});
        console.log(`📦 Found ${hotels.length} hotels to index.`);

        if (hotels.length > 0) {
            const hotelIds = hotels.map(h => h.id);
            const allAmenities = await hotelsRepository.findAmenitiesByHotelIds(hotelIds);
            
            for (const hotel of hotels) {
                hotel.amenities = allAmenities[hotel.id] || [];
                await hotelsSearchService.indexHotel(hotel);
            }
        }

        console.log('✅ Sync completed successfully!');
    } catch (error) {
        console.error('❌ Sync failed:', error);
    } finally {
        process.exit(0);
    }
};

syncAll();
