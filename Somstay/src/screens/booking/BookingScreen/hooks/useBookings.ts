import { useState, useEffect, useCallback } from 'react';
import BookingService from '@/src/services/booking/bookingService';
import { Booking } from '../components/BookingCard';
import { useFocusEffect } from 'expo-router';

// Fallback images
const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
];

import { carService } from '@/src/services/api/carService';

export const useBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            // Fetch both regular and car bookings in parallel
            const [propertyRes, carRes] = await Promise.all([
                BookingService.getMyBookings('1'),
                carService.getMyBookings(1)
            ]);

            let allBookings: Booking[] = [];

            // Process property/room bookings
            if (propertyRes && propertyRes.success && propertyRes.data) {
                const formatted = propertyRes.data.map((item: any) => {
                    const checkInDate = new Date(item.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const checkOutDate = new Date(item.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                    return {
                        id: `p-${item.id}`,
                        title: item.title || item.entity_name || `${item.entity_type} Booking`,
                        dateRange: `${checkInDate} - ${checkOutDate}`,
                        status: (item.status && ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(item.status.toUpperCase()))
                            ? item.status.toUpperCase() as any
                            : 'PENDING',
                        image: (item.main_image && item.main_image.startsWith('http'))
                            ? item.main_image
                            : `http://206.183.129.220:5000/uploads/${item.main_image || 'placeholder.jpg'}`,
                        entity_type: item.entity_type,
                        entity_id: item.entity_id,
                    };
                });
                allBookings = [...allBookings, ...formatted];
            }

            // Process car bookings
            if (carRes && carRes.success && carRes.data) {
                const formattedCars = carRes.data.map((item: any) => {
                    const pickupDate = new Date(item.pickup_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const returnDate = new Date(item.return_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                    return {
                        id: `c-${item.id}`, // Prefixing for uniqueness
                        title: `${item.make} ${item.model} Rental`,
                        dateRange: `${pickupDate} - ${returnDate}`,
                        status: (item.status && ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(item.status.toUpperCase()))
                            ? item.status.toUpperCase() as any
                            : 'PENDING',
                        image: (item.main_image && item.main_image.startsWith('http'))
                            ? item.main_image
                            : `http://206.183.129.220:5000/uploads/${item.main_image || 'placeholder.jpg'}`,
                        entity_type: 'Car',
                        entity_id: item.car_id,
                    };
                });
                allBookings = [...allBookings, ...formattedCars];
            }

            setBookings(allBookings);
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchBookings();
        }, [])
    );

    return { bookings, loading, refresh: fetchBookings };
};
