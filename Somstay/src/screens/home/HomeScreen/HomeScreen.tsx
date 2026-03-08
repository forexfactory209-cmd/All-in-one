import React, { useState } from 'react';
import { View, ScrollView, StatusBar, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

// Screen-specific components
import { SearchBar } from '@/src/screens/home/HomeScreen/components/SearchBar';
import { FeaturedHotels } from '@/src/screens/home/HomeScreen/components/FeaturedHotels';
import { CategoryList } from '@/src/screens/home/HomeScreen/components/CategoryList';
import { PopularLocations } from '@/src/screens/home/HomeScreen/components/PopularLocations';

// Screen-specific hooks
import { useRecentRooms } from './hooks/useRecentRooms';
import { usePopularLocations } from './hooks/usePopularLocations';
import { useWishlist } from './hooks/useWishlist';
import { useApp, useTheme } from '@/src/context/AppContext';

// Screen-specific popups
import { FilterModal } from '@/src/screens/home/HomeScreen/popups/FilterModal';

// Styles
import { styles } from './styles';
import { colors } from '@/src/theme';

export const HomeScreen: React.FC = () => {
    const { t, settings } = useApp();
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('Somaliland');
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filters, setFilters] = useState<any>({});

    const {
        rooms: featuredRooms,
        loading: roomsLoading,
        loadingMore,
        hasMore,
        loadMore,
        refetch: refetchRooms,
    } = useRecentRooms(filters);

    const {
        locations,
        loading: locationsLoading,
        refetch: refetchLocations,
    } = usePopularLocations();

    const {
        wishlistedIds,
        toggleWishlist,
        refetch: refetchWishlist,
    } = useWishlist();

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await Promise.all([
            refetchRooms(),
            refetchLocations(),
            refetchWishlist()
        ]);
        setRefreshing(false);
    }, [refetchRooms, refetchLocations, refetchWishlist]);

    const [activeCategory, setActiveCategory] = useState('stay');

    const handleCategoryPress = (categoryId: string) => {
        setActiveCategory(categoryId);
        if (categoryId === 'stay') {
            setFilters({}); // Reset all filters
        } else if (categoryId === 'wishlist') {
            // Stay on home but filter featured hotels to only show wishlisted
            setFilters((prev: any) => ({ ...prev, wishlistOnly: true }));
        } else if (categoryId === 'services') {
            router.push('/travel-services');
        } else if (categoryId === 'map') {
            router.push('/map');
        }
    };

    const handleLocationPress = (locationName: string) => {
        // As requested: render him screen that filter only that city
        router.push({
            pathname: '/search-results',
            params: { city: locationName }
        });
    };

    const handleFilterApply = (appliedFilters: any) => {
        const backendFilters: any = {};
        if (appliedFilters.destination) backendFilters.city = appliedFilters.destination;
        if (appliedFilters.propertyType !== 'All') backendFilters.type = appliedFilters.propertyType;
        if (appliedFilters.priceRange) {
            backendFilters.minPrice = appliedFilters.priceRange[0];
            backendFilters.maxPrice = appliedFilters.priceRange[1];
        }
        if (appliedFilters.verifiedOnly) backendFilters.verifiedOnly = true;

        setFilters(backendFilters);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Header Gradient */}
            <LinearGradient
                colors={['#0288AC', '#34a0bd']}
                style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 10 }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                <Text style={styles.appTitle}>SOMSTAY</Text>
                <Text style={styles.locationSubtitle}>
                    {t('find_your_perfect_stay')} <Text style={styles.locationHighlight}>Somaliland</Text>
                </Text>

                <SearchBar
                    value={searchQuery}
                    location={selectedLocation}
                    onSearch={setSearchQuery}
                    onSearchPress={() => { }}
                    onLocationPress={() => { }}
                    onFilterPress={() => setFilterModalVisible(true)}
                    onSearchBarPress={() => router.push('/location-selector')}
                />
            </LinearGradient>

            {/* Main scrollable content */}
            <ScrollView
                style={[styles.scrollView, { backgroundColor: theme.background }]}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                // Smooth deceleration on iOS
                decelerationRate="fast"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]} // Android
                        tintColor={colors.primary} // iOS
                    />
                }
            >
                {/* 1. Category List */}
                <View style={styles.section}>
                    <CategoryList onCategoryPress={handleCategoryPress} activeCategory={activeCategory} />
                </View>

                {/* 2. Popular Locations (moved above hotels) */}
                <View style={styles.section}>
                    <PopularLocations
                        locations={locations}
                        loading={locationsLoading}
                        onLocationPress={handleLocationPress}
                    />
                </View>

                {/* 3. Featured Rooms — 2-column vertical grid with lazy loading */}
                <View style={styles.section}>
                    <FeaturedHotels
                        hotels={
                            filters.wishlistOnly
                                ? (featuredRooms as any).filter((room: any) => wishlistedIds.has(room.id))
                                : featuredRooms as any
                        }
                        loading={roomsLoading}
                        loadingMore={loadingMore}
                        hasMore={filters.wishlistOnly ? false : hasMore}
                        wishlistedIds={wishlistedIds}
                        onHotelPress={(id: string) =>
                            router.push({ pathname: '/property/[id]', params: { id, type: 'room' } })
                        }
                        onLoadMore={loadMore}
                        onToggleWishlist={toggleWishlist}
                    />
                </View>
            </ScrollView>

            {/* Filter Modal */}
            <FilterModal
                visible={filterModalVisible}
                onClose={() => setFilterModalVisible(false)}
                onApply={handleFilterApply}
            />
        </View>
    );
};
