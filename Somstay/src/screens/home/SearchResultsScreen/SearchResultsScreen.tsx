import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles } from './SearchResultsScreen.styles';
import { colors } from '@/src/theme';
import { ExplorePropertyCard, Property } from '../../explore/ExploreScreen/components/ExplorePropertyCard';
import { FilterModal } from '@/src/screens/home/HomeScreen/popups/FilterModal';
import { SortBottomSheet, SortOption } from './popups/SortBottomSheet';

import propertyService from '@/src/services/property/propertyService';

export const SearchResultsScreen: React.FC = () => {
    const router = useRouter();
    const { city } = useLocalSearchParams<{ city: string }>();
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filterVisible, setFilterVisible] = useState(false);
    const [sortVisible, setSortVisible] = useState(false);
    const [currentSort, setCurrentSort] = useState<SortOption>('newest');
    const [activeFilters, setActiveFilters] = useState<any>({});

    const categories = ['All', 'Hotel', 'Apartment', 'Guest House', 'Resort', 'Suite'];

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            setLoading(true);
            try {
                // Determine filters based on city param and active filters
                const combinedFilters: any = { ...activeFilters };
                if (city && city !== 'All') {
                    combinedFilters.city = city;
                }
                if (selectedCategory !== 'All') {
                    combinedFilters.type = selectedCategory;
                }
                if (currentSort !== 'newest') {
                    combinedFilters.sort = currentSort;
                }

                const response = await propertyService.getHotels(1, 20, combinedFilters);
                
                // Map the backend structure to the UI components' Property format
                const formattedProperties = response.data.map((hotel: any) => ({
                    id: hotel.id.toString(),
                    title: hotel.name,
                    location: hotel.location || hotel.city,
                    rating: hotel.rating ? parseFloat(hotel.rating) : 4.5,
                    price: `$${hotel.price_per_night || hotel.min_price || 0}`,
                    priceLabel: '/night',
                    image: (hotel.main_image && typeof hotel.main_image === 'string' && hotel.main_image.startsWith('http'))
                        ? hotel.main_image 
                        : `http://206.183.129.220:5000/uploads/${hotel.main_image || 'placeholder.jpg' || hotel.image_url}`,
                    isVerified: hotel.status === 'active',
                    isFeatured: true, // You can base this on a featured flag if added
                    type: 'rental',
                }));

                setProperties(formattedProperties);
            } catch (err) {
                console.error('Failed to fetch hotels:', err);
                setProperties([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [city, activeFilters, selectedCategory, currentSort]);

    const renderHeader = () => (
        <View style={styles.resultsInfo}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.resultsCount}>
                    {properties.length} results for "{city || 'Somaliland'}"
                </Text>
                <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
                    onPress={() => setSortVisible(true)}
                >
                    <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>
                        Sort: {currentSort === 'newest' ? 'Newest' :
                            currentSort === 'price_low' ? 'Price Low-High' :
                                currentSort === 'price_high' ? 'Price High-Low' : 'Top Rated'}
                    </Text>
                    <Ionicons name="chevron-down" size={14} color={colors.primary} />
                </TouchableOpacity>
            </View>
            <Text style={styles.resultsSubtitle}>
                Verified and featured properties near your selection
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.dark} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.headerSearchContainer}
                    onPress={() => router.replace('/location-selector')}
                >
                    <Ionicons name="search" size={18} color={colors.primary} style={styles.searchIcon} />
                    <Text style={styles.headerTitle}>{city || "Search cities..."}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
                    <Ionicons name="options-outline" size={24} color={colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.filterButton, { backgroundColor: colors.primary }]} 
                    onPress={() => router.push({ pathname: '/map', params: { city: city || 'Hargeisa' } })}
                >
                    <Ionicons name="map-outline" size={22} color={colors.white} />
                </TouchableOpacity>
            </View>

            {/* Filter Chips */}
            <View style={styles.filterChipsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {categories.map(cat => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.filterChip,
                                selectedCategory === cat && styles.activeFilterChip
                            ]}
                            onPress={() => setSelectedCategory(cat)}
                        >
                            <Text style={[
                                styles.filterChipText,
                                selectedCategory === cat && styles.activeFilterChipText
                            ]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <View style={[styles.emptyContainer, { flex: 1, justifyContent: 'center' }]}>
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
                            onPress={() => router.push({ pathname: '/hotel/[id]', params: { id: item.id } })}
                            onFavoritePress={() => { }}
                            onActionPress={() => router.push({ pathname: '/hotel/[id]', params: { id: item.id } })}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="search-outline" size={64} color="#D1D5DB" />
                            <Text style={styles.emptyText}>No properties found in this location</Text>
                        </View>
                    }
                />
            )}

            <FilterModal
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                hideDestination={true}
                onApply={(filters) => {
                    setActiveFilters(filters);
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
