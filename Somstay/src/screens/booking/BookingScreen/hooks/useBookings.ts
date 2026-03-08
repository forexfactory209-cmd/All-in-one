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

export const useBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            // Using user_id=1 as default placeholder
            const response = await BookingService.getMyBookings('1');

            if (response && response.success && response.data) {
                const formatted = response.data.map((item: any) => {
                    const checkInDate = new Date(item.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const checkOutDate = new Date(item.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    
                    return {
                        id: item.id.toString(),
                        title: item.title || item.entity_name || `${item.entity_type} Booking`,
                        dateRange: `${checkInDate} - ${checkOutDate}`,
                        status: (item.status && ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(item.status.toUpperCase()))
                            ? item.status.toUpperCase() as any
                            : 'PENDING',
                        image: FALLBACK_IMAGES[item.id % FALLBACK_IMAGES.length],
                    };
                });
                setBookings(formatted);
            }
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
