import apiClient from './client';
import { SERVICE_ENDPOINTS } from './endpoints';

export const carService = {
    getCars: async () => {
        const response = await apiClient.get(SERVICE_ENDPOINTS.CARS);
        return response.data;
    },

    getCarById: async (id: string) => {
        const response = await apiClient.get(SERVICE_ENDPOINTS.CAR_DETAILS(id));
        return response.data;
    },

    checkAvailability: async (car_id: number, pickup_date: string, return_date: string) => {
        const response = await apiClient.post(SERVICE_ENDPOINTS.CHECK_CAR_AVAILABILITY, {
            car_id,
            pickup_date,
            return_date,
        });
        return response.data;
    },

    createBooking: async (bookingData: any) => {
        const response = await apiClient.post(SERVICE_ENDPOINTS.CAR_BOOKINGS, bookingData);
        return response.data;
    },

    getMyBookings: async (userId: number) => {
        const response = await apiClient.get(SERVICE_ENDPOINTS.MY_CAR_BOOKINGS, {
            params: { user_id: userId }
        });
        return response.data;
    },

    getBookingById: async (id: string) => {
        const response = await apiClient.get(`${SERVICE_ENDPOINTS.CAR_BOOKINGS}/${id}`);
        return response.data;
    },
};
