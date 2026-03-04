import { useState, useEffect, useCallback } from 'react';
import PropertyService from '@/src/services/property/propertyService';

export const useHotelDetails = (id: string | number | undefined) => {
    const [hotel, setHotel] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDetails = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await PropertyService.getHotelById(id);
            setHotel(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch hotel details');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    return { hotel, loading, error, refetch: fetchDetails };
};
