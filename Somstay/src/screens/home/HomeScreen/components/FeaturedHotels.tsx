import React, { useCallback, memo } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    ActivityIndicator, ListRenderItemInfo,
} from 'react-native';
import { PropertyResponse } from '@/src/services/property/propertyService.types';
import { HotelCard } from './HotelCard';
import { styles } from './FeaturedHotels.styles';
import { useApp, useTheme } from '@/src/context/AppContext';

// ── Skeleton row for initial load ──────────────────────────────────────────────
const SkeletonCard = memo(() => {
    const theme = useTheme();
    return (
        <View style={[styles.skeletonCard, { backgroundColor: theme.card }]}>
            <View style={[styles.skeletonImage, { backgroundColor: theme.surfaceSecondary }]} />
            <View style={styles.skeletonBody}>
                <View style={[styles.skeletonTitle, { backgroundColor: theme.surfaceSecondary }]} />
                <View style={[styles.skeletonSub, { backgroundColor: theme.surfaceSecondary }]} />
            </View>
        </View>
    );
});
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
    const theme = useTheme();
    if (!loadingMore) return null;
    return (
        <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={theme.primary} />
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
    const { t } = useApp();
    const theme = useTheme();

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
                <Text style={[styles.title, { color: theme.text }]}>{t('featured_hotels')}</Text>
                <TouchableOpacity>
                    <Text style={[styles.seeAll, { color: theme.primary }]}>{t('see_all')}</Text>
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
                    scrollEnabled={false}          // outer ScrollView handles scroll
                    initialNumToRender={6}
                    maxToRenderPerBatch={6}
                    windowSize={5}
                    removeClippedSubviews={true}
                    updateCellsBatchingPeriod={50}
                    onEndReached={handleEndReached}
                    onEndReachedThreshold={0.3}
                    ListFooterComponent={<ListFooter loadingMore={loadingMore} />}
                />
            )}
        </View>
    );
};

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
