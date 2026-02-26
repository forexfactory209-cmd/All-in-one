const bookingsService = require('./bookings.service');
const { sendResponse, sendError } = require('../../utils/response');

class BookingsController {
    async getAll(req, res) {
        try {
            const bookings = await bookingsService.getAllBookings();
            return sendResponse(res, 200, true, 'Bookings retrieved successfully', bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async create(req, res) {
        try {
            const bookingId = await bookingsService.createBooking(req.body);
            return sendResponse(res, 201, true, 'Booking created successfully', { id: bookingId });
        } catch (error) {
            console.error('Error creating booking:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async getMyBookings(req, res) {
        try {
            // userId would normally come from JWT
            const userId = req.params.userId;
            const bookings = await bookingsService.getUserBookings(userId);
            return sendResponse(res, 200, true, 'Bookings retrieved successfully', bookings);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async getDetails(req, res) {
        try {
            const { id } = req.params;
            const booking = await bookingsService.getBookingById(id);
            if (!booking) {
                return sendError(res, 404, 'Booking not found');
            }
            return sendResponse(res, 200, true, 'Booking details retrieved', booking);
        } catch (error) {
            console.error('Error fetching booking details:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, paymentStatus } = req.body;
            const success = await bookingsService.updateBookingStatus(id, status, paymentStatus);
            if (!success) {
                return sendError(res, 404, 'Booking not found or no updates provided');
            }
            return sendResponse(res, 200, true, 'Booking status updated successfully');
        } catch (error) {
            console.error('Error updating booking status:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const success = await bookingsService.updateBooking(id, req.body);
            if (!success) {
                return sendError(res, 404, 'Booking not found or no changes made');
            }
            return sendResponse(res, 200, true, 'Booking updated successfully');
        } catch (error) {
            console.error('Error updating booking:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const deleted = await bookingsService.deleteBooking(id);
            if (!deleted) {
                return sendError(res, 404, 'Booking not found');
            }
            return sendResponse(res, 200, true, 'Booking deleted successfully');
        } catch (error) {
            console.error('Error deleting booking:', error);
            return sendError(res, 500, 'Internal Server Error');
        }
    }
}

module.exports = new BookingsController();
