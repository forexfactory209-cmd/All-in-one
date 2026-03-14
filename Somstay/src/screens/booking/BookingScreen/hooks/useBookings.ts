import { useState, useEffect, useCallback } from 'react';
import BookingService from '@/src/services/booking/bookingService';
import { Booking } from '../components/BookingCard';
import { useFocusEffect } from 'expo-router';
import { useApp } from '@/src/context/AppContext';
import { carService } from '@/src/services/api/carService';

export const useBookings = () => {
    const { user } = useApp();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        if (!user?.id) {
            console.log('DEBUG: useBookings - No user ID found, clearing bookings');
            setBookings([]);
            setLoading(false);
            return;
        }

        try {
            console.log('DEBUG: useBookings - Fetching for user.id:', user.id, 'Type:', typeof user.id);
            // Fetch both regular and car bookings in parallel using the real user ID
            const [propertyRes, carRes] = await Promise.all([
                BookingService.getMyBookings(user.id.toString()),
                carService.getMyBookings(Number(user.id))
            ]);

            console.log('DEBUG: useBookings - Property API Response:', JSON.stringify(propertyRes));
            console.log('DEBUG: useBookings - Car API Response:', JSON.stringify(carRes));

            let allBookings: Booking[] = [];

            // Process property/room bookings
            if (propertyRes && propertyRes.success && propertyRes.data) {
    const formatted = propertyRes.data.map((item: any) => {
        const checkInDate = item.check_in ? new Date(item.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
        const checkOutDate = item.check_out ? new Date(item.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

        // Log each individual item to see its status and user_id
        console.log(`DEBUG: useBookings - Item ID: ${item.id}, Status: ${item.status}, UserID: ${item.user_id}`);

        return {
            id: `p-${item.id}`,
            title: item.title || item.entity_name || `${item.entity_type} Booking`,
            dateRange: `${checkInDate} - ${checkOutDate}`,
            status: (item.status && ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(item.status.toUpperCase()))
                ? item.status.toUpperCase() as any
                : 'PENDING',
            image: (item.main_image && item.main_image.startsWith('http'))
                ? item.main_image
                : (item.main_image ? `http://206.183.129.220:9050/uploads/${item.main_image}` : 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80'),
            entity_type: item.entity_type,
            entity_id: item.entity_id,
            user_id: item.user_id
        };
    });
                allBookings = [...allBookings, ...formatted];
            }

            // Process car bookings
            if (carRes && carRes.success && carRes.data) {
                const formattedCars = carRes.data.map((item: any) => {
                    const pickupDate = item.pickup_date ? new Date(item.pickup_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
                    const returnDate = item.return_date ? new Date(item.return_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

                    return {
                        id: `c-${item.id}`, // Prefixing for uniqueness
                        title: `${item.make} ${item.model} Rental`,
                        dateRange: `${pickupDate} - ${returnDate}`,
                        status: (item.status && ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(item.status.toUpperCase()))
                            ? item.status.toUpperCase() as any
                            : 'PENDING',
                        image: (item.main_image && item.main_image.startsWith('http'))
                            ? item.main_image
                            : `http://206.183.129.220:9050/uploads/${item.main_image || 'placeholder.jpg'}`,
                        entity_type: 'Car',
                        entity_id: item.car_id,
                        user_id: item.user_id || user.id, // Pass user_id to prevent filtering drop/crash
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
