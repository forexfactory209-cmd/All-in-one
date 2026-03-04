import { useState, useEffect, useCallback } from 'react';
import wishlistService from '@/src/services/wishlist/wishlistService';

export const useWishlist = () => {
    const [wishlistedIds, setWishlistedIds] = useState<Set<number | string>>(new Set());
    const [loading, setLoading] = useState(false);

    const fetchWishlist = useCallback(async () => {
        try {
            setLoading(true);
            const data = await wishlistService.getMyWishlist();
            const ids = new Set<string | number>(data.map((item: any) => item.entity_id.toString()));
            setWishlistedIds(ids);
        } catch (error) {
            console.error('Failed to fetch wishlist', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const toggleWishlist = async (entityId: string | number, entityType: 'Hotel' | 'Property' = 'Hotel') => {
        // Optimistic update
        const stringId = entityId.toString();
        setWishlistedIds(prev => {
            const next = new Set(prev);
            if (next.has(stringId)) {
                next.delete(stringId);
            } else {
                next.add(stringId);
            }
            return next;
        });

        try {
            await wishlistService.toggleWishlist(entityType, Number(entityId));
        } catch (error) {
            console.error('Failed to toggle wishlist', error);
            // Rollback on error
            setWishlistedIds(prev => {
                const next = new Set(prev);
                if (next.has(stringId)) {
                    next.delete(stringId);
                } else {
                    next.add(stringId);
                }
                return next;
            });
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    return { wishlistedIds, toggleWishlist, loading, refetch: fetchWishlist };
};
