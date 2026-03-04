import { useState, useEffect } from 'react';
import PropertyService from '@/src/services/property/propertyService';

export interface Location {
    id: string;
    name: string;
    image: string;
}

export const usePopularLocations = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLocations = async () => {
        try {
            setLoading(true);
            const data = await PropertyService.getLocations();
            // Map backend data to frontend Location interface
            const formattedLocations = data.map((loc: any, index: number) => ({
                id: (index + 1).toString(),
                name: loc.name,
                image: (loc.image && loc.image.startsWith('http'))
                    ? loc.image
                    : `http://206.183.129.220:5000/uploads/${loc.image}` // Fallback to VPS IP for images
            }));
            setLocations(formattedLocations);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch locations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    return { locations, loading, error, refetch: fetchLocations };
};
