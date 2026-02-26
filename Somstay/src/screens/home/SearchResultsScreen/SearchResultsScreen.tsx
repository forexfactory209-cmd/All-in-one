import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles } from './SearchResultsScreen.styles';
import { colors } from '@/src/theme';
import { ExplorePropertyCard, Property } from '../../explore/ExploreScreen/components/ExplorePropertyCard';
import { FilterModal } from '../HomeScreen/popups/FilterModal';
import { SortBottomSheet, SortOption } from './popups/SortBottomSheet';

// Mock data generator for different cities
const MOCK_PROPERTIES: Property[] = [
    {
        id: '1',
        title: 'Hargeisa Heights Luxury Apartment',
        location: 'Ibraahim Koodbuur District, Hargeisa',
        rating: 4.9,
        price: '$150',
        priceLabel: '/night',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        isVerified: true,
        isFeatured: true,
        type: 'rental',
    },
    {
        id: '2',
        title: 'Modern Villa in Berbera',
        location: 'Red Sea Coast, Berbera',
        rating: 4.7,
        price: '$200',
        priceLabel: '/night',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
        isVerified: true,
        type: 'rental',
    },
    {
        id: '3',
        title: 'City Center Hub Borama',
        location: 'Downtown, Borama',
        rating: 4.5,
        price: '$80',
        priceLabel: '/night',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        isFeatured: false,
        type: 'rental',
    },
    {
        id: '4',
        title: 'Erigavo Mountain Retreat',
        location: 'Daallo, Erigavo',
        rating: 4.8,
        price: '$120',
        priceLabel: '/night',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
        isVerified: true,
        type: 'rental',
    },
    {
        id: '5',
        title: 'Burco Trade Hotel',
        location: 'Main Road, Burco',
        rating: 4.3,
        price: '$65',
        priceLabel: '/night',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        isVerified: false,
        type: 'rental',
    },
];

export const SearchResultsScreen: React.FC = () => {
    const router = useRouter();
    const { city } = useLocalSearchParams<{ city: string }>();
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filterVisible, setFilterVisible] = useState(false);
    const [sortVisible, setSortVisible] = useState(false);
    const [currentSort, setCurrentSort] = useState<SortOption>('newest');

    const categories = ['All', 'Apartment', 'Villa', 'House', 'Hotel'];

    useEffect(() => {
        // Filter mock properties based on city name in title or location
        // If no city provided, show all
        const filtered = city
            ? MOCK_PROPERTIES.filter(p =>
                p.location.toLowerCase().includes(city.toLowerCase()) ||
                p.title.toLowerCase().includes(city.toLowerCase()))
            : MOCK_PROPERTIES;

        setProperties(filtered);
    }, [city]);

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
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.dark} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.headerSearchContainer}
                    onPress={() => router.push('/location-selector')}
                >
                    <Ionicons name="search" size={18} color={colors.primary} style={styles.searchIcon} />
                    <Text style={styles.headerTitle}>{city || "Search cities..."}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
                    <Ionicons name="options-outline" size={24} color={colors.primary} />
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
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search-outline" size={64} color="#D1D5DB" />
                        <Text style={styles.emptyText}>No properties found in this location</Text>
                    </View>
                }
            />

            <FilterModal
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApply={(filters) => {
                    console.log('Applied filters:', filters);
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
