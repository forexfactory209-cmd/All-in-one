import api from '../../../services/api';

/**
 * Booking Service - Pure API Bridge
 * Manages guest bookings and availability.
 */
export const bookingService = {
    // Fetch all bookings
    getAllBookings: async () => {
        const response = await api.get('/v1/bookings');
        return response.data;
    },

    // Fetch single booking details
    getBookingById: async (id) => {
        const response = await api.get(`/v1/bookings/${id}`);
        return response.data;
    },

    // Fetch user bookings
    getBookingsByUserId: async (userId) => {
        const response = await api.get(`/v1/bookings/user/${userId}`);
        return response.data;
    },

    // Add manual booking
    addBooking: async (bookingData) => {
        return await api.post('/v1/bookings', bookingData);
    },

    // Update booking
    updateBooking: async (id, bookingData) => {
        return await api.put(`/v1/bookings/${id}`, bookingData);
    },

    // Update booking status
    updateBookingStatus: async (id, status, paymentStatus) => {
        return await api.put(`/v1/bookings/${id}/status`, { status, paymentStatus });
    },

    // Delete booking
    deleteBooking: async (id) => {
        return await api.delete(`/v1/bookings/${id}`);
    }
};
