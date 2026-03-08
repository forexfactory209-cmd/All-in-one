import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles/PropertyDetailsScreen.styles';
import { colors, spacing } from '@/src/theme';
import { useRoomDetails } from './hooks/useRoomDetails';
import { useWishlist } from '../../home/HomeScreen/hooks/useWishlist';

export const PropertyDetailsScreen: React.FC = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id, type } = useLocalSearchParams();
    const entityType = type as string || 'room';

    const { room, loading, error } = useRoomDetails(id as string, entityType);
    const { wishlistedIds, toggleWishlist } = useWishlist();

    const isFavorite = id ? wishlistedIds.has(id.toString()) : false;

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const { width: screenWidth } = Dimensions.get('window');

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!room) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Room not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ color: colors.primary, marginTop: 10 }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const images = room.images && room.images.length > 0 ? room.images : [room.image_url];

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / screenWidth);
        setActiveImageIndex(index);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Slider Section */}
                <View style={styles.imageSliderContainer}>
                    <FlatList
                        data={images}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: (item && typeof item === 'string' && item.startsWith('http')) ? item : `http://206.183.129.220:5000/uploads/${item || 'placeholder.jpg'}` }}
                                style={{ width: screenWidth, height: 300 }}
                                resizeMode="cover"
                            />
                        )}
                    />

                    {/* Header Controls */}
                    <View style={[styles.headerOverlay, { paddingTop: insets.top }]}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                            <Ionicons name="arrow-back" size={24} color={colors.dark} />
                        </TouchableOpacity>
                        <View style={styles.headerRight}>
                            <TouchableOpacity onPress={() => id && toggleWishlist(id as string)} style={styles.iconButton}>
                                <Ionicons
                                    name={isFavorite ? "heart" : "heart-outline"}
                                    size={24}
                                    color={isFavorite ? colors.error : colors.dark}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton}>
                                <Ionicons name="share-outline" size={24} color={colors.dark} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Pagination Dots */}
                    <View style={styles.pagination}>
                        {images.map((_: any, index: number) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    activeImageIndex === index && styles.activeDot
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Main Info */}
                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{room.name || `${room.type} Room`}</Text>
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#06A649" />
                            <Text style={styles.verifiedText}>VERIFIED</Text>
                        </View>
                    </View>

                    <View style={styles.locationRow}>
                        <Ionicons name="location-sharp" size={16} color={colors.primary} />
                        <Text style={styles.locationText}>{room.location || room.hotel_name || room.hotel_location || 'Hargeisa'}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>4.8</Text>
                        </View>
                    </View>

                    {/* Room Details */}
                    <View style={{ flexDirection: 'row', gap: 15, marginVertical: 15, padding: 15, backgroundColor: '#f5f5f5', borderRadius: 12 }}>
                        <View style={{ alignItems: 'center' }}>
                            <Ionicons name="bed-outline" size={24} color={colors.primary} />
                            <Text style={{ fontSize: 12, marginTop: 4 }}>{room.beds} Beds</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Ionicons name="people-outline" size={24} color={colors.primary} />
                            <Text style={{ fontSize: 12, marginTop: 4 }}>{room.max_guests} Guests</Text>
                        </View>
                        <View style={{ alignItems: 'center' }}>
                            <Ionicons name="expand-outline" size={24} color={colors.primary} />
                            <Text style={{ fontSize: 12, marginTop: 4 }}>32 sqm</Text>
                        </View>
                    </View>

                    {/* About Section */}
                    <Text style={styles.sectionTitle}>Room Description</Text>
                    <Text style={styles.description} numberOfLines={3}>
                        {room.description || 'This beautiful room offers a perfect blend of comfort and style. Equipped with modern amenities and situated in a prime location.'}
                    </Text>
                    <TouchableOpacity>
                        <Text style={styles.readMore}>Read more <Ionicons name="chevron-down" size={14} /></Text>
                    </TouchableOpacity>

                    {/* Hotel Preview Section - Replaced Sponsored */}
                    <Text style={styles.sectionTitle}>Located In</Text>
                    <TouchableOpacity
                        style={[styles.sponsoredCard, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' }]}
                        onPress={() => room.hotel_id && router.push({ pathname: '/hotel/[id]', params: { id: room.hotel_id } })}
                    >
                        <View style={styles.sponsoredLogo}>
                            <Ionicons name="business-outline" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.sponsoredInfo}>
                            <Text style={[styles.sponsoredTag, { color: colors.primary }]}>HOTEL PREVIEW</Text>
                            <Text style={styles.sponsoredTitle}>{room.hotel_name || 'Premium Hotel'}</Text>
                            <Text style={styles.sponsoredDesc}>Tap to view hotel facilities and all available rooms.</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>

                    {/* Location Section */}
                    <Text style={styles.sectionTitle}>Location</Text>
                    <View style={styles.mapContainer}>
                        <Image
                            source={{ uri: `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/45.3182,2.0469,12/800x400?access_token=YOUR_TOKEN` }}
                            style={styles.mapImage}
                        />
                    </View>
                    <TouchableOpacity style={styles.viewOnMapButton}>
                        <Ionicons name="map-outline" size={18} color={colors.dark} />
                        <Text style={styles.showAllText}>View on Map</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Sticky Bottom Bar */}
            <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.md), height: 80 + insets.bottom }]}>
                <View style={styles.priceBox}>
                    <View style={styles.bottomPriceRow}>
                        <Text style={styles.bottomPrice}>${room.price || room.price_per_night}</Text>
                        <Text style={styles.bottomPriceLabel}> / night</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.checkAvailability}>Check availability</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => router.push({ pathname: '/confirm-pay', params: { id, type: entityType } })}
                >
                    <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
