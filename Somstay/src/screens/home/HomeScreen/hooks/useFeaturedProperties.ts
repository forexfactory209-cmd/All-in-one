import { useState, useEffect } from 'react';
import { PropertyResponse } from '@/src/services/property/propertyService.types';

interface UseFeaturedPropertiesReturn {
    properties: PropertyResponse[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// Mock data for demonstration
const MOCK_PROPERTIES: PropertyResponse[] = [
    {
        id: '1',
        title: 'Lido Beach Luxury Villa',
        city: 'Abdiaziz District',
        country: 'Mogadishu',
        price_per_night: 150,
        average_rating: 4.9,
        photos: [{ photo_url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80' }],
    } as PropertyResponse,
    {
        id: '2',
        title: 'City Center Executive Suite',
        city: 'Waberi',
        country: 'Mogadishu',
        price_per_night: 85,
        average_rating: 4.7,
        photos: [{ photo_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80' }],
    } as PropertyResponse,
    {
        id: '3',
        title: 'Ocean View Estate',
        city: 'Hodan District',
        country: 'Mogadishu',
        price_per_night: 1200,
        average_rating: 5.0,
        photos: [{ photo_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80' }],
    } as PropertyResponse,
];

export const useFeaturedProperties = (): UseFeaturedPropertiesReturn => {
    const [properties, setProperties] = useState<PropertyResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFeaturedProperties = async () => {
        try {
            setLoading(true);
            setError(null);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setProperties(MOCK_PROPERTIES);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch properties');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeaturedProperties();
    }, []);

    return {
        properties,
        loading,
        error,
        refetch: fetchFeaturedProperties,
    };
};
