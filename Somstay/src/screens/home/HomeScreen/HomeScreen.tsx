import React, { useState } from 'react';
import { View, ScrollView, StatusBar, Text, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

// Screen-specific components
import { SearchBar } from './components/SearchBar';
import { FeaturedHotels } from './components/FeaturedHotels';
import { CategoryList } from './components/CategoryList';
import { PopularLocations } from './components/PopularLocations';

// Screen-specific hooks
import { useFeaturedHotels } from './hooks/useFeaturedHotels';
import { usePopularLocations } from './hooks/usePopularLocations';
import { useWishlist } from './hooks/useWishlist';

// Screen-specific popups
import { FilterModal } from './popups/FilterModal';

// Styles
import { styles } from './styles';
import { colors } from '@/src/theme';

export const HomeScreen: React.FC = () => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('Somaliland');
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [filters, setFilters] = useState<any>({});

    const {
        hotels: featuredHotels,
        loading: hotelsLoading,
        loadingMore,
        hasMore,
        loadMore,
        refetch: refetchHotels,
    } = useFeaturedHotels(filters);

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
            refetchHotels(),
            refetchLocations(),
            refetchWishlist()
        ]);
        setRefreshing(false);
    }, [refetchHotels, refetchLocations, refetchWishlist]);

    const handleCategoryPress = (categoryId: string) => {
        if (categoryId === 'all') {
            setFilters((prev: any) => {
                const next = { ...prev };
                delete next.type;
                return next;
            });
        } else {
            setFilters((prev: any) => ({ ...prev, type: categoryId }));
        }
    };

    const handleLocationPress = (locationName: string) => {
        setFilters((prev: any) => ({ ...prev, city: locationName }));
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
        <View style={styles.container}>
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
                    Find Your Perfect Stay In <Text style={styles.locationHighlight}>Somaliland</Text>
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
                style={styles.scrollView}
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
                    <CategoryList onCategoryPress={handleCategoryPress} />
                </View>

                {/* 2. Popular Locations (moved above hotels) */}
                <View style={styles.section}>
                    <PopularLocations
                        locations={locations}
                        loading={locationsLoading}
                        onLocationPress={handleLocationPress}
                    />
                </View>

                {/* 3. Featured Hotels — 2-column vertical grid with lazy loading */}
                <View style={styles.section}>
                    <FeaturedHotels
                        hotels={featuredHotels}
                        loading={hotelsLoading}
                        loadingMore={loadingMore}
                        hasMore={hasMore}
                        wishlistedIds={wishlistedIds}
                        onHotelPress={(id: string) =>
                            router.push({ pathname: '/property/[id]', params: { id } })
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
