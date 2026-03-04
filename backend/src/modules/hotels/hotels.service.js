const hotelsRepository = require('./hotels.repository');
const roomsRepository = require('../rooms/rooms.repository');
const cache = require('../../utils/cache');

class HotelsService {
    async getAllHotels(page = 1, limit = 10, filters = {}) {
        const cacheKey = `hotels:list:p${page}:l${limit}:f${JSON.stringify(filters)}`;
        const cachedData = await cache.get(cacheKey);
        if (cachedData) return cachedData;

        const offset = (page - 1) * limit;
        const hotels = await hotelsRepository.findAll(limit, offset, filters);
        const total = await hotelsRepository.countAll(filters);

        // Enrich each hotel with its amenities and images for the list view
        const enrichedHotels = await Promise.all(hotels.map(async (hotel) => {
            hotel.amenities = await hotelsRepository.findAmenitiesByHotelId(hotel.id);
            hotel.images = await hotelsRepository.findImagesByHotelId(hotel.id);
            return hotel;
        }));

        const result = {
            hotels: enrichedHotels,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        };

        // Cache for 5 minutes
        await cache.set(cacheKey, result, 300);
        return result;
    }

    async getHotelById(id) {
        const cacheKey = `hotels:detail:${id}`;
        const cachedData = await cache.get(cacheKey);
        if (cachedData) return cachedData;

        const hotel = await hotelsRepository.findById(id);
        if (hotel) {
            hotel.amenities = await hotelsRepository.findAmenitiesByHotelId(id);
            hotel.rooms = await roomsRepository.findAllByHotelId(id);
        }

        if (hotel) {
            await cache.set(cacheKey, hotel, 300);
        }
        return hotel;
    }

    async createHotel(hotelData) {
        const hotelId = await hotelsRepository.create(hotelData);
        if (hotelData.amenities) {
            await hotelsRepository.syncAmenities(hotelId, hotelData.amenities);
        }
        if (hotelData.images) {
            await hotelsRepository.syncImages(hotelId, hotelData.images);
        }
        // Invalidate list cache
        await cache.delByPattern('hotels:list:*');
        return hotelId;
    }

    async updateHotel(id, hotelData) {
        let updated = await hotelsRepository.update(id, hotelData);
        if (hotelData.amenities) {
            await hotelsRepository.syncAmenities(id, hotelData.amenities);
            updated = true;
        }
        if (hotelData.images) {
            await hotelsRepository.syncImages(id, hotelData.images);
            updated = true;
        }

        if (updated) {
            // Invalidate caches
            await cache.del(`hotels:detail:${id}`);
            await cache.delByPattern('hotels:list:*');
        }
        return updated;
    }

    async deleteHotel(id) {
        const success = await hotelsRepository.delete(id);
        if (success) {
            await cache.del(`hotels:detail:${id}`);
            await cache.delByPattern('hotels:list:*');
        }
        return success;
    }

    async getLocations() {
        const cacheKey = 'hotels:locations';
        const cachedData = await cache.get(cacheKey);
        if (cachedData) return cachedData;

        const locations = await hotelsRepository.findUniqueLocations();
        await cache.set(cacheKey, locations, 3600); // 1 hour cache
        return locations;
    }
}

module.exports = new HotelsService();
