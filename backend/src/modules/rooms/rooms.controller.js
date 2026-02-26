const roomsService = require('./rooms.service');
const { sendResponse, sendError } = require('../../utils/response');

class RoomsController {
    async getRoomsByHotelId(req, res) {
        try {
            const { hotelId } = req.params;
            const rooms = await roomsService.getRoomsByHotelId(hotelId);
            return sendResponse(res, 200, true, 'Rooms retrieved successfully', rooms);
        } catch (error) {
            console.error('Error fetching rooms:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async createRoom(req, res) {
        try {
            const roomId = await roomsService.createRoom(req.body);
            return sendResponse(res, 201, true, 'Room created successfully', { id: roomId });
        } catch (error) {
            console.error('Error creating room:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async updateRoom(req, res) {
        try {
            const { id } = req.params;
            const success = await roomsService.updateRoom(id, req.body);
            if (!success) {
                return sendError(res, 404, 'Room not found or no changes made');
            }
            return sendResponse(res, 200, true, 'Room updated successfully');
        } catch (error) {
            console.error('Error updating room:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async deleteRoom(req, res) {
        try {
            const { id } = req.params;
            const success = await roomsService.deleteRoom(id);
            if (!success) {
                return sendError(res, 404, 'Room not found');
            }
            return sendResponse(res, 200, true, 'Room deleted successfully');
        } catch (error) {
            console.error('Error deleting room:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }
}

module.exports = new RoomsController();
