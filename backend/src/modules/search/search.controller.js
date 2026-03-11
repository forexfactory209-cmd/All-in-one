const searchService = require('./search.service');
const { sendResponse, sendError } = require('../../utils/response');

class SearchController {
    /**
     * Aggregated GET /api/v1/search
     * Heart of the Platform
     */
    async unifiedSearch(req, res) {
        try {
            const {
                city, checkIn, checkOut, guests, priceMin, priceMax, type, q, sort,
                page = 1, limit = 10
            } = req.query;

            const results = await searchService.performSearch({
                city, checkIn, checkOut, guests, priceMin, priceMax, type, q, sort,
                page: parseInt(page), limit: parseInt(limit)
            });

            return sendResponse(res, 200, true, 'Search results fetched! 🚀', results);
        } catch (error) {
            console.error('SearchController.unifiedSearch Error:', error.message);
            return sendError(res, 500, error.message);
        }
    }

    /**
     * GET /api/v1/availability
     * Real-time availability check (< 80ms)
     */
    async getAvailability(req, res) {
        try {
            const { roomId, checkIn, checkOut } = req.query;
            if (!roomId || !checkIn || !checkOut) {
                return sendError(res, 400, 'roomId, checkIn, and checkOut are required.');
            }

            const availability = await searchService.checkAvailability(roomId, checkIn, checkOut);

            return sendResponse(res, 200, true, 'Availability checked! 🚀', availability);
        } catch (error) {
            console.error('SearchController.getAvailability Error:', error.message);
            return sendError(res, 500, error.message);
        }
    }
}

module.exports = new SearchController();
