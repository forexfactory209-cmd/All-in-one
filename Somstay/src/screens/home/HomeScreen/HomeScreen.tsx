import React, { useState } from 'react';
import { View, ScrollView, StatusBar, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

// Screen-specific components
import { SearchBar } from './components/SearchBar';
import { FeaturedHotels } from './components/FeaturedHotels';
import { FeaturedProperties } from './components/FeaturedProperties';
import { CategoryList } from './components/CategoryList';
import { PopularLocations } from './components/PopularLocations';
import { TrustedBrokers } from './components/TrustedBrokers';

// Screen-specific hooks
import { useFeaturedHotels } from './hooks/useFeaturedHotels';
import { useFeaturedProperties } from './hooks/useFeaturedProperties';

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

    const {
        hotels: featuredHotels,
        loading: hotelsLoading,
    } = useFeaturedHotels();

    const {
        properties: featuredProperties,
        loading: featuredLoading,
        error: featuredError,
        refetch: refetchFeatured,
    } = useFeaturedProperties();

    const handleCategoryPress = (categoryId: string) => {
        if (categoryId === 'travel') {
            router.push('/travel-services');
        } else if (categoryId === 'map') {
            router.push('/map');
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Header with Gradient - Covers Status Bar Area */}
            <LinearGradient
                colors={['#0288AC', '#34a0bd']}
                style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 10 }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
            >
                {/* App Title */}
                <Text style={styles.appTitle}>SOMSTAY</Text>

                {/* Location Subtitle */}
                <Text style={styles.locationSubtitle}>
                    Find Your Perfect Stay In <Text style={styles.locationHighlight}>Somaliland</Text>
                </Text>

                {/* Search Bar Row */}
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

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Category List */}
                <View style={styles.section}>
                    <CategoryList onCategoryPress={handleCategoryPress} />
                </View>

                {/* Featured Hotels */}
                <View style={styles.section}>
                    <FeaturedHotels
                        hotels={featuredHotels}
                        loading={hotelsLoading}
                        onHotelPress={(id: string) => router.push({ pathname: '/property/[id]', params: { id } })}
                    />
                </View>

                {/* Featured Properties */}
                <View style={styles.section}>
                    <FeaturedProperties
                        properties={featuredProperties}
                        loading={featuredLoading}
                        onPropertyPress={(id: string) => router.push({ pathname: '/property/[id]', params: { id } })}
                    />
                </View>

                {/* Popular Locations */}
                <View style={styles.section}>
                    <PopularLocations onLocationPress={(location: string) => { }} />
                </View>

                {/* Trusted Brokers */}
                <View style={styles.section}>
                    <TrustedBrokers onBrokerPress={(id: string) => { }} />
                </View>
            </ScrollView>

            {/* Filter Modal */}
            <FilterModal
                visible={filterModalVisible}
                onClose={() => setFilterModalVisible(false)}
                onApply={(filters: any) => {
                    console.log('Applied filters:', filters);
                    setFilterModalVisible(false);
                }}
            />
        </View>
    );
};
