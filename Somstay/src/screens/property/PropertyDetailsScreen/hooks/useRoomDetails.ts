import { useState, useEffect, useCallback } from 'react';
import PropertyService from '@/src/services/property/propertyService';

export const useRoomDetails = (id: string | number | undefined, type: string = 'room') => {
    const [room, setRoom] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDetails = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            let data;
            if (type === 'property') {
                data = await PropertyService.getPropertyById(id);
            } else {
                data = await PropertyService.getRoomById(id);
            }
            setRoom(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch details');
        } finally {
            setLoading(false);
        }
    }, [id, type]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    return { room, loading, error, refetch: fetchDetails };
};
