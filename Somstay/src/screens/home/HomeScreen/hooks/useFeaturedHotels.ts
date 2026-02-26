import { useState, useEffect } from 'react';
import { PropertyResponse } from '@/src/services/property/propertyService.types';

interface UseFeaturedHotelsReturn {
    hotels: PropertyResponse[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const MOCK_HOTELS: PropertyResponse[] = [
    {
        id: 'h1',
        title: 'SomView Grand Hotel',
        city: 'Karaan District',
        country: 'Mogadishu',
        price_per_night: 200,
        average_rating: 4.8,
        photos: [{ photo_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80' }],
    } as PropertyResponse,
    {
        id: 'h2',
        title: 'Hargeisa Heights Hotel',
        city: 'Downtown',
        country: 'Hargeisa',
        price_per_night: 130,
        average_rating: 4.6,
        photos: [{ photo_url: 'https://images.unsplash.com/photo-1551882547-ff43c637f6d4?auto=format&fit=crop&w=800&q=80' }],
    } as PropertyResponse,
    {
        id: 'h3',
        title: 'Lido Beach Hotel & Resort',
        city: 'Beachfront',
        country: 'Mogadishu',
        price_per_night: 250,
        average_rating: 4.9,
        photos: [{ photo_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80' }],
    } as PropertyResponse,
];

export const useFeaturedHotels = (): UseFeaturedHotelsReturn => {
    const [hotels, setHotels] = useState<PropertyResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFeaturedHotels = async () => {
        try {
            setLoading(true);
            setError(null);
            await new Promise(resolve => setTimeout(resolve, 500));
            setHotels(MOCK_HOTELS);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch hotels');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeaturedHotels();
    }, []);

    return {
        hotels,
        loading,
        error,
        refetch: fetchFeaturedHotels,
    };
};
