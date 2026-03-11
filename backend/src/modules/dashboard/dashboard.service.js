const roomsService = require('../rooms/rooms.service');
const wishlistService = require('../wishlist/wishlist.service');
const bookingsService = require('../bookings/bookings.service');
const reviewsService = require('../reviews/reviews.service');
const hotelsService = require('../hotels/hotels.service');
const cache = require('../../utils/cache');

class DashboardService {
    /**
     * Aggregate data for the mobile dashboard / home page
     * Instead of 5 separate API calls, this returns everything in one go.
     */
    async getDashboardData(userId = 1) {
        const cacheKey = `dashboard:v1:u${userId}`;
        const cached = await cache.get(cacheKey);
        if (cached) return cached;

        // Fetching everything in parallel for maximum performance
        const [roomsData, wishlist, bookings, reviews, locations] = await Promise.all([
            // 1. Featured Rooms (simplified for lazy loading)
            roomsService.getAllRooms(1, 10, { simplified: true }),

            // 2. User Wishlist
            wishlistService.getUserWishlist(userId),

            // 3. User Recent Bookings
            bookingsService.getUserBookings(userId),

            // 4. User Reviews (simplified - no long body text)
            reviewsService.getUserReviews(userId, 1, 5, { simplified: true }),

            // 5. Popular Locations
            hotelsService.getLocations()
        ]);

        const result = {
            featured_rooms: roomsData.rooms,
            wishlist: wishlist || [],
            recent_bookings: bookings || [],
            my_reviews: reviews || [],
            locations: locations || [],
            timestamp: new Date().toISOString(),
            status: 'success'
        };

        // Cache for 2 minutes to keep it fresh but reduce DB load
        await cache.set(cacheKey, result, 120);

        return result;
    }
}

module.exports = new DashboardService();
