const roomsService = require('../rooms/rooms.service');
const hotelsService = require('../hotels/hotels.service');
const wishlistService = require('../wishlist/wishlist.service');
const bookingsService = require('../bookings/bookings.service');
const reviewsService = require('../reviews/reviews.service');
const paymentsService = require('../payments/payments.service');
const cache = require('../../utils/cache');

class ScreensService {
    /**
     * Helper to wrap parallel calls so one failure doesn't crash the entire response.
     */
    async _safe(promise, key = "unknown", defaultVal = null) {
        try {
            return await promise;
        } catch (error) {
            console.error(`[Aggregation Error] Section: ${key} - ${error.message}`);
            return defaultVal;
        }
    }

    /**
     * 1. HOME SCREEN
     * Target: /home-screen
     */
    async getHomeScreen(userId = 1) {
        const [roomsData, locations, wishlist, recentBookings, pendingReviews] = await Promise.all([
            this._safe(roomsService.getAllRooms(1, 10, { simplified: true }), "featured_rooms", { rooms: [] }),
            this._safe(hotelsService.getLocations(), "locations", []),
            this._safe(wishlistService.getUserWishlist(userId), "wishlist", []),
            this._safe(bookingsService.getUserBookings(userId), "recent_bookings", []),
            this._safe(reviewsService.getPendingReviewPrompts(userId), "pending_reviews", [])
        ]);

        return {
            featured_rooms: roomsData.rooms,
            locations: locations,
            wishlist: wishlist,
            recent_bookings: recentBookings.slice(0, 3), // Only most recent 3
            pending_reviews: pendingReviews,
            timestamp: new Date().toISOString()
        };
    }

    /**
     * 2. SEARCH RESULTS SCREEN
     * Target: /search-results
     */
    async getSearchResults(filters = {}, userId = 1) {
        const [hotelsData, locations, wishlist] = await Promise.all([
            // Use hotelsService.searchHotels if it exists or fallback to getAllHotels
            this._safe(hotelsService.getAllHotels(filters.page || 1, filters.limit || 10, filters), "search_results", { hotels: [] }),
            this._safe(hotelsService.getLocations(), "locations", []),
            this._safe(wishlistService.getUserWishlist(userId), "wishlist", [])
        ]);

        return {
            hotels: hotelsData.hotels,
            pagination: hotelsData.pagination,
            available_locations: locations,
            user_wishlist: wishlist.map(w => w.entity_id.toString()), // Useful for highlighting heart icons
            timestamp: new Date().toISOString()
        };
    }

    /**
     * 3. HOTEL DETAILS SCREEN
     * Target: /hotel-details/:id
     */
    async getHotelDetails(hotelId, userId = 1) {
        // Fetch basic hotel info first so we can use its location for related hotels
        const hotel = await hotelsService.getHotelById(hotelId);
        if (!hotel) return null;

        const [roomsData, reviewsData, relatedHotels, wishlist] = await Promise.all([
            this._safe(roomsService.getRoomsByHotelId(hotelId, 1, 10), "hotel_rooms", { rooms: [] }),
            this._safe(reviewsService.getReviewsByEntity('Hotel', hotelId, { page: 1, limit: 5 }), "hotel_reviews", { stats: {}, reviews: [] }),
            this._safe(hotelsService.getAllHotels(1, 4, { city: hotel.city }), "related_hotels", { hotels: [] }),
            this._safe(wishlistService.getUserWishlist(userId), "user_wishlist", [])
        ]);

        return {
            hotel,
            rooms: roomsData.rooms,
            reviews_stat: reviewsData.stats,
            top_reviews: reviewsData.reviews,
            related_hotels: relatedHotels.hotels.filter(h => h.id != hotelId),
            is_wishlisted: wishlist.some(w => w.entity_id == hotelId && w.entity_type == 'Hotel'),
            timestamp: new Date().toISOString()
        };
    }

    /**
     * 4. BOOKING SUMMARY SCREEN
     * Target: /booking-summary/:id
     */
    async getBookingSummary(bookingId, userId = 1) {
        const booking = await bookingsService.getBookingById(bookingId);
        if (!booking) return null;

        const [payment, policyInfo] = await Promise.all([
            this._safe(paymentsService.getPaymentByBookingId(bookingId), "payment_status", null),
            // Mock or separate policy service if available
            Promise.resolve({
                cancellation: "Free cancellation before 24h",
                support_phone: "+252 61 XXX XXXX",
                check_in_time: "14:00",
                check_out_time: "11:00"
            })
        ]);

        return {
            booking,
            payment,
            policies: policyInfo,
            timestamp: new Date().toISOString()
        };
    }
    /**
     * 5. USER DASHBOARD (AGGREGATION)
     * Target: /api/v1/dashboard
     */
    async getDashboard(userId = 1) {
        const [bookings, wishlist, recommendations, pendingReviews] = await Promise.all([
            this._safe(bookingsService.getUserBookings(userId), "recent_bookings", []),
            this._safe(wishlistService.getUserWishlist(userId), "wishlist", []),
            this._safe(roomsService.getAllRooms(1, 5, { simplified: true }), "recommendations", { rooms: [] }),
            this._safe(reviewsService.getPendingReviewPrompts(userId), "pending_reviews", [])
        ]);

        return {
            recent_bookings: bookings.slice(0, 5),
            wishlist: wishlist,
            recommendations: recommendations.rooms,
            pending_reviews: pendingReviews,
            notifications: [
                { id: 1, title: "Booking Confirmed", body: "Your stay at Safari Hotel is ready!", time: "2h ago" },
                { id: 2, title: "New Review", body: "Someone liked your review of Ocean View.", time: "1d ago" }
            ],
            timestamp: new Date().toISOString()
        };
    }
}

module.exports = new ScreensService();
