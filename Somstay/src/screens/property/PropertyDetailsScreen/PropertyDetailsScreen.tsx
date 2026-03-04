import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles/PropertyDetailsScreen.styles';
import { colors, spacing } from '@/src/theme';
import { useHotelDetails } from './hooks/useHotelDetails';
import { useWishlist } from '../../home/HomeScreen/hooks/useWishlist';

export const PropertyDetailsScreen: React.FC = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();

    const { hotel, loading, error } = useHotelDetails(id as string);
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

    if (!hotel) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Property not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ color: colors.primary, marginTop: 10 }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const images = hotel.images && hotel.images.length > 0 ? hotel.images : [hotel.main_image];

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
                                source={{ uri: item.startsWith('http') ? item : `http://206.183.129.220:5000/uploads/${item}` }}
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

                    {hotel.status === 'Featured' && (
                        <View style={styles.featuredBadge}>
                            <Text style={styles.featuredText}>FEATURED</Text>
                        </View>
                    )}

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
                        <Text style={styles.title}>{hotel.name}</Text>
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#06A649" />
                            <Text style={styles.verifiedText}>VERIFIED</Text>
                        </View>
                    </View>

                    <View style={styles.locationRow}>
                        <Ionicons name="location-sharp" size={16} color={colors.primary} />
                        <Text style={styles.locationText}>{hotel.location}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>{hotel.rating || '4.5'}</Text>
                            <Text style={styles.reviewsCount}>({hotel.reviews} reviews)</Text>
                        </View>
                    </View>

                    {/* About Section */}
                    <Text style={styles.sectionTitle}>About this hotel</Text>
                    <Text style={styles.description} numberOfLines={3}>
                        {hotel.description || 'No description available for this property.'}
                    </Text>
                    <TouchableOpacity>
                        <Text style={styles.readMore}>Read more <Ionicons name="chevron-down" size={14} /></Text>
                    </TouchableOpacity>

                    {/* Rooms Section - New */}
                    {hotel.rooms && hotel.rooms.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Available Rooms</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                                {hotel.rooms.map((room: any) => (
                                    <View key={room.id} style={{ width: 200, marginRight: 15, backgroundColor: '#f9f9f9', borderRadius: 12, padding: 10 }}>
                                        <Image
                                            source={{ uri: room.image_url?.startsWith('http') ? room.image_url : `http://206.183.129.220:5000/uploads/${room.image_url}` }}
                                            style={{ width: '100%', height: 120, borderRadius: 8 }}
                                        />
                                        <Text style={{ fontWeight: 'bold', marginTop: 8 }}>{room.type} Room</Text>
                                        <Text style={{ color: colors.primary, fontWeight: '700' }}>${room.price}/night</Text>
                                        <Text style={{ fontSize: 12, color: '#666' }}>{room.beds} Beds • Max {room.max_guests} Guests</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </>
                    )}

                    {/* Amenities Section */}
                    <Text style={styles.sectionTitle}>What this place offers</Text>
                    <View style={styles.amenitiesGrid}>
                        {(hotel.amenities || []).map((item: any) => (
                            <View key={item.id} style={styles.amenityItem}>
                                <MaterialCommunityIcons name={(item.icon || 'star-outline') as any} size={24} color="#555" />
                                <Text style={styles.amenityText}>{item.name}</Text>
                            </View>
                        ))}
                    </View>
                    {hotel.amenities && hotel.amenities.length > 6 && (
                        <TouchableOpacity style={styles.showAllButton}>
                            <Text style={styles.showAllText}>Show all {hotel.amenities.length} amenities</Text>
                        </TouchableOpacity>
                    )}

                    {/* Sponsored Section */}
                    <TouchableOpacity style={styles.sponsoredCard}>
                        <View style={styles.sponsoredLogo}>
                            <Ionicons name="car-outline" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.sponsoredInfo}>
                            <Text style={styles.sponsoredTag}>SPONSORED</Text>
                            <Text style={styles.sponsoredTitle}>Professional Airport Pickup</Text>
                            <Text style={styles.sponsoredDesc}>Reliable service from Aden Adde Intl. Airport.</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>

                    {/* Location Section */}
                    <Text style={styles.sectionTitle}>Location</Text>
                    <View style={styles.mapContainer}>
                        <Image
                            source={{ uri: `https://api.mapbox.com/styles/v1/mapbox/light-v10/static/${hotel.longitude || 45.3182},${hotel.latitude || 2.0469},12/800x400?access_token=YOUR_TOKEN` }}
                            style={styles.mapImage}
                        />
                    </View>
                    <TouchableOpacity style={styles.viewOnMapButton}>
                        <Ionicons name="map-outline" size={18} color={colors.dark} />
                        <Text style={styles.showAllText}>View on Map</Text>
                    </TouchableOpacity>

                    {/* Reviews Section */}
                    <Text style={styles.sectionTitle}>Reviews</Text>
                    <View style={styles.reviewsHeader}>
                        <Text style={styles.overallRating}>{hotel.rating || '4.5'}</Text>
                        <View style={styles.ratingSummary}>
                            <View style={styles.starsRow}>
                                {[1, 2, 3, 4, 5].map((i: number) => (
                                    <Ionicons key={i} name="star" size={14} color="#FFD700" />
                                ))}
                            </View>
                            <Text style={styles.totalReviews}>{(hotel.reviews_preview?.length || 0) * 10} TOTAL REVIEWS</Text>
                        </View>
                    </View>

                    {(hotel.reviews_preview || []).map((review: any) => (
                        <View key={review.id} style={styles.reviewItem}>
                            <View style={styles.reviewerRow}>
                                <Image source={{ uri: review.avatar }} style={styles.reviewerAvatar} />
                                <View style={styles.reviewerInfo}>
                                    <Text style={styles.reviewerName}>{review.name}</Text>
                                    <Text style={styles.reviewDate}>{review.date}</Text>
                                </View>
                            </View>
                            <Text style={styles.reviewText}>{review.text}</Text>
                        </View>
                    ))}

                    <TouchableOpacity style={styles.readAllReviewsButton}>
                        <Text style={styles.showAllText}>Read all 128 reviews</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Sticky Bottom Bar */}
            <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.md), height: 80 + insets.bottom }]}>
                <View style={styles.priceBox}>
                    <View style={styles.bottomPriceRow}>
                        <Text style={styles.bottomPrice}>${hotel.base_price || hotel.price}</Text>
                        <Text style={styles.bottomPriceLabel}> / night</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.checkAvailability}>Check availability</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => router.push('/confirm-pay')}
                >
                    <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
