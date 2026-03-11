const hotelsService = require('./hotels.service');
const { sendResponse, sendError } = require('../../utils/response');

class HotelsController {
    async getAllHotels(req, res) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const result = await hotelsService.getAllHotels(parseInt(page), parseInt(limit), filters);
            return sendResponse(res, 200, true, 'Hotels retrieved successfully', result.hotels, null, result.pagination);
        } catch (error) {
            console.error('Error fetching hotels:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async getHotelById(req, res) {
        try {
            const { id } = req.params;
            const hotel = await hotelsService.getHotelById(id);
            if (!hotel) return sendError(res, 404, 'Hotel not found');
            return sendResponse(res, 200, true, 'Hotel details fetched', hotel);
        } catch (error) {
            console.error('getHotelById:', error);
            return sendError(res, 500, error.message);
        }
    }

    async getHotelBasic(req, res) {
        try {
            const { id } = req.params;
            const hotel = await hotelsService.getHotelById(id, { skipRooms: true, skipReviews: true });
            if (!hotel) return sendError(res, 404, 'Hotel not found');
            return sendResponse(res, 200, true, 'Basic hotel info fetched', hotel);
        } catch (error) {
            return sendError(res, 500, error.message);
        }
    }

    async getHotelRooms(req, res) {
        try {
            const { id } = req.params;
            const result = await hotelsService.getHotelRooms(id);
            return sendResponse(res, 200, true, 'Hotel rooms fetched', result);
        } catch (error) {
            return sendError(res, 500, error.message);
        }
    }

    async getHotelReviews(req, res) {
        try {
            const { id } = req.params;
            const { page = 1, limit = 5 } = req.query;
            const results = await hotelsService.getHotelReviews(id, page, limit);
            return sendResponse(res, 200, true, 'Hotel reviews fetched', results);
        } catch (error) {
            return sendError(res, 500, error.message);
        }
    }

    async createHotel(req, res) {
        try {
            const hotelId = await hotelsService.createHotel(req.body);
            return sendResponse(res, 201, true, 'Hotel created successfully', { id: hotelId });
        } catch (error) {
            console.error('Error creating hotel:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async updateHotel(req, res) {
        try {
            const { id } = req.params;
            const success = await hotelsService.updateHotel(id, req.body);
            if (!success) {
                return sendError(res, 404, 'Hotel not found or no changes made');
            }
            return sendResponse(res, 200, true, 'Hotel updated successfully');
        } catch (error) {
            console.error('Error updating hotel:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async deleteHotel(req, res) {
        try {
            const { id } = req.params;
            const success = await hotelsService.deleteHotel(id);
            if (!success) {
                return sendError(res, 404, 'Hotel not found');
            }
            return sendResponse(res, 200, true, 'Hotel deleted successfully');
        } catch (error) {
            console.error('Error deleting hotel:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async getLocations(req, res) {
        try {
            const locations = await hotelsService.getLocations();
            return sendResponse(res, 200, true, 'Locations retrieved successfully', locations);
        } catch (error) {
            console.error('Error fetching locations:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async searchHotels(req, res) {
        try {
            const { page = 1, limit = 10, ...filters } = req.query;
            const result = await hotelsService.searchHotels({
                ...filters,
                page: parseInt(page),
                limit: parseInt(limit)
            });
            return sendResponse(res, 200, true, 'Search results retrieved successfully', result.hotels, null, result.pagination);
        } catch (error) {
            console.error('Error searching hotels:', error);
            return sendError(res, 500, 'Search failed: ' + error.message);
        }
    }
}

module.exports = new HotelsController();
