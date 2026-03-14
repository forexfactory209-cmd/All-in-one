import React, { useState, useEffect } from 'react';
import {
    View, Text, Image, ScrollView, TouchableOpacity,
    StatusBar, Dimensions, FlatList, NativeSyntheticEvent,
    NativeScrollEvent, ActivityIndicator, StyleSheet as RNStyleSheet
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from './styles/PropertyDetailsScreen.styles';
import { colors, spacing } from '@/src/theme';
import { useRoomDetails } from './hooks/useRoomDetails';
import { useWishlist } from '@/src/screens/home/HomeScreen/hooks/useWishlist';
import reviewService, { Review, ReviewStats } from '@/src/services/review/reviewService';
import { useApp, useTheme } from '@/src/context/AppContext';

const StarRow = ({ value, size = 12 }: { value: number; size?: number }) => (
    <View style={{ flexDirection: 'row', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(s => (
            <Ionicons key={s} name={value >= s ? 'star' : 'star-outline'} size={size} color="#FFD700" />
        ))}
    </View>
);

export const PropertyDetailsScreen: React.FC = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { settings } = useApp();
    const theme = useTheme();
    const { id, type } = useLocalSearchParams();
    const entityType = type as string || 'room';

    const { room, loading, error } = useRoomDetails(id as string, entityType);
    const { wishlistedIds, toggleWishlist } = useWishlist();

    const isFavorite = id ? wishlistedIds.has(id.toString()) : false;

    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const { width: screenWidth } = Dimensions.get('window');

    // Reviews state
    const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
    const [topReviews, setTopReviews] = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    const reviewEntityType = entityType === 'property' ? 'Property' : 'Room';

    useEffect(() => {
        if (!id) return;
        setReviewsLoading(true);
        reviewService.getReviews(reviewEntityType, id as string, { page: 1, limit: 3, sort: 'newest' })
            .then((res: { stats: ReviewStats; reviews: Review[] }) => {
                setReviewStats(res.stats);
                setTopReviews(res.reviews);
            })
            .catch(() => { })
            .finally(() => setReviewsLoading(false));
    }, [id, reviewEntityType]);

    const rv = RNStyleSheet.create({
        sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 8 },
        seeAll: { fontSize: 13, color: theme.primary, fontWeight: '600' },
        scoreStrip: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: theme.surfaceSecondary, padding: 14, borderRadius: 14, marginBottom: 12 },
        bigScore: { fontSize: 42, fontWeight: '800', color: theme.text, lineHeight: 46 },
        scoreSubtext: { fontSize: 12, color: theme.textSecondary, marginTop: 4 },
        card: { backgroundColor: theme.card, padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: theme.border },
        cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
        avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' },
        avatarText: { color: colors.white, fontWeight: '700', fontSize: 13 },
        reviewerName: { fontSize: 13, fontWeight: '700', color: theme.text },
        reviewDate: { fontSize: 11, color: theme.textSecondary, marginTop: 2 },
        reviewTitle: { fontSize: 13, fontWeight: '700', color: theme.text, marginBottom: 4 },
        reviewBody: { fontSize: 13, color: theme.textSecondary, lineHeight: 20 },
        empty: { alignItems: 'center', paddingVertical: 24, gap: 6 },
        emptyText: { fontSize: 13, color: theme.textSecondary },
    });

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </View>
        );
    }

    if (!room) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: theme.text }}>Room not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ color: theme.primary, marginTop: 10 }}>Go Back</Text>
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
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={settings.darkMode ? "light-content" : "dark-content"} translucent backgroundColor="transparent" />

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
                        keyExtractor={(item, idx) => `img-${idx}`}
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
                        <TouchableOpacity onPress={() => router.back()} style={[styles.iconButton, { backgroundColor: theme.card + 'CC' }]}>
                            <Ionicons name="arrow-back" size={24} color={theme.text} />
                        </TouchableOpacity>
                        <View style={styles.headerRight}>
                            <TouchableOpacity onPress={() => id && toggleWishlist(id as string)} style={[styles.iconButton, { backgroundColor: theme.card + 'CC' }]}>
                                <Ionicons
                                    name={isFavorite ? "heart" : "heart-outline"}
                                    size={24}
                                    color={isFavorite ? (theme.error || '#FF5252') : theme.text}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.card + 'CC' }]}>
                                <Ionicons name="share-outline" size={24} color={theme.text} />
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
                                    { backgroundColor: theme.textSecondary + '60' },
                                    activeImageIndex === index && [styles.activeDot, { backgroundColor: theme.primary }]
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Main Info */}
                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text style={[styles.title, { color: theme.text }]}>{room.name || `${room.type} Room`}</Text>
                        <View style={[styles.verifiedBadge, { backgroundColor: theme.success + '15' }]}>
                            <Ionicons name="checkmark-circle" size={16} color={theme.success} />
                            <Text style={[styles.verifiedText, { color: theme.success }]}>VERIFIED</Text>
                        </View>
                    </View>

                    <View style={styles.locationRow}>
                        <Ionicons name="location-sharp" size={16} color={theme.primary} />
                        <Text style={[styles.locationText, { color: theme.textSecondary }]}>{room.location || room.hotel_name || room.hotel_location || 'Hargeisa'}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={[styles.ratingText, { color: theme.text }]}>
                                {Number(reviewStats?.avg_rating || room.rating || 0).toFixed(1)}
                            </Text>
                            <Text style={{ fontSize: 13, color: theme.textSecondary, marginLeft: 4 }}>
                                ({reviewStats?.total || room.review_count || 0})
                            </Text>
                        </View>
                    </View>

                    {/* Room Details */}
                    <View style={{ flexDirection: 'row', gap: 15, marginVertical: 15, padding: 15, backgroundColor: theme.surfaceSecondary, borderRadius: 12 }}>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Ionicons name="bed-outline" size={24} color={theme.primary} />
                            <Text style={{ fontSize: 12, marginTop: 4, color: theme.text, fontWeight: '600' }}>{room.beds} Beds</Text>
                        </View>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Ionicons name="people-outline" size={24} color={theme.primary} />
                            <Text style={{ fontSize: 12, marginTop: 4, color: theme.text, fontWeight: '600' }}>{room.max_guests} Guests</Text>
                        </View>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                            <Ionicons name="expand-outline" size={24} color={theme.primary} />
                            <Text style={{ fontSize: 12, marginTop: 4, color: theme.text, fontWeight: '600' }}>32 sqm</Text>
                        </View>
                    </View>

                    {/* About Section */}
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Room Description</Text>
                    <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={3}>
                        {room.description || 'This beautiful room offers a perfect blend of comfort and style. Equipped with modern amenities and situated in a prime location.'}
                    </Text>
                    <TouchableOpacity>
                        <Text style={[styles.readMore, { color: theme.primary }]}>Read more <Ionicons name="chevron-down" size={14} /></Text>
                    </TouchableOpacity>

                    {/* Hotel Preview Section - Replaced Sponsored */}
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Located In</Text>
                    <TouchableOpacity
                        style={[styles.sponsoredCard, { backgroundColor: theme.card, borderWidth: 1, borderColor: theme.border }]}
                        onPress={() => room.hotel_id && router.push({ pathname: '/hotel/[id]', params: { id: room.hotel_id } })}
                    >
                        <View style={[styles.sponsoredLogo, { backgroundColor: theme.surfaceSecondary }]}>
                            <Ionicons name="business-outline" size={24} color={theme.primary} />
                        </View>
                        <View style={styles.sponsoredInfo}>
                            <Text style={[styles.sponsoredTag, { color: theme.primary }]}>HOTEL PREVIEW</Text>
                            <Text style={[styles.sponsoredTitle, { color: theme.text }]}>{room.hotel_name || 'Premium Hotel'}</Text>
                            <Text style={[styles.sponsoredDesc, { color: theme.textSecondary }]}>Tap to view hotel facilities and all available rooms.</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
                    </TouchableOpacity>

                    {/* ── Reviews Section ── */}
                    <View style={rv.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Guest Reviews</Text>
                        {reviewStats && reviewStats.total > 0 && (
                            <TouchableOpacity
                                onPress={() => router.push({ pathname: '/reviews' as any, params: { entityType: reviewEntityType, entityId: id, entityName: room.name || room.title } })}
                            >
                                <Text style={rv.seeAll}>See All ({reviewStats.total})</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Aggregate score strip */}
                    {reviewStats && reviewStats.total > 0 ? (
                        <View style={rv.scoreStrip}>
                            <Text style={rv.bigScore}>{Number(reviewStats.avg_rating || 0).toFixed(1)}</Text>
                            <View style={{ gap: 4 }}>
                                <StarRow value={reviewStats.avg_rating || 0} size={14} />
                                <Text style={rv.scoreSubtext}>Based on {reviewStats.total} reviews</Text>
                            </View>
                        </View>
                    ) : null}

                    {/* Top reviews preview */}
                    {reviewsLoading ? (
                        <ActivityIndicator color={colors.primary} style={{ marginVertical: 12 }} />
                    ) : topReviews.length > 0 ? (
                        topReviews.map(r => (
                            <View key={r.id} style={rv.card}>
                                <View style={rv.cardHeader}>
                                    <View style={rv.avatar}>
                                        <Text style={rv.avatarText}>
                                            {(r.reviewer_name || '?').split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={rv.reviewerName}>{r.reviewer_name}</Text>
                                        <Text style={rv.reviewDate}>
                                            {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                        </Text>
                                    </View>
                                    <StarRow value={r.rating} size={13} />
                                </View>
                                {r.title && <Text style={rv.reviewTitle}>{r.title}</Text>}
                                {r.body && <Text style={rv.reviewBody} numberOfLines={3}>{r.body}</Text>}
                            </View>
                        ))
                    ) : (
                        <View style={rv.empty}>
                            <Ionicons name="chatbubbles-outline" size={32} color={theme.border} />
                            <Text style={rv.emptyText}>No reviews yet. Be the first!</Text>
                        </View>
                    )}

                    {/* Location Section */}
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Location</Text>
                    <View style={[styles.mapContainer, { backgroundColor: theme.surfaceSecondary }]}>
                        <Image
                            source={{ uri: `https://api.mapbox.com/styles/v1/mapbox/${settings.darkMode ? 'dark' : 'light'}-v10/static/45.3182,2.0469,12/800x400?access_token=YOUR_TOKEN` }}
                            style={styles.mapImage}
                        />
                    </View>
                    <TouchableOpacity style={[styles.viewOnMapButton, { borderColor: theme.border }]}>
                        <Ionicons name="map-outline" size={18} color={theme.text} />
                        <Text style={[styles.showAllText, { color: theme.text }]}>View on Map</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Sticky Bottom Bar */}
            <View style={[styles.bottomBar, {
                backgroundColor: theme.card,
                borderTopColor: theme.border,
                paddingBottom: Math.max(insets.bottom, spacing.md),
                height: 80 + insets.bottom
            }]}>
                <View style={styles.priceBox}>
                    <View style={styles.bottomPriceRow}>
                        <Text style={[styles.bottomPrice, { color: theme.text }]}>${room.price || room.price_per_night}</Text>
                        <Text style={[styles.bottomPriceLabel, { color: theme.textSecondary }]}> / night</Text>
                    </View>
                    <TouchableOpacity>
                        <Text style={[styles.checkAvailability, { color: theme.primary }]}>Check availability</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    style={styles.bookButton}
                        onPress={() => {
                            const roomPrice = room.price || room.price_per_night || 150;
                            console.log('DEBUG: Booking from PropertyDetails:', {
                                id, type: entityType, total_price: roomPrice
                            });

                            router.push({ 
                                pathname: '/confirm-pay', 
                                params: { 
                                    id: id?.toString() || '', 
                                    type: entityType,
                                    title: room.name || `${room.type} Room`,
                                    image: images[0] || '',
                                    total_price: roomPrice.toString(),
                                    checkIn: '2026-03-28',
                                    checkOut: '2026-03-29',
                                    adults: '2',
                                    children: '0'
                                } 
                            });
                        }}
                >
                    <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const rv = RNStyleSheet.create({
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 8 },
    seeAll: { fontSize: 13, color: colors.primary, fontWeight: '600' },
    scoreStrip: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F0F9FF', padding: 14, borderRadius: 14, marginBottom: 12 },
    bigScore: { fontSize: 42, fontWeight: '800', color: colors.dark, lineHeight: 46 },
    scoreSubtext: { fontSize: 12, color: colors.gray300, marginTop: 4 },
    card: { backgroundColor: '#FAFAFA', padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: colors.gray100 },
    cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
    avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: colors.white, fontWeight: '700', fontSize: 13 },
    reviewerName: { fontSize: 13, fontWeight: '700', color: colors.dark },
    reviewDate: { fontSize: 11, color: colors.gray300, marginTop: 2 },
    reviewTitle: { fontSize: 13, fontWeight: '700', color: colors.dark, marginBottom: 4 },
    reviewBody: { fontSize: 13, color: colors.secondaryText, lineHeight: 20 },
    empty: { alignItems: 'center', paddingVertical: 24, gap: 6 },
    emptyText: { fontSize: 13, color: colors.gray300 },
});

