import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles/PropertyDetailsScreen.styles';
import { colors, spacing } from '@/src/theme';

export const PropertyDetailsScreen: React.FC = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();
    const [isFavorite, setIsFavorite] = useState(false);

    // This would normally come from a hook using the ID
    const property = {
        title: 'Modern Oceanview Villa',
        location: 'Batalale, Berbera',
        rating: 4.9,
        reviews: 128,
        featured: true,
        guests: 6,
        bedrooms: 3,
        bathrooms: 2,
        price: 120,
        description: 'Experience the ultimate luxury stay in this stunning beachfront property located at the heart of Lido Beach. This architecturally designed villa offers breathtaking views and premium amenities for a perfect getaway.',
        amenities: [
            { id: '1', name: 'Free WiFi', icon: 'wifi' },
            { id: '2', name: 'Air Conditioning', icon: 'snowflake-variant' },
            { id: '3', name: 'Full Kitchen', icon: 'stove' },
            { id: '4', name: 'Free Parking', icon: 'car' },
            { id: '5', name: '24/7 Security', icon: 'shield-check' },
            { id: '6', name: 'Private Pool', icon: 'pool' },
        ],
        images: [
            'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
        ],
        reviews_preview: [
            {
                id: 'r1',
                name: 'Sara M.',
                date: 'October 2023',
                avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
                text: 'Absolutely breathtaking views. The villa was spotless and the staff was extremely helpful. Felt very safe and relaxed.',
            },
            {
                id: 'r2',
                name: 'Mohamed B.',
                date: 'September 2023',
                avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
                text: 'Best place to stay in Mogadishu. Ahmed is an incredible host. The pool is the highlight!',
            }
        ]
    };

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const { width: screenWidth } = Dimensions.get('window');

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
                        data={property.images}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <Image source={{ uri: item }} style={{ width: screenWidth, height: 300 }} resizeMode="cover" />
                        )}
                    />

                    {/* Header Controls */}
                    <View style={[styles.headerOverlay, { paddingTop: insets.top }]}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                            <Ionicons name="arrow-back" size={24} color={colors.dark} />
                        </TouchableOpacity>
                        <View style={styles.headerRight}>
                            <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={styles.iconButton}>
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

                    {property.featured && (
                        <View style={styles.featuredBadge}>
                            <Text style={styles.featuredText}>FEATURED</Text>
                        </View>
                    )}

                    {/* Pagination Dots */}
                    <View style={styles.pagination}>
                        {property.images.map((_, index) => (
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
                        <Text style={styles.title}>{property.title}</Text>
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#06A649" />
                            <Text style={styles.verifiedText}>VERIFIED</Text>
                        </View>
                    </View>

                    <View style={styles.locationRow}>
                        <Ionicons name="location-sharp" size={16} color={colors.primary} />
                        <Text style={styles.locationText}>{property.location}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>{property.rating}</Text>
                            <Text style={styles.reviewsCount}>({property.reviews} reviews)</Text>
                        </View>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Ionicons name="people-outline" size={24} color="#999" />
                            <Text style={styles.statValue}>{property.guests} Guests</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="bed-outline" size={24} color="#999" />
                            <Text style={styles.statValue}>{property.bedrooms} Bedrooms</Text>
                        </View>
                        <View style={styles.statItem}>
                            <MaterialCommunityIcons name="shower-head" size={24} color="#999" />
                            <Text style={styles.statValue}>{property.bathrooms} Bathrooms</Text>
                        </View>
                    </View>

                    {/* About Section */}
                    <Text style={styles.sectionTitle}>About this villa</Text>
                    <Text style={styles.description} numberOfLines={3}>
                        {property.description}
                    </Text>
                    <TouchableOpacity>
                        <Text style={styles.readMore}>Read more <Ionicons name="chevron-down" size={14} /></Text>
                    </TouchableOpacity>

                    {/* Amenities Section */}
                    <Text style={styles.sectionTitle}>What this place offers</Text>
                    <View style={styles.amenitiesGrid}>
                        {property.amenities.map((item) => (
                            <View key={item.id} style={styles.amenityItem}>
                                <MaterialCommunityIcons name={item.icon as any} size={24} color="#555" />
                                <Text style={styles.amenityText}>{item.name}</Text>
                            </View>
                        ))}
                    </View>
                    <TouchableOpacity style={styles.showAllButton}>
                        <Text style={styles.showAllText}>Show all 24 amenities</Text>
                    </TouchableOpacity>

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
                            source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/light-v10/static/45.3182,2.0469,12/800x400?access_token=YOUR_TOKEN' }}
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
                        <Text style={styles.overallRating}>{property.rating}</Text>
                        <View style={styles.ratingSummary}>
                            <View style={styles.starsRow}>
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Ionicons key={i} name="star" size={14} color="#FFD700" />
                                ))}
                            </View>
                            <Text style={styles.totalReviews}>128 TOTAL REVIEWS</Text>
                        </View>
                    </View>

                    {property.reviews_preview.map((review) => (
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
                        <Text style={styles.bottomPrice}>${property.price}</Text>
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
