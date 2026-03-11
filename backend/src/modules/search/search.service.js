const hotelsSearchService = require('../hotels/hotels.search.service');
const hotelsRepository = require('../hotels/hotels.repository');
const roomsRepository = require('../rooms/rooms.repository');
const cache = require('../../utils/cache');

class UnifiedSearchService {
    /**
     * The Heart of the Platform
     * Performs a combined search for Hotels and Rooms with advanced filtering.
     * Targets < 200ms using Search Engine (ES) and optimized DB queries.
     */
    async performSearch(filters = {}) {
        const cacheKey = `search:v2:${JSON.stringify(filters)}`;
        const cached = await cache.get(cacheKey);
        if (cached) return cached;

        const {
            city,
            checkIn,
            checkOut,
            guests = 1,
            priceMin,
            priceMax,
            type, // 'hotel', 'resort', 'apartment'
            sort = 'relevance',
            page = 1,
            limit = 10
        } = filters;

        // 1. Determine Search Engine Usage (ES fallback to DB)
        let hotelsData;
        try {
            // Note: In a production environment, we'd search primarily in ES for speed.
            // ES contains the flattened hotel + availability status if indexed properly.
            hotelsData = await hotelsSearchService.search({
                city,
                minPrice: priceMin,
                maxPrice: priceMax,
                minRating: filters.minRating,
                q: filters.q,
                sort,
                page,
                limit
            });
        } catch (error) {
            console.warn('Elasticsearch search failed, falling back to DB Search:', error.message);
            // Fallback to optimized DB query with indexes
            const offset = (page - 1) * limit;
            const hotels = await hotelsRepository.findAll(limit, offset, {
                city,
                minPrice: priceMin,
                maxPrice: priceMax,
                type,
                sort
            });
            const total = await hotelsRepository.countAll({ city, minPrice: priceMin, maxPrice: priceMax, type });

            hotelsData = {
                hotels,
                pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
            };
        }

        // 2. Fetch specific rooms if available dates were provided
        let availableRooms = [];
        if (checkIn && checkOut && hotelsData.hotels.length > 0) {
            // Get rooms that belong to these hotels AND are available for the given range
            const hotelIds = hotelsData.hotels.map(h => h.id);
            // Optimized query: Only fetch top available rooms per hotel
            availableRooms = await this._searchAvailableRooms(hotelIds, checkIn, checkOut, guests, priceMin, priceMax);
        }

        // 3. Construct Aggregate Filters for UI
        const activeFilters = {
            city: city || 'All',
            price_range: [priceMin || 0, priceMax || 1000],
            available_types: ['Hotel', 'Resort', 'Apartment', 'Villa'],
            sort_options: [
                { key: 'relevance', label: 'Recommended' },
                { key: 'price_low', label: 'Price: Low to High' },
                { key: 'price_high', label: 'Price: High to Low' },
                { key: 'rating', label: 'Top Rated' }
            ]
        };

        const result = {
            hotels: hotelsData.hotels,
            rooms: availableRooms,
            filters: activeFilters,
            totalResults: hotelsData.pagination.total,
            pagination: hotelsData.pagination,
            timestamp: new Date().toISOString()
        };

        // Cache for 120 seconds to balance speed and accuracy
        await cache.set(cacheKey, result, 120);

        return result;
    }

    /**
     * Fast availability check for a specific room or hotel
     */
    async checkAvailability(roomId, checkIn, checkOut) {
        // High frequency endpoint, must be < 80ms
        // Real-time check from DB (FOR UPDATE is too slow for mere checking, use simple indexed count)
        const room = await roomsRepository.findById(roomId); // assume findById returns room + images
        if (!room) return { available: false, message: 'Room not found' };

        const isAvailable = await this._isAvailable(roomId, checkIn, checkOut);

        const pricePerNight = parseFloat(room.price) || 0;
        const totalNights = Math.max(1, (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));

        return {
            available: isAvailable,
            pricePerNight,
            totalPrice: pricePerNight * totalNights,
            currency: 'USD'
        };
    }

    // --- Private Optimized Helpers ---

    async _isAvailable(roomId, checkIn, checkOut) {
        // Optimized availability check using indexed fields
        const pool = require('../../config/database');
        const [rows] = await pool.execute(`
            SELECT COUNT(*) as count 
            FROM bookings 
            WHERE entity_id = ? AND entity_type = 'Room'
              AND status != 'Cancelled'
              AND deleted_at IS NULL
              AND check_in < ? AND check_out > ?
        `, [roomId, checkOut, checkIn]);

        return rows[0].count === 0;
    }

    async _searchAvailableRooms(hotelIds, checkIn, checkOut, guests, priceMin, priceMax) {
        // Optimized query to find available rooms across multiple hotels in one shot
        const pool = require('../../config/database');
        const placeholders = hotelIds.map(() => '?').join(',');

        const [rooms] = await pool.execute(`
            SELECT r.*, h.name as hotel_name, h.location as hotel_location
            FROM rooms r
            JOIN hotels h ON r.hotel_id = h.id
            WHERE r.hotel_id IN (${placeholders})
              AND r.deleted_at IS NULL
              AND r.max_guests >= ?
              ${priceMin ? 'AND r.price >= ' + parseFloat(priceMin) : ''}
              ${priceMax ? 'AND r.price <= ' + parseFloat(priceMax) : ''}
              AND r.id NOT IN (
                SELECT entity_id 
                FROM bookings 
                WHERE entity_type = 'Room' 
                  AND status != 'Cancelled'
                  AND deleted_at IS NULL
                  AND check_in < ? AND check_out > ?
              )
            LIMIT 20
        `, [...hotelIds, guests, checkOut, checkIn]);

        return rooms;
    }
}

module.exports = new UnifiedSearchService();
