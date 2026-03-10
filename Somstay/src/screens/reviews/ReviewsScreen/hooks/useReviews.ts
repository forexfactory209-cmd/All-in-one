import { useState, useEffect, useCallback } from 'react';
import reviewService, {
    EntityType, Review, ReviewStats, ReviewsResult
} from '@/src/services/review/reviewService';
import { Alert } from 'react-native';

interface UseReviewsOptions {
    entityType: EntityType;
    entityId:   number | string;
    sort?:      'newest' | 'highest' | 'lowest';
    limit?:     number;
}

export const useReviews = ({ entityType, entityId, sort = 'newest', limit = 10 }: UseReviewsOptions) => {
    const [reviews,    setReviews]    = useState<Review[]>([]);
    const [stats,      setStats]      = useState<ReviewStats | null>(null);
    const [pagination, setPagination] = useState({ total: 0, page: 1, limit, totalPages: 1 });
    const [loading,    setLoading]    = useState(true);
    const [loadingMore,setLoadingMore]= useState(false);
    const [error,      setError]      = useState<string | null>(null);
    const [page,       setPage]       = useState(1);
    const [sortMode,   setSortMode]   = useState(sort);

    const fetchReviews = useCallback(async (pageNum = 1, append = false) => {
        if (pageNum === 1) setLoading(true);
        else               setLoadingMore(true);
        setError(null);

        try {
            const result: ReviewsResult = await reviewService.getReviews(
                entityType, entityId, { page: pageNum, limit, sort: sortMode }
            );
            setStats(result.stats);
            setPagination(result.pagination);
            setReviews(prev => append ? [...prev, ...result.reviews] : result.reviews);
        } catch (e: any) {
            setError(e.message || 'Failed to load reviews.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [entityType, entityId, sortMode, limit]);

    useEffect(() => {
        setPage(1);
        fetchReviews(1, false);
    }, [fetchReviews]);

    const loadMore = () => {
        if (loadingMore || page >= pagination.totalPages) return;
        const nextPage = page + 1;
        setPage(nextPage);
        fetchReviews(nextPage, true);
    };

    const changeSort = (newSort: 'newest' | 'highest' | 'lowest') => {
        setSortMode(newSort);
        setPage(1);
    };

    const deleteReview = async (reviewId: number) => {
        try {
            await reviewService.deleteReview(reviewId);
            setReviews(prev => prev.filter(r => r.id !== reviewId));
            Alert.alert('Success', 'Review deleted.');
        } catch {
            Alert.alert('Error', 'Failed to delete review.');
        }
    };

    return {
        reviews, stats, pagination,
        loading, loadingMore, error,
        sortMode, changeSort,
        loadMore, deleteReview,
        refetch: () => fetchReviews(1, false),
    };
};
