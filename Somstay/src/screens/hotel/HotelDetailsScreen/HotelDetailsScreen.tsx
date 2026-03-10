import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StatusBar, Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent, ActivityIndicator, Modal, SafeAreaView, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { styles } from '../../property/PropertyDetailsScreen/styles/PropertyDetailsScreen.styles';
import { colors, spacing, shadows, typography } from '@/src/theme';
import { useHotelDetails } from '../../property/PropertyDetailsScreen/hooks/useHotelDetails';
import { useWishlist } from '../../home/HomeScreen/hooks/useWishlist';
import reviewService, { Review, ReviewStats } from '@/src/services/review/reviewService';
import { useApp, useTheme } from '@/src/context/AppContext';

// ── Compact ReviewsPreview component ─────────────────────────────────────────
const StarRow = ({ value, size = 12 }: { value: number; size?: number }) => (
    <View style={{ flexDirection: 'row', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(s => (
            <Ionicons key={s} name={value >= s ? 'star' : 'star-outline'} size={size} color="#FFCA28" />
        ))}
    </View>
);

export const HotelDetailsScreen: React.FC = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();
    const { settings } = useApp();
    const theme = useTheme();

    const { hotel, loading, error } = useHotelDetails(id as string);
    const { wishlistedIds, toggleWishlist } = useWishlist();
    const [roomsModalVisible, setRoomsModalVisible] = useState(false);
    const isFavorite = id ? wishlistedIds.has(id.toString()) : false;
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [selectedRoomType, setSelectedRoomType] = useState('All');
    const { width: screenWidth } = Dimensions.get('window');

    // Reviews state
    const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
    const [topReviews, setTopReviews] = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);

    const hotelId = id ? parseInt(id as string) : 0;

    useEffect(() => {
        if (!hotelId) return;
        setReviewsLoading(true);
        reviewService.getReviews('Hotel', hotelId, { page: 1, limit: 3, sort: 'newest' })
            .then((res: { stats: ReviewStats; reviews: Review[] }) => { setReviewStats(res.stats); setTopReviews(res.reviews); })
            .catch(() => { })
            .finally(() => setReviewsLoading(false));
    }, [hotelId]);

    const rv = StyleSheet.create({
        sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 8 },
        seeAll: { fontSize: 13, color: colors.primary, fontWeight: '600' },
        scoreStrip: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: theme.surfaceSecondary, padding: 14, borderRadius: 14, marginBottom: 12 },
        bigScore: { fontSize: 42, fontWeight: '800', color: theme.text, lineHeight: 46 },
        scoreSubtext: { fontSize: 12, color: theme.textSecondary, marginTop: 4 },
        card: { backgroundColor: theme.card, padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: theme.border },
        cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
        avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
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
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!hotel) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: theme.text }}>Hotel not found</Text>
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
                        keyExtractor={(item, index) => `${item}-${index}`}
                        renderItem={({ item }) => (
                            <Image
                                source={{ uri: (item && typeof item === 'string' && item.startsWith('http')) ? item : (item ? `http://206.183.129.220:5000/uploads/${item}` : 'https://images.unsplash.com/photo-1566073771259-6a8506099945') }}
                                style={{ width: screenWidth, height: 350 }}
                                resizeMode="cover"
                            />
                        )}
                    />

                    {/* Header Controls */}
                    <View style={[styles.headerOverlay, { paddingTop: insets.top }]}>
                        <TouchableOpacity onPress={() => router.back()} style={[styles.iconButton, { backgroundColor: theme.card + 'E6' }]}>
                            <Ionicons name="arrow-back" size={24} color={theme.text} />
                        </TouchableOpacity>
                        <View style={styles.headerRight}>
                            <TouchableOpacity onPress={() => id && toggleWishlist(id as string)} style={[styles.iconButton, { backgroundColor: theme.card + 'E6' }]}>
                                <Ionicons
                                    name={isFavorite ? "heart" : "heart-outline"}
                                    size={24}
                                    color={isFavorite ? colors.error : theme.text}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.iconButton, { backgroundColor: theme.card + 'E6' }]}>
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
                                    activeImageIndex === index && styles.activeDot
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Main Info */}
                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text style={[styles.title, { color: theme.text }]}>{hotel.name}</Text>
                        <View style={[styles.verifiedBadge, { backgroundColor: '#E6F8EF' }]}>
                            <Ionicons name="checkmark-circle" size={16} color="#06A649" />
                            <Text style={styles.verifiedText}>VERIFIED</Text>
                        </View>
                    </View>

                    <View style={styles.locationRow}>
                        <Ionicons name="location-sharp" size={16} color={colors.primary} />
                        <Text style={[styles.locationText, { color: theme.textSecondary }]}>{hotel.location}</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={[styles.ratingText, { color: theme.text }]}>{hotel.rating || '4.5'}</Text>
                        </View>
                    </View>

                    {/* About Section */}
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>About this hotel</Text>
                    <Text style={[styles.description, { color: theme.textSecondary }]} numberOfLines={3}>
                        {hotel.description || 'No description available for this property.'}
                    </Text>

                    {/* Rooms Section */}
                    {hotel.rooms && hotel.rooms.length > 0 && (
                        <>
                            <View style={styles.sectionHeaderRow}>
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>Available Rooms</Text>
                                {hotel.rooms.length > 4 && (
                                    <TouchableOpacity onPress={() => setRoomsModalVisible(true)}>
                                        <Text style={styles.seeAllText}>See All ({hotel.rooms.length})</Text>
                                    </TouchableOpacity>
                                )}
                            </View>

                            {/* Dynamic Room Filter */}
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                                {['All', ...new Set(hotel.rooms.map((r: any) => r.type))].map((type: any) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={{
                                            paddingHorizontal: 16,
                                            paddingVertical: 8,
                                            borderRadius: 20,
                                            backgroundColor: selectedRoomType === type ? colors.primary : theme.surfaceSecondary,
                                            marginRight: 10,
                                            borderWidth: 1,
                                            borderColor: selectedRoomType === type ? colors.primary : theme.border
                                        }}
                                        onPress={() => setSelectedRoomType(type)}
                                    >
                                        <Text style={{
                                            color: selectedRoomType === type ? colors.white : theme.text,
                                            fontWeight: '600',
                                            fontSize: 13
                                        }}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
                                {hotel.rooms
                                    .filter((r: any) => selectedRoomType === 'All' || r.type === selectedRoomType)
                                    .slice(0, 4)
                                    .map((innerRoom: any) => (
                                        <TouchableOpacity
                                            key={innerRoom.id}
                                            style={{
                                                width: 280,
                                                marginRight: 16,
                                                backgroundColor: theme.card,
                                                borderRadius: 24,
                                                borderWidth: 1,
                                                borderColor: theme.border,
                                                padding: 12,
                                                ...shadows.medium
                                            }}
                                            onPress={() => router.push({ pathname: '/property/[id]', params: { id: innerRoom.id } })}
                                        >
                                            <Image
                                                source={{ uri: (innerRoom.image_url && typeof innerRoom.image_url === 'string' && innerRoom.image_url.startsWith('http')) ? innerRoom.image_url : (innerRoom.image_url ? `http://206.183.129.220:5000/uploads/${innerRoom.image_url}` : 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304') }}
                                                style={{ width: '100%', height: 160, borderRadius: 16 }}
                                            />
                                            <View style={{ paddingVertical: 12 }}>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Text style={{ fontWeight: '800', fontSize: 18, color: theme.text }}>{innerRoom.type} Room</Text>
                                                    <View style={{ backgroundColor: colors.success + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                                                        <Text style={{ fontSize: 11, color: colors.success, fontWeight: '800' }}>{innerRoom.status}</Text>
                                                    </View>
                                                </View>
                                                <Text style={{ ...typography.textStyles.bodySmall, color: theme.textSecondary, marginTop: 4 }} numberOfLines={1}>
                                                    {innerRoom.description || 'Spacious room with modern amenities.'}
                                                </Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                                                        <Text style={{ color: colors.primary, fontWeight: '900', fontSize: 22 }}>${innerRoom.price}</Text>
                                                        <Text style={{ fontSize: 12, fontWeight: '600', color: theme.textSecondary }}>/night</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', gap: 6 }}>
                                                        <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: theme.surfaceSecondary, justifyContent: 'center', alignItems: 'center' }}>
                                                            <Ionicons name="people" size={16} color={theme.textSecondary} />
                                                        </View>
                                                        <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: theme.surfaceSecondary, justifyContent: 'center', alignItems: 'center' }}>
                                                            <Ionicons name="bed" size={16} color={theme.textSecondary} />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                {hotel.rooms.length > 4 && (
                                    <TouchableOpacity
                                        style={{ width: 140, marginRight: 15, backgroundColor: theme.surfaceSecondary, borderRadius: 24, borderWidth: 1, borderColor: theme.border, padding: 8, justifyContent: 'center', alignItems: 'center' }}
                                        onPress={() => setRoomsModalVisible(true)}
                                    >
                                        <Ionicons name="arrow-forward-circle" size={48} color={colors.primary} />
                                        <Text style={{ marginTop: 12, fontWeight: '800', color: colors.primary, textTransform: 'uppercase', fontSize: 12 }}>See All</Text>
                                    </TouchableOpacity>
                                )}
                            </ScrollView>
                        </>
                    )}

                    {/* Amenities Section */}
                    <Text style={[styles.sectionTitle, { color: theme.text }]}>Hotel Amenities</Text>
                    <View style={styles.amenitiesGrid}>
                        {(hotel.amenities || []).map((item: any) => (
                            <View key={item.id} style={styles.amenityItem}>
                                <MaterialCommunityIcons name={(item.icon || 'star-outline') as any} size={24} color={theme.textSecondary} />
                                <Text style={[styles.amenityText, { color: theme.textSecondary }]}>{item.name}</Text>
                            </View>
                        ))}
                    </View>

                    {/* ── Reviews Section ── */}
                    <View style={rv.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Guest Reviews</Text>
                        {reviewStats && reviewStats.total > 0 && (
                            <TouchableOpacity
                                onPress={() => router.push({ pathname: '/reviews' as any, params: { entityType: 'Hotel', entityId: id, entityName: hotel.name } })}
                            >
                                <Text style={rv.seeAll}>See All ({reviewStats.total})</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Aggregate score strip */}
                    {reviewStats && reviewStats.total > 0 ? (
                        <View style={rv.scoreStrip}>
                            <Text style={rv.bigScore}>{reviewStats.avg_rating?.toFixed(1)}</Text>
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
                </View>
            </ScrollView>

            {/* Rooms Full List Modal */}
            <Modal
                visible={roomsModalVisible}
                animationType="slide"
                onRequestClose={() => setRoomsModalVisible(false)}
            >
                <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: theme.border }}>
                        <TouchableOpacity onPress={() => setRoomsModalVisible(false)}>
                            <Ionicons name="close" size={28} color={theme.text} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 18, fontWeight: '700', color: theme.text }}>Available Rooms</Text>
                        <View style={{ width: 28 }} />
                    </View>

                    {/* Modal Room Filter */}
                    <View style={{ paddingVertical: 10, paddingHorizontal: 15 }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {['All', ...new Set(hotel.rooms.map((r: any) => r.type))].map((type: any) => (
                                <TouchableOpacity
                                    key={type}
                                    style={{
                                        paddingHorizontal: 16,
                                        paddingVertical: 8,
                                        borderRadius: 20,
                                        backgroundColor: selectedRoomType === type ? colors.primary : theme.surfaceSecondary,
                                        marginRight: 10,
                                        borderWidth: 1,
                                        borderColor: selectedRoomType === type ? colors.primary : theme.border
                                    }}
                                    onPress={() => setSelectedRoomType(type)}
                                >
                                    <Text style={{
                                        color: selectedRoomType === type ? colors.white : theme.text,
                                        fontWeight: '600',
                                        fontSize: 13
                                    }}>{type}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    <FlatList
                        data={hotel.rooms.filter((r: any) => selectedRoomType === 'All' || r.type === selectedRoomType)}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={{ padding: 15 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{ backgroundColor: theme.card, borderRadius: 16, marginBottom: 15, overflow: 'hidden', borderWidth: 1, borderColor: theme.border, ...shadows.small }}
                                onPress={() => {
                                    setRoomsModalVisible(false);
                                    router.push({ pathname: '/property/[id]', params: { id: item.id } });
                                }}
                            >
                                <Image
                                    source={{ uri: (item.image_url && typeof item.image_url === 'string' && item.image_url.startsWith('http')) ? item.image_url : `http://206.183.129.220:5000/uploads/${item.image_url || 'placeholder.jpg'}` }}
                                    style={{ width: '100%', height: 180 }}
                                />
                                <View style={{ padding: 15 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <Text style={{ fontSize: 18, fontWeight: '700', color: theme.text }}>{item.type} Room</Text>
                                        <Text style={{ fontSize: 18, fontWeight: '800', color: colors.primary }}>${item.price}<Text style={{ fontSize: 12, color: theme.textSecondary, fontWeight: '400' }}>/night</Text></Text>
                                    </View>
                                    <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 12 }}>{item.description}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: theme.border }}>
                                        <View style={{ flexDirection: 'row', gap: 10 }}>
                                            <View style={{ backgroundColor: theme.surfaceSecondary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
                                                <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '600' }}>{item.beds} BEDS</Text>
                                            </View>
                                            <View style={{ backgroundColor: colors.success + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
                                                <Text style={{ color: colors.success, fontSize: 11, fontWeight: '600' }}>{item.status}</Text>
                                            </View>
                                        </View>
                                        <TouchableOpacity
                                            style={{ backgroundColor: colors.primary, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 }}
                                            onPress={() => {
                                                setRoomsModalVisible(false);
                                                router.push({ pathname: '/confirm-pay', params: { id: item.id, type: 'room' } });
                                            }}
                                        >
                                            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>Book Room</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </SafeAreaView>
            </Modal>
        </View>
    );
};

