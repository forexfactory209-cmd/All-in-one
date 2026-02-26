const hotelsService = require('./hotels.service');
const { sendResponse, sendError } = require('../../utils/response');

class HotelsController {
    async getAllHotels(req, res) {
        try {
            const hotels = await hotelsService.getAllHotels();
            return sendResponse(res, 200, true, 'Hotels retrieved successfully', hotels);
        } catch (error) {
            console.error('Error fetching hotels:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async getHotelById(req, res) {
        try {
            const { id } = req.params;
            const hotel = await hotelsService.getHotelById(id);
            if (!hotel) {
                return sendError(res, 404, 'Hotel not found');
            }
            return sendResponse(res, 200, true, 'Hotel retrieved successfully', hotel);
        } catch (error) {
            console.error('Error fetching hotel:', error);
            return sendError(res, 500, 'Internal Server Error');
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
}

module.exports = new HotelsController();
