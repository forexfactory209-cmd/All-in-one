const screensService = require('./screens.service');
const { sendResponse, sendError } = require('../../utils/response');

class ScreensController {
    /**
     * GET /api/v1/screens/home
     */
    async getHome(req, res) {
        try {
            const userId = req.query.user_id || 1;
            const data = await screensService.getHomeScreen(userId);
            return sendResponse(res, 200, true, 'Home screen data fetched! 🚀', data);
        } catch (error) {
            console.error('ScreensController.getHome Error:', error.message);
            return sendError(res, 500, error.message);
        }
    }

    /**
     * GET /api/v1/screens/search
     */
    async getSearch(req, res) {
        try {
            const userId = req.query.user_id || 1;
            const filters = req.query;
            const data = await screensService.getSearchResults(filters, userId);
            return sendResponse(res, 200, true, 'Search results fetched! 🚀', data);
        } catch (error) {
            console.error('ScreensController.getSearch Error:', error.message);
            return sendError(res, 500, error.message);
        }
    }

    /**
     * GET /api/v1/screens/hotel-details/:hotelId
     */
    async getHotelDetail(req, res) {
        try {
            const { hotelId } = req.params;
            const userId = req.query.user_id || 1;
            const data = await screensService.getHotelDetails(hotelId, userId);

            if (!data) return sendError(res, 404, 'Hotel not found');

            return sendResponse(res, 200, true, 'Hotel details fetched! 🚀', data);
        } catch (error) {
            console.error('ScreensController.getHotelDetail Error:', error.message);
            return sendError(res, 500, error.message);
        }
    }

    /**
     * GET /api/v1/screens/booking-summary/:bookingId
     */
    async getBookingSummary(req, res) {
        try {
            const { bookingId } = req.params;
            const userId = req.query.user_id || 1;
            const data = await screensService.getBookingSummary(bookingId, userId);

            if (!data) return sendError(res, 404, 'Booking not found');

            return sendResponse(res, 200, true, 'Booking summary fetched! 🚀', data);
        } catch (error) {
            console.error('ScreensController.getBookingSummary Error:', error.message);
            return sendError(res, 500, error.message);
        }
    }

    async getDashboard(req, res) {
        try {
            const userId = req.query.user_id || 1;
            const data = await screensService.getDashboard(userId);
            return sendResponse(res, 200, true, 'User dashboard data fetched! 🚀', data);
        } catch (error) {
            console.error('ScreensController.getDashboard Error:', error.message);
            return sendError(res, 500, error.message);
        }
    }
}

module.exports = new ScreensController();
