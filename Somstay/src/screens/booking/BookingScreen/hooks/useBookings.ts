import { useState, useEffect } from 'react';
import { Booking } from '../components/BookingCard';

const MOCK_BOOKINGS: Booking[] = [
    {
        id: '1',
        title: 'Modern Oceanview Villa',
        dateRange: 'Oct 12 - Oct 15, 2023',
        status: 'PENDING',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '2',
        title: 'City Center Suite',
        dateRange: 'Nov 02 - Nov 05, 2023',
        status: 'CONFIRMED',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '3',
        title: 'Lido Beach Luxury Villa',
        dateRange: 'Aug 20 - Aug 25, 2023',
        status: 'COMPLETED',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
];

export const useBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setBookings(MOCK_BOOKINGS);
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    return { bookings, loading };
};
