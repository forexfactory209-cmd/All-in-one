import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { styles } from './styles/MapScreen.styles';
import { colors } from '@/src/theme';
import { FilterModal } from '../../home/HomeScreen/popups/FilterModal';

// Mock properties with real coordinates in Hargeisa
const INITIAL_PROPERTIES = [
    {
        id: '1',
        title: 'Hargeisa Heights Luxury Apartment',
        location: 'Ibraahim Koodbuur District, Hargeisa',
        rating: 4.9,
        price: 150,
        priceDisplay: '$150/n',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
        coordinate: { latitude: 9.5624, longitude: 44.0670 },
        isVerified: true,
        isFeatured: true,
    },
    {
        id: '2',
        title: 'Somaliland Grand Villa',
        location: 'Berbera Road, Hargeisa',
        rating: 4.7,
        price: 450,
        priceDisplay: '$450k',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
        coordinate: { latitude: 9.5650, longitude: 44.0720 },
        isVerified: true,
        isFeatured: false,
    },
    {
        id: '3',
        title: 'City Center Studio',
        location: 'Downtown, Hargeisa',
        rating: 4.5,
        price: 120,
        priceDisplay: '$120',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        coordinate: { latitude: 9.5590, longitude: 44.0650 },
        isVerified: false,
        isFeatured: false,
    },
    {
        id: '4',
        title: 'Budget Friendly Inn',
        location: 'Airport Road, Hargeisa',
        rating: 4.2,
        price: 85,
        priceDisplay: '$85',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
        coordinate: { latitude: 9.5550, longitude: 44.0600 },
        isVerified: true,
        isFeatured: false,
    },
];

const INITIAL_REGION = {
    latitude: 9.5624,
    longitude: 44.0670,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
};

export const MapScreen: React.FC = () => {
    const router = useRouter();
    const { city } = useLocalSearchParams<{ city?: string }>();
    const mapRef = useRef<MapView>(null);

    const [selectedProperty, setSelectedProperty] = useState(INITIAL_PROPERTIES[0]);
    const [isFavorite, setIsFavorite] = useState(false);
    const [filterVisible, setFilterVisible] = useState(false);
    const [showSearchArea, setShowSearchArea] = useState(false);
    const [loading, setLoading] = useState(false);
    const [properties, setProperties] = useState(INITIAL_PROPERTIES);

    useEffect(() => {
        if (city && city !== 'Hargeisa') {
            // In a real app, you would look up coordinates for the city
            // For now, let's just simulate moving the map slightly or to a new predefined spot
            const newRegion = {
                latitude: 9.5624 + (Math.random() - 0.5) * 0.1,
                longitude: 44.0670 + (Math.random() - 0.5) * 0.1,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            };
            mapRef.current?.animateToRegion(newRegion, 1000);
        }
    }, [city]);

    const handleMarkerPress = (property: typeof INITIAL_PROPERTIES[0]) => {
        setSelectedProperty(property);
        // Animate map to marker
        mapRef.current?.animateToRegion({
            ...property.coordinate,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }, 500);
    };

    const handleSearchArea = () => {
        setLoading(true);
        // Simulate API fetch delay
        setTimeout(() => {
            setLoading(false);
            setShowSearchArea(false);
        }, 1500);
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
        <SafeAreaView style={styles.container} edges={['top']}>
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
                    mapType="satellite"
                    onRegionChangeComplete={onRegionChangeComplete}
                    showsUserLocation
                    showsMyLocationButton={false}
                >
                    {properties.map(property => (
                        <Marker
                            key={property.id}
                            coordinate={property.coordinate}
                            onPress={() => handleMarkerPress(property)}
                        >
                            <View style={[
                                styles.priceMarker,
                                selectedProperty.id === property.id && { backgroundColor: colors.primary, transform: [{ scale: 1.1 }] }
                            ]}>
                                <Text style={styles.priceMarkerText}>{property.priceDisplay}</Text>
                            </View>
                            <View style={[
                                styles.markerPoint,
                                selectedProperty.id === property.id && { borderTopColor: colors.primary }
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
                            onPress={() => router.push({
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
                        onPress={() => router.push({
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
                <View style={styles.propertyCard}>
                    <TouchableOpacity
                        onPress={() => router.push({ pathname: '/property/[id]', params: { id: selectedProperty.id } })}
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
                                <Text style={styles.propertyTitle}>{selectedProperty.title}</Text>
                                <View style={styles.ratingContainer}>
                                    <Ionicons name="star" size={16} color="#FFD700" />
                                    <Text style={styles.ratingText}>{selectedProperty.rating}</Text>
                                </View>
                            </View>

                            <View style={styles.addressRow}>
                                <Ionicons name="location" size={14} color={colors.primary} />
                                <Text style={styles.addressText}>{selectedProperty.location}</Text>
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
                                    onPress={() => router.push({ pathname: '/property/[id]', params: { id: selectedProperty.id } })}
                                >
                                    <Text style={styles.detailsButtonText}>Details</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Filter Modal Integration */}
            <FilterModal
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApply={(filters) => {
                    setFilterVisible(false);
                    handleSearchArea(); // Simulate filter apply
                }}
            />
        </SafeAreaView>
    );
};
