import api from '../api/client';

export interface BookingData {
    user_id: string;
    entity_type: 'Property' | 'Room';
    entity_id: string;
    check_in: string;
    check_out: string;
    total_price: number;
    status?: string;
    payment_status?: string;
}

class BookingService {
    async createBooking(bookingData: BookingData) {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    }

    async getMyBookings(userId?: string) {
        const params = userId ? { userId } : {};
        const response = await api.get('/bookings/my-bookings', { params });
        return response.data;
    }

    async getBookingById(id: string) {
        const response = await api.get(`/bookings/${id}`);
        return response.data.data;
    }
}

export default new BookingService();
