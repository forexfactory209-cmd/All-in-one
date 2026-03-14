const hotelsRepository = require('./hotels.repository');
const roomsRepository = require('../rooms/rooms.repository');
const cache = require('../../utils/cache');
const searchService = require('./hotels.search.service');

class HotelsService {
    mapHotel(hotel) {
        if (!hotel) return null;

        const baseUrl = process.env.IMAGE_BASE_URL || `http://localhost:5000/uploads/`;

        // Helper to format image URLs
        const formatImg = (url) => {
            if (!url) return null;
            if (url.startsWith('http')) return url;
            return `${baseUrl}${url}`;
        };

        const mainImg = formatImg(hotel.main_image);
        const allImages = (hotel.images || []).map(url => formatImg(url)).filter(Boolean);

        return {
            ...hotel,
            id: hotel.id.toString(),
            title: hotel.name,
            main_image: mainImg,
            price_per_night: parseFloat(hotel.base_price) || 0,
            average_rating: parseFloat(hotel.rating) || 0,
            review_count: parseInt(hotel.review_count) || 0,
            city: hotel.location || 'Hargeisa',
            country: 'Somalia',
            photos: [
                ...(mainImg ? [{ id: 'main', photo_url: mainImg }] : []),
                ...allImages.map((url, i) => ({ id: `img-${i}`, photo_url: url }))
            ],
            isVerified: hotel.status === 'Active',
            isFeatured: (parseFloat(hotel.rating) || 0) >= 4.0,
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

    async getHotelById(id, options = {}) {
        const cacheKey = `hotels:v3:detail:${id}`;
        const cachedData = await cache.get(cacheKey);
        if (cachedData && !options.skipRooms && !options.skipReviews) return cachedData;

        const hotel = await hotelsRepository.findById(id);
        if (!hotel) return null;

        if (!options.skipRooms && !options.skipReviews) {
            const [amenities, images, roomResult] = await Promise.all([
                hotelsRepository.findAmenitiesByHotelId(id),
                hotelsRepository.findImagesByHotelId(id),
                roomsRepository.findAllByHotelId(id)
            ]);
            hotel.amenities = amenities;
            hotel.images = images;
            hotel.rooms = roomResult;
        } else {
            // Minimal data for lazy loading
            const [amenities, images] = await Promise.all([
                hotelsRepository.findAmenitiesByHotelId(id),
                hotelsRepository.findImagesByHotelId(id)
            ]);
            hotel.amenities = amenities;
            hotel.images = images;
        }

        const result = this.mapHotel(hotel);
        if (result && !options.skipRooms && !options.skipReviews) {
            await cache.set(cacheKey, result, 300);
        }
        return result;
    }

    async getHotelRooms(id) {
        return await roomsRepository.findAllByHotelId(id, 50, 0);
    }

    async getHotelReviews(id, page = 1, limit = 5) {
        const reviewsService = require('../reviews/reviews.service');
        return await reviewsService.getReviewsByEntity('Hotel', id, { page, limit });
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

        // Index in Elasticsearch
        try {
            const hotel = await hotelsRepository.findById(hotelId);
            if (hotel) {
                const amenities = await hotelsRepository.findAmenitiesByHotelId(hotelId);
                hotel.amenities = amenities;
                await searchService.indexHotel(hotel);
            }
        } catch (err) {
            console.error('Failed to index new hotel in ES:', err);
        }

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

            // Update in Elasticsearch
            try {
                const hotel = await hotelsRepository.findById(id);
                if (hotel) {
                    const amenities = await hotelsRepository.findAmenitiesByHotelId(id);
                    hotel.amenities = amenities;
                    await searchService.indexHotel(hotel);
                }
            } catch (err) {
                console.error('Failed to update hotel in ES:', err);
            }
        }
        return updated;
    }

    async deleteHotel(id) {
        const success = await hotelsRepository.delete(id);
        if (success) {
            await cache.del(`hotels:detail:${id}`);
            await cache.delByPattern('hotels:list:*');

            // Delete from Elasticsearch
            try {
                await searchService.deleteHotel(id);
            } catch (err) {
                console.error('Failed to delete hotel from ES:', err);
            }
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

    /**
     * Search hotels using Elasticsearch
     */
    async searchHotels(filters) {
        const cacheKey = `search:v1:${JSON.stringify(filters)}`;
        try {
            const cachedResults = await cache.get(cacheKey);
            if (cachedResults) return cachedResults;

            const results = await searchService.search(filters);

            // Map the results back to the standard hotel format
            results.hotels = results.hotels.map(hotel => this.mapHotel(hotel));

            // Cache search results for 2 minutes (shorter TTL than list as search is dynamic)
            await cache.set(cacheKey, results, 120);

            return results;
        } catch (error) {
            console.error('SearchHotels Service Error:', error);
            throw error;
        }
    }
}

module.exports = new HotelsService();
