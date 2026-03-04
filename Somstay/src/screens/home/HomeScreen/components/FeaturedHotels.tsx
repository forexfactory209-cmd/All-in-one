import React, { useCallback, memo } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    ActivityIndicator, ListRenderItemInfo,
} from 'react-native';
import { PropertyResponse } from '@/src/services/property/propertyService.types';
import { HotelCard } from './HotelCard';
import { styles } from './FeaturedHotels.styles';

interface FeaturedHotelsProps {
    hotels: PropertyResponse[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    wishlistedIds?: Set<number | string>;
    onHotelPress: (hotelId: string) => void;
    onLoadMore: () => void;
    onToggleWishlist?: (hotelId: string | number) => void;
}

// ── Skeleton row for initial load ──────────────────────────────────────────────
const SkeletonCard = memo(() => (
    <View style={styles.skeletonCard}>
        <View style={styles.skeletonImage} />
        <View style={styles.skeletonBody}>
            <View style={styles.skeletonTitle} />
            <View style={styles.skeletonSub} />
        </View>
    </View>
));
SkeletonCard.displayName = 'SkeletonCard';

const SKELETON_ROWS = [0, 1, 2]; // 3 rows × 2 cols = 6 skeleton cards

const SkeletonGrid = () => (
    <View style={{ paddingHorizontal: 14 }}>
        {SKELETON_ROWS.map((r) => (
            <View key={r} style={styles.row}>
                <SkeletonCard />
                <SkeletonCard />
            </View>
        ))}
    </View>
);

// ── Footer for lazy-load indicator ─────────────────────────────────────────────
const ListFooter = memo(({ loadingMore }: { loadingMore: boolean }) => {
    if (!loadingMore) return null;
    return (
        <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color="#0288AC" />
        </View>
    );
});
ListFooter.displayName = 'ListFooter';

// ── Main component ──────────────────────────────────────────────────────────────
export const FeaturedHotels: React.FC<FeaturedHotelsProps> = ({
    hotels,
    loading,
    loadingMore,
    hasMore,
    wishlistedIds = new Set(),
    onHotelPress,
    onLoadMore,
    onToggleWishlist,
}) => {
    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<PropertyResponse>) => (
            <HotelCard
                hotel={item}
                onPress={() => onHotelPress(item.id)}
                isWishlisted={wishlistedIds.has(item.id)}
                onToggleWishlist={() => onToggleWishlist?.(item.id)}
            />
        ),
        [onHotelPress, wishlistedIds, onToggleWishlist],
    );

    const keyExtractor = useCallback((item: PropertyResponse) => item.id, []);

    const handleEndReached = useCallback(() => {
        if (hasMore && !loadingMore) {
            onLoadMore();
        }
    }, [hasMore, loadingMore, onLoadMore]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Featured Hotels</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
            </View>

            {/* Body */}
            {loading ? (
                <SkeletonGrid />
            ) : (
                <FlatList
                    data={hotels}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.gridContent}
                    // ── Performance tuning ─────────────────────────────────────
                    scrollEnabled={false}          // outer ScrollView handles scroll
                    initialNumToRender={6}         // first 3 rows immediately
                    maxToRenderPerBatch={6}        // batch 6 per frame
                    windowSize={5}                 // render 5 screen-heights
                    removeClippedSubviews={true}   // unmount off-screen cards
                    updateCellsBatchingPeriod={50}
                    // ── Lazy load trigger ──────────────────────────────────────
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={<ListFooter loadingMore={loadingMore} />}
                />
            )}
        </View>
    );
};
