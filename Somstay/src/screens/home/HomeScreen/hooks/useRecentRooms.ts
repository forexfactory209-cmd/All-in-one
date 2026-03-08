import { useState, useEffect, useCallback } from 'react';
import api from '@/src/services/api/client';

export interface Room {
    id: string;
    hotel_id: string;
    room_number: string;
    type: string;
    price: number;
    beds: number;
    max_guests: number;
    status: string;
    image: string;
    description: string;
    hotel_name: string;
    location: string;
    title: string;
}

export const useRecentRooms = (filters: any = {}) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRooms = useCallback(async (pageNum: number, isNewSearch: boolean = false) => {
        try {
            if (isNewSearch) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            const response = await api.get('/rooms', {
                params: {
                    page: pageNum,
                    limit: 10,
                    ...filters
                }
            });

            const newRooms = response.data.data;
            const pagination = response.data.pagination;

            if (isNewSearch) {
                setRooms(newRooms);
            } else {
                setRooms(prev => [...prev, ...newRooms]);
            }

            setHasMore(pageNum < pagination.totalPages);
            setPage(pageNum);
            setError(null);
        } catch (err: any) {
            setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
            // If it failed, don't immediately allow retrying via infinite scroll
            setHasMore(false); // Stop infinite scroll on error until manual refresh
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchRooms(1, true);
    }, [filters, fetchRooms]);

    const loadMore = () => {
        if (!loading && !loadingMore && hasMore) {
            fetchRooms(page + 1);
        }
    };

    const refetch = () => {
        setHasMore(true);
        setError(null);
        return fetchRooms(1, true);
    };

    return { rooms, loading, loadingMore, hasMore, loadMore, refetch, error };
};
