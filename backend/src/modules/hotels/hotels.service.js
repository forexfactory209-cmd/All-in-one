const hotelsRepository = require('./hotels.repository');
const roomsRepository = require('../rooms/rooms.repository');
const cache = require('../../utils/cache');

class HotelsService {
    mapHotel(hotel) {
        if (!hotel) return null;

        // Optimized mapping for production performance
        return {
            ...hotel,
            id: hotel.id.toString(),
            title: hotel.name,
            price_per_night: parseFloat(hotel.base_price) || 0,
            average_rating: parseFloat(hotel.rating) || 4.5,
            city: hotel.location || 'Hargeisa',
            country: 'Somalia',
            photos: [
                ...(hotel.main_image ? [{ id: 'main', photo_url: hotel.main_image }] : []),
                ...(hotel.images ? hotel.images.map((url, i) => ({ id: `img-${i}`, photo_url: url })) : [])
            ],
            isVerified: hotel.status === 'Active',
            isFeatured: hotel.rating >= 4.0,
            type: hotel.type || 'Hotel' 
        };
    }

    async getAllHotels(page = 1, limit = 10, filters = {}) {
        // Bumped version to v4 to refresh all hotel cache keys with correct types
        const cacheKey = `hotels:v4:list:p${page}:l${limit}:f${JSON.stringify(filters)}`;
        const cachedData = await cache.get(cacheKey);
        if (cachedData) return cachedData;

        const offset = (page - 1) * limit;
        const hotels = await hotelsRepository.findAll(limit, offset, filters);
        const total = await hotelsRepository.countAll(filters);

        if (hotels.length > 0) {
            const hotelIds = hotels.map(h => h.id);
            const allAmenities = await hotelsRepository.findAmenitiesByHotelIds(hotelIds);
            const allImages = await hotelsRepository.findImagesByHotelIds(hotelIds);

            // Enrich and map each hotel
            hotels.forEach(hotel => {
                hotel.amenities = allAmenities[hotel.id] || [];
                hotel.images = allImages[hotel.id] || [];
            });
        }

        const mappedHotels = hotels.map(hotel => this.mapHotel(hotel));

        const result = {
            hotels: mappedHotels,
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
        const cacheKey = `hotels:v3:detail:${id}`;
        const cachedData = await cache.get(cacheKey);
        if (cachedData) return cachedData;

        const hotel = await hotelsRepository.findById(id);
        if (hotel) {
            const [amenities, images, rooms] = await Promise.all([
                hotelsRepository.findAmenitiesByHotelId(id),
                hotelsRepository.findImagesByHotelId(id),
                roomsRepository.findAllByHotelId(id)
            ]);
            hotel.amenities = amenities;
            hotel.images = images;
            hotel.rooms = rooms;
        }

        const result = this.mapHotel(hotel);

        if (result) {
            await cache.set(cacheKey, result, 300);
        }
        return result;
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
