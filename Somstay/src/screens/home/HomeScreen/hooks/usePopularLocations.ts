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
            const targetCitiesData = [
                { name: 'Hargeisa', displayName: 'Hargeisa', defaultImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80' },
                { name: 'Burco', displayName: 'Burco', defaultImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80' },
                { name: 'Borama', displayName: 'Borama', defaultImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=400&q=80' },
                { name: 'Berbera', displayName: 'Berbera', defaultImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80' },
                { name: 'Erigavo', displayName: 'Cerigabo', defaultImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=400&q=80' }
            ];

            const formattedLocations = targetCitiesData.map((target, index) => {
                const apiLoc = data.find((loc: any) => loc.name === target.name);
                let imageUrl = target.defaultImage;

                if (apiLoc && apiLoc.image) {
                    imageUrl = (apiLoc.image && typeof apiLoc.image === 'string' && apiLoc.image.startsWith('http'))
                        ? apiLoc.image
                        : `http://192.168.100.17:5000/uploads/${apiLoc.image || 'placeholder.jpg'}`;
                }

                return {
                    id: (index + 1).toString(),
                    name: target.displayName,
                    image: imageUrl
                };
            });

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
