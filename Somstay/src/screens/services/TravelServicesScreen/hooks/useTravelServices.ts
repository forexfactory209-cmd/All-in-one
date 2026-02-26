import { useState, useEffect } from 'react';
import { TravelService } from '../components/TravelServicesCard';

const MOCK_SERVICES: TravelService[] = [
    {
        id: '1',
        title: 'Hargeisa Airport Pickup',
        provider: 'Ahmed G.',
        rating: 4.9,
        reviews: 120,
        price: '$45',
        priceLabel: '/ TRIP',
        badge: 'Airport',
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
        features: ['4 seats', 'A/C'],
    },
    {
        id: '2',
        title: 'Intercity Travel (Hargeisa to Berbera)',
        provider: 'Mustafe K.',
        rating: 4.9,
        reviews: 85,
        price: '$120',
        priceLabel: '/ TRIP',
        badge: 'Intercity',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        features: ['7 seats', 'Large Luggage'],
    },
    {
        id: '3',
        title: 'Hargeisa City Highlights',
        provider: 'Abdi R.',
        rating: 4.8,
        reviews: 64,
        price: '$65',
        priceLabel: '/ HALF DAY',
        badge: 'City Tour',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        features: ['Guide Incl.'],
    },
];

export const useTravelServices = (filters?: any) => {
    const [services, setServices] = useState<TravelService[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            let filtered = [...MOCK_SERVICES];

            if (filters) {
                // Filter by Destination
                if (filters.destination && filters.destination !== 'Somaliland') {
                    filtered = filtered.filter(s =>
                        s.title.toLowerCase().includes(filters.destination.toLowerCase()) ||
                        serviceMatchesDestination(s, filters.destination)
                    );
                }

                // Filter by Rating
                if (filters.minRating && filters.minRating !== 'All') {
                    const minRating = parseInt(filters.minRating);
                    filtered = filtered.filter(s => s.rating >= minRating);
                }
            }

            setServices(filtered);
            setLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, [JSON.stringify(filters)]);

    return { services, loading };
};

const serviceMatchesDestination = (service: TravelService, destination: string) => {
    // Basic mapping for mock data purposes
    if (destination === 'Hargeisa') return service.title.includes('Hargeisa');
    if (destination === 'Berbera') return service.title.includes('Berbera');
    return true;
};
