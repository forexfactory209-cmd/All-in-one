import { useState, useEffect, useCallback, useRef } from 'react';
import { PropertyResponse } from '@/src/services/property/propertyService.types';
import PropertyService from '@/src/services/property/propertyService';

interface UseFeaturedHotelsReturn {
    hotels: PropertyResponse[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    hasMore: boolean;
    total: number;
    refetch: () => Promise<void>;
    loadMore: () => void;
}

const PAGE_SIZE = 10;

export const useFeaturedHotels = (filters = {}): UseFeaturedHotelsReturn => {
    const [hotels, setHotels] = useState<PropertyResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const isFetchingRef = useRef(false);

    const fetchPage = useCallback(async (pageNum: number, isNewSearch = false) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        try {
            const response = await PropertyService.getHotels(pageNum, PAGE_SIZE, filters);
            const newHotels = response.data;
            const pagination = response.pagination;

            setHotels(prev => (isNewSearch ? newHotels : [...prev, ...newHotels]));
            setTotal(pagination?.total || 0);
            setHasMore(pageNum < (pagination?.totalPages || 1));
            setPage(pageNum + 1);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch hotels');
        } finally {
            isFetchingRef.current = false;
        }
    }, [filters]);

    const fetchFeaturedHotels = useCallback(async () => {
        setLoading(true);
        setError(null);
        await fetchPage(1, true);
        setLoading(false);
    }, [fetchPage]);

    const loadMore = useCallback(() => {
        if (!hasMore || isFetchingRef.current) return;
        setLoadingMore(true);
        fetchPage(page).finally(() => setLoadingMore(false));
    }, [hasMore, page, fetchPage]);

    useEffect(() => {
        fetchFeaturedHotels();
    }, [filters]);

    return {
        hotels,
        loading,
        loadingMore,
        error,
        hasMore,
        total,
        refetch: fetchFeaturedHotels,
        loadMore,
    };
};
