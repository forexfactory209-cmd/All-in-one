import { useState, useEffect } from 'react';
import { TravelService } from '../components/TravelServicesCard';
import { carService } from '@/src/services/api/carService';
import { API_BASE_URL } from '@/src/services/api/endpoints';

const BASE_UPLOAD_URL = API_BASE_URL.replace('/api/v1', '');

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
        type: 'airport',
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
        type: 'intercity',
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
        type: 'tour',
    },
];

export const useTravelServices = (categoryId: string, filters?: any) => {
    const [services, setServices] = useState<TravelService[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                if (categoryId === '1') {
                    // Fetch real Car Rentals
                    const response = await carService.getCars();
                    const realCars: TravelService[] = response.data.map((car: any) => ({
                        id: car.id.toString(),
                        title: `${car.make} ${car.model}`,
                        provider: car.owner_name || 'Verified Partner',
                        rating: parseFloat(car.rating) || 4.8,
                        reviews: Math.floor(Math.random() * 50) + 10,
                        price: `$${car.price_per_day}`,
                        priceLabel: '/ DAY',
                        badge: car.transmission,
                        image: car.main_image 
                            ? (car.main_image.startsWith('http') ? car.main_image : `${BASE_UPLOAD_URL}${car.main_image}`)
                            : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
                        features: [`${car.seats} seats`, car.location],
                        type: 'car',
                        rawData: car // Keep raw data for details
                    }));
                    setServices(realCars);
                } else {
                    // Fallback to mock for others until implemented
                    let filtered = [...MOCK_SERVICES];
                    if (filters) {
                        if (filters.destination && filters.destination !== 'Somaliland') {
                            filtered = filtered.filter(s =>
                                s.title.toLowerCase().includes(filters.destination.toLowerCase()) ||
                                serviceMatchesDestination(s, filters.destination)
                            );
                        }
                    }
                    setServices(filtered);
                }
            } catch (error) {
                console.error('Error fetching travel services:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [categoryId, JSON.stringify(filters)]);

    return { services, loading };
};

const serviceMatchesDestination = (service: TravelService, destination: string) => {
    // Basic mapping for mock data purposes
    if (destination === 'Hargeisa') return service.title.includes('Hargeisa');
    if (destination === 'Berbera') return service.title.includes('Berbera');
    return true;
};
