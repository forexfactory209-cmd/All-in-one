import { useState, useEffect } from 'react';
import { Property } from '../components/ExplorePropertyCard';
import PropertyService from '@/src/services/property/propertyService';

export const useExploreProperties = (filters?: any) => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                // Use getHotels instead of getProperties as requested
                const response = await PropertyService.getHotels(1, 20, filters);

                // Map API data to Property interface (API returns mapping in data field)
                const mappedProperties: Property[] = response.data.map((h: any) => ({
                    id: h.id.toString(),
                    title: h.title || h.name,
                    location: h.city || h.location,
                    price: `$${h.price_per_night || h.base_price}`,
                    priceLabel: '/ night',
                    rating: parseFloat(h.average_rating || h.rating) || 4.5,
                    image: (h.photos && h.photos.length > 0) ? h.photos[0].photo_url : (h.main_image || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80'),
                    isVerified: h.isVerified !== undefined ? h.isVerified : true,
                    isFeatured: h.isFeatured !== undefined ? h.isFeatured : true,
                    type: h.type || 'Hotel',
                }));

                setProperties(mappedProperties);
                setError(null);
            } catch (err) {
                console.error('Error fetching explore properties:', err);
                setError('Failed to load properties');
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [JSON.stringify(filters)]);

    return { properties, loading, error };
};
