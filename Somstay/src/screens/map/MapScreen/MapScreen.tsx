import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { styles } from './styles/MapScreen.styles';
import { colors } from '@/src/theme';
import { FilterModal } from '../../home/HomeScreen/popups/FilterModal';
import propertyService from '@/src/services/property/propertyService';

const INITIAL_REGION = {
    latitude: 9.5624,
    longitude: 44.0670,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
};

export const MapScreen: React.FC = () => {
    const router = useRouter();
    const { city } = useLocalSearchParams<{ city?: string }>();
    const mapRef = useRef<MapView>(null);

    const [selectedProperty, setSelectedProperty] = useState<any>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const [showSearchArea, setShowSearchArea] = useState(false);
    const [loading, setLoading] = useState(true);
    const [properties, setProperties] = useState<any[]>([]);
    const [activeFilters, setActiveFilters] = useState<any>({});

    const fetchHotels = async (searchFilters: any = {}) => {
        setLoading(true);
        try {
            const response = await propertyService.getHotels(1, 50, searchFilters);
            // filter properties with valid coordinates
            const validProperties = response.data.filter((p: any) => p.latitude && p.longitude).map((p: any) => ({
                id: p.id.toString(),
                title: p.name,
                location: p.location || p.address,
                rating: parseFloat(p.rating) || 4.5,
                price: parseFloat(p.base_price) || 0,
                priceDisplay: `$${p.base_price || 0}`,
                image: (p.main_image && typeof p.main_image === 'string' && p.main_image.startsWith('http'))
                    ? p.main_image
                    : `http://206.183.129.220:5000/uploads/${p.main_image || 'placeholder.jpg'}`,
                coordinate: {
                    latitude: parseFloat(p.latitude),
                    longitude: parseFloat(p.longitude)
                },
                isVerified: p.status === 'Active',
                isFeatured: p.rating >= 4.5,
            }));

            setProperties(validProperties);
            if (validProperties.length > 0 && !selectedProperty) {
                setSelectedProperty(validProperties[0]);
            }
        } catch (error) {
            console.error('Map fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filters: any = { ...activeFilters };
        if (city && city !== 'All') {
            filters.city = city;
        }
        fetchHotels(filters);
    }, [city, activeFilters]);

    useEffect(() => {
        if (properties.length > 0 && mapRef.current) {
            const first = properties[0];
            mapRef.current.animateToRegion({
                ...first.coordinate,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            }, 1000);
        }
    }, [properties.length === 0]); // Animate only when transitioning from empty to non-empty

    const handleMarkerPress = (property: any) => {
        setSelectedProperty(property);
        // Animate map to marker
        mapRef.current?.animateToRegion({
            ...property.coordinate,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
        }, 500);
    };

    const handleSearchArea = () => {
        const filters: any = { ...activeFilters };
        if (city && city !== 'All') {
            filters.city = city;
        }
        fetchHotels(filters);
        setShowSearchArea(false);
    };

    const onRegionChangeComplete = () => {
        // Show "Search in this area" button when user pans
        setShowSearchArea(true);
    };

    const handleZoom = (type: 'in' | 'out') => {
        const deltaMultiplier = type === 'in' ? 0.5 : 2;
        mapRef.current?.getCamera().then(camera => {
            if (camera.altitude !== undefined) {
                mapRef.current?.animateCamera({
                    altitude: camera.altitude * deltaMultiplier,
                    center: camera.center,
                });
            }
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>MAP</Text>
                <TouchableOpacity style={styles.shareButton}>
                    <Ionicons name="share-outline" size={24} color={colors.dark} />
                </TouchableOpacity>
            </View>

            <View style={styles.mapContainer}>
                <MapView
                    ref={mapRef}
                    provider={PROVIDER_GOOGLE}
                    style={styles.mapPlaceholder}
                    initialRegion={INITIAL_REGION}
                    mapType="hybrid"
                    onRegionChangeComplete={onRegionChangeComplete}
                    showsUserLocation
                    showsMyLocationButton={false}
                    showsPointsOfInterest={true}
                    showsBuildings={true}
                >
                    {properties.map(property => (
                        <Marker
                            key={property.id}
                            coordinate={property.coordinate}
                            onPress={() => handleMarkerPress(property)}
                        >
                                <View style={[
                                    styles.priceMarker,
                                    { backgroundColor: selectedProperty?.id === property.id ? colors.primary : colors.dark },
                                    selectedProperty?.id === property.id && { transform: [{ scale: 1.1 }] }
                                ]}>
                                    <View style={{ alignItems: 'center' }}>
                                        <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginBottom: 2 }} numberOfLines={1}>
                                            {property.title}
                                        </Text>
                                        <Text style={styles.priceMarkerText}>{property.priceDisplay}</Text>
                                    </View>
                                </View>
                            <View style={[
                                styles.markerPoint,
                                { borderTopColor: selectedProperty?.id === property.id ? colors.primary : colors.dark }
                            ]} />
                        </Marker>
                    ))}
                </MapView>

                {/* Overlays */}
                <View style={styles.topOverlay}>
                    <View style={styles.searchCard}>
                        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
                            <Ionicons name="chevron-back" size={20} color={colors.dark} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.searchInfo}
                            onPress={() => router.replace({
                                pathname: '/location-selector',
                                params: { from: 'map' }
                            })}
                        >
                            <Text style={styles.locationLabel}>LOCATION</Text>
                            <Text style={styles.locationValue}>{city || "Hargeisa"}, Somaliland</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
                            <Ionicons name="options-outline" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.listToggleButton}
                        onPress={() => router.replace({
                            pathname: '/search-results',
                            params: { city: city || 'Hargeisa' }
                        })}
                    >
                        <Ionicons name="list" size={20} color={colors.primary} />
                        <Text style={styles.listToggleText}>List</Text>
                    </TouchableOpacity>
                </View>

                {showSearchArea && (
                    <TouchableOpacity
                        style={styles.searchAreaButton}
                        onPress={handleSearchArea}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color={colors.white} />
                        ) : (
                            <>
                                <Ionicons name="refresh" size={18} color={colors.white} />
                                <Text style={styles.searchAreaText}>Search in this area</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}

                {/* Map Controls */}
                <View style={styles.mapControls}>
                    <TouchableOpacity style={styles.controlButton} onPress={() => handleZoom('in')}>
                        <Ionicons name="add" size={24} color={colors.dark} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.controlButton} onPress={() => handleZoom('out')}>
                        <Ionicons name="remove" size={24} color={colors.dark} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.controlButton}
                        onPress={() => mapRef.current?.animateToRegion(INITIAL_REGION, 1000)}
                    >
                        <MaterialCommunityIcons name="target" size={24} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Bottom Property Preview Card */}
                {selectedProperty && (
                    <View style={styles.propertyCard}>
                        <TouchableOpacity
                            onPress={() => router.push({ pathname: '/hotel/[id]', params: { id: selectedProperty.id } })}
                            activeOpacity={0.9}
                        >
                            <View>
                                <Image source={{ uri: selectedProperty.image }} style={styles.cardImage} />
                                <View style={styles.badgeContainer}>
                                    {selectedProperty.isVerified && (
                                        <View style={styles.verifiedBadge}>
                                            <Ionicons name="checkmark-circle" size={14} color={colors.white} />
                                            <Text style={[styles.badgeText, { color: colors.white }]}>Verified</Text>
                                        </View>
                                    )}
                                    {selectedProperty.isFeatured && (
                                        <View style={styles.featuredBadge}>
                                            <Ionicons name="star" size={14} color={colors.dark} />
                                            <Text style={styles.badgeText}>Featured</Text>
                                        </View>
                                    )}
                                </View>
                                <TouchableOpacity
                                    style={styles.favoriteButton}
                                    onPress={() => setIsFavorite(!isFavorite)}
                                >
                                    <Ionicons
                                        name={isFavorite ? "heart" : "heart-outline"}
                                        size={20}
                                        color={isFavorite ? colors.error : colors.dark}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.propertyTitle} numberOfLines={1}>{selectedProperty.title}</Text>
                                        <View style={styles.addressRow}>
                                            <Ionicons name="location" size={12} color={colors.primary} />
                                            <Text style={styles.addressText} numberOfLines={1}>{selectedProperty.location}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.ratingContainer}>
                                        <Ionicons name="star" size={16} color="#FFD700" />
                                        <Text style={styles.ratingText}>{selectedProperty.rating}</Text>
                                    </View>
                                </View>

                                <View style={styles.cardFooter}>
                                    <View>
                                        <Text style={styles.priceLabel}>Starting from</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                            <Text style={styles.priceValue}>${selectedProperty.price}</Text>
                                            <Text style={styles.perNightText}>/night</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.detailsButton}
                                        onPress={() => router.push({ pathname: '/hotel/[id]', params: { id: selectedProperty.id } })}
                                    >
                                        <Text style={styles.detailsButtonText}>Details</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <FilterModal
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApply={(filters) => {
                    setActiveFilters(filters);
                    setFilterVisible(false);
                }}
            />
        </SafeAreaView>
    );
};
