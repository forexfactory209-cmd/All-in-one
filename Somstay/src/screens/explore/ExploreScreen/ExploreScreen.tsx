import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Components
import { ExploreHeader } from './components/ExploreHeader';
import { ExploreSearchBar } from './components/ExploreSearchBar';
import { ExploreCategoryList } from './components/ExploreCategoryList';
import { ExplorePropertyCard } from './components/ExplorePropertyCard';
import { FloatingMapButton } from './components/FloatingMapButton';

// Hooks
import { useExploreProperties } from './hooks/useExploreProperties';
import { useRouter } from 'expo-router';

// Popups
import { FilterModal } from '../../home/HomeScreen/popups/FilterModal';
import { SortBottomSheet, SortOption } from '../../home/SearchResultsScreen/popups/SortBottomSheet';

// Styles
import { styles } from './styles';
import { colors } from '@/src/theme';

export const ExploreScreen: React.FC = () => {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [filterVisible, setFilterVisible] = useState(false);
    const [sortVisible, setSortVisible] = useState(false);
    const [currentSort, setCurrentSort] = useState<SortOption>('newest');
    const [appliedFilters, setAppliedFilters] = useState<any>({
        destination: 'Mogadishu',
        details: 'Oct 12-15 • 2 Guests'
    });
    const { properties, loading } = useExploreProperties(appliedFilters);

    const getFilterSummary = (filters: any) => {
        if (!filters || filters.destination === undefined) return 'Oct 12-15 • 2 Guests';

        const parts = [];
        if (filters.propertyType && filters.propertyType !== 'All') parts.push(filters.propertyType);
        if (filters.priceRange) parts.push(`$${filters.priceRange[0]}-$${filters.priceRange[1]}`);
        if (filters.minRating && filters.minRating !== 'All') parts.push(`${filters.minRating}★`);

        return parts.length > 0 ? parts.join(' • ') : 'Oct 12-15 • 2 Guests';
    };

    const renderHeader = () => (
        <View style={styles.listHeader}>
            <ExploreSearchBar
                location={appliedFilters.destination || "Mogadishu"}
                details={getFilterSummary(appliedFilters)}
                onFilterPress={() => setFilterVisible(true)}
                onSearchPress={() => router.push('/location-selector')}
            />
            <ExploreCategoryList
                selectedId={selectedCategory}
                onSelect={setSelectedCategory}
            />
            <View style={styles.resultsInfo}>
                <Text style={styles.resultsCount}>{properties.length} properties in {appliedFilters.destination || "Mogadishu"}</Text>
                <TouchableOpacity
                    style={styles.sortContainer}
                    onPress={() => setSortVisible(true)}
                >
                    <Text style={styles.sortLabel}>Sort by:</Text>
                    <Text style={styles.sortText}>
                        {currentSort === 'newest' ? 'Newest' :
                            currentSort === 'price_low' ? 'Price Low' :
                                currentSort === 'price_high' ? 'Price High' : 'Top Rated'}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color="#7C7C7C" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" />
            <ExploreHeader />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={properties}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={renderHeader}
                    renderItem={({ item }) => (
                        <ExplorePropertyCard
                            property={item}
                            onPress={() => router.push({ pathname: '/property/[id]', params: { id: item.id } })}
                            onFavoritePress={() => { }}
                            onActionPress={() => router.push('/confirm-pay')}
                        />
                    )}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <FloatingMapButton />

            <FilterModal
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApply={(filters) => {
                    console.log('Applied filters:', filters);
                    setAppliedFilters(filters);
                    setFilterVisible(false);
                }}
            />

            <SortBottomSheet
                visible={sortVisible}
                currentOption={currentSort}
                onClose={() => setSortVisible(false)}
                onApply={(option) => {
                    setCurrentSort(option);
                    console.log('Applied sort:', option);
                }}
            />
        </SafeAreaView>
    );
};
