import React from 'react';
import {
    View, Text, FlatList, TouchableOpacity, ActivityIndicator,
    StyleSheet, SafeAreaView, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/src/theme';
import { useReviews } from './hooks/useReviews';
import reviewService, { EntityType, Review, ReviewStats } from '@/src/services/review/reviewService';

// ── Sub-components ───────────────────────────────────────────────────────────

const StarRow = ({ value, size = 14, color = '#FFCA28' }: { value: number; size?: number; color?: string }) => (
    <View style={{ flexDirection: 'row', gap: 2 }}>
        {[1, 2, 3, 4, 5].map(s => (
            <Ionicons
                key={s}
                name={value >= s ? 'star' : value >= s - 0.5 ? 'star-half' : 'star-outline'}
                size={size} color={color}
            />
        ))}
    </View>
);

const RatingBar = ({ label, value }: { label: string; value: number | null }) => {
    if (!value) return null;
    return (
        <View style={st.barRow}>
            <Text style={st.barLabel}>{label}</Text>
            <View style={st.barTrack}>
                <View style={[st.barFill, { width: `${(value / 5) * 100}%` as any }]} />
            </View>
            <Text style={st.barValue}>{value.toFixed(1)}</Text>
        </View>
    );
};

const StatsHeader = ({ stats, entityName }: { stats: ReviewStats; entityName?: string }) => {
    const dist = [
        { label: '5 ★', count: stats.five_star  },
        { label: '4 ★', count: stats.four_star  },
        { label: '3 ★', count: stats.three_star },
        { label: '2 ★', count: stats.two_star   },
        { label: '1 ★', count: stats.one_star   },
    ];
    const total = stats.total || 1;

    return (
        <View style={st.statsCard}>
            {entityName && <Text style={st.entityName}>{entityName}</Text>}
            <View style={st.overallRow}>
                <View style={st.bigRating}>
                    <Text style={st.bigScore}>{stats.avg_rating?.toFixed(1) || '—'}</Text>
                    <StarRow value={stats.avg_rating || 0} size={18} />
                    <Text style={st.totalCount}>{stats.total} reviews</Text>
                </View>
                <View style={st.distribution}>
                    {dist.map(d => (
                        <View key={d.label} style={st.distRow}>
                            <Text style={st.distLabel}>{d.label}</Text>
                            <View style={st.distTrack}>
                                <View style={[st.distFill, { width: `${(d.count / total) * 100}%` as any }]} />
                            </View>
                            <Text style={st.distCount}>{d.count}</Text>
                        </View>
                    ))}
                </View>
            </View>
            <View style={st.categoryGrid}>
                <RatingBar label="Cleanliness" value={stats.avg_cleanliness} />
                <RatingBar label="Service"     value={stats.avg_service}     />
                <RatingBar label="Value"       value={stats.avg_value}       />
                <RatingBar label="Location"    value={stats.avg_location}    />
            </View>
        </View>
    );
};

const ReviewCard = ({ review, onDelete, isOwn }: { review: Review; onDelete?: (id: number) => void; isOwn?: boolean }) => {
    const initials = review.reviewer_name
        ? review.reviewer_name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2)
        : '??';
    const formattedDate = new Date(review.created_at).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    });

    return (
        <View style={st.card}>
            <View style={st.cardHeader}>
                <View style={st.avatar}>
                    <Text style={st.avatarText}>{initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={st.reviewerName}>{review.reviewer_name}</Text>
                    <Text style={st.reviewDate}>{formattedDate}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                    <StarRow value={review.rating} size={14} />
                    {isOwn && onDelete && (
                        <TouchableOpacity onPress={() => onDelete(review.id)}>
                            <Ionicons name="trash-outline" size={16} color={colors.error} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            {review.title && <Text style={st.reviewTitle}>{review.title}</Text>}
            {review.body  && <Text style={st.reviewBody}>{review.body}</Text>}
            {(review.cleanliness || review.service || review.value || review.location) && (
                <View style={st.subRatings}>
                    {review.cleanliness && <View style={st.subRating}><Text style={st.subRatingLabel}>Cleanliness</Text><StarRow value={review.cleanliness} size={11} /></View>}
                    {review.service     && <View style={st.subRating}><Text style={st.subRatingLabel}>Service</Text><StarRow value={review.service} size={11} /></View>}
                    {review.value       && <View style={st.subRating}><Text style={st.subRatingLabel}>Value</Text><StarRow value={review.value} size={11} /></View>}
                    {review.location    && <View style={st.subRating}><Text style={st.subRatingLabel}>Location</Text><StarRow value={review.location} size={11} /></View>}
                </View>
            )}
        </View>
    );
};

const SortBar = ({ current, onChange }: { current: string; onChange: (s: any) => void }) => (
    <View style={st.sortBar}>
        {(['newest', 'highest', 'lowest'] as const).map(opt => (
            <TouchableOpacity
                key={opt}
                style={[st.sortBtn, current === opt && st.sortBtnActive]}
                onPress={() => onChange(opt)}
            >
                <Text style={[st.sortText, current === opt && st.sortTextActive]}>
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </Text>
            </TouchableOpacity>
        ))}
    </View>
);

// ── Screen ───────────────────────────────────────────────────────────────────
export const ReviewsScreen: React.FC = () => {
    const router  = useRouter();
    const params  = useLocalSearchParams<{
        entityType: string; entityId: string;
        entityName?: string; canReview?: string;
        bookingId?: string;
    }>();

    const entityType = params.entityType as EntityType;
    const entityId   = params.entityId;
    const canReview  = params.canReview === 'true';

    const { reviews, stats, loading, loadingMore, sortMode, changeSort, loadMore, deleteReview } = useReviews({
        entityType, entityId,
    });

    const goToWrite = () => {
        router.push({
            pathname: '/write-review' as any,
            params: {
                entityType, entityId,
                bookingId:   params.bookingId,
                entityName:  params.entityName,
            },
        });
    };

    if (loading) {
        return (
            <SafeAreaView style={st.safe}>
                <View style={[st.safe, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={st.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            <View style={st.header}>
                <TouchableOpacity onPress={() => router.back()} style={st.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.dark} />
                </TouchableOpacity>
                <Text style={st.headerTitle}>Reviews & Ratings</Text>
                {canReview
                    ? <TouchableOpacity onPress={goToWrite} style={st.writeBtn}>
                        <Text style={st.writeBtnText}>+ Review</Text>
                      </TouchableOpacity>
                    : <View style={{ width: 70 }} />
                }
            </View>

            <FlatList
                data={reviews}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 24 }}
                ListHeaderComponent={
                    <>
                        {stats && <StatsHeader stats={stats} entityName={params.entityName} />}
                        <SortBar current={sortMode} onChange={changeSort} />
                    </>
                }
                renderItem={({ item }) => (
                    <ReviewCard
                        review={item}
                        onDelete={deleteReview}
                    />
                )}
                ListEmptyComponent={
                    <View style={st.emptyState}>
                        <Ionicons name="chatbubbles-outline" size={48} color={colors.gray200} />
                        <Text style={st.emptyTitle}>No reviews yet</Text>
                        <Text style={st.emptyBody}>Be the first to share your experience!</Text>
                        {canReview && (
                            <TouchableOpacity style={st.emptyBtn} onPress={goToWrite}>
                                <Text style={st.emptyBtnText}>Write a Review</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                }
                ListFooterComponent={loadingMore
                    ? <ActivityIndicator style={{ marginVertical: 16 }} color={colors.primary} />
                    : null
                }
                onEndReached={loadMore}
                onEndReachedThreshold={0.3}
            />
        </SafeAreaView>
    );
};

const st = StyleSheet.create({
    safe:        { flex: 1, backgroundColor: '#F8FAFC' },
    header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
    backBtn:     { width: 40, height: 40, justifyContent: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: colors.dark },
    writeBtn:    { backgroundColor: colors.primary, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
    writeBtnText:{ color: colors.white, fontWeight: '700', fontSize: 13 },

    // Stats header
    statsCard:   { backgroundColor: colors.white, margin: 16, padding: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3 },
    entityName:  { fontSize: 14, fontWeight: '600', color: colors.secondaryText, marginBottom: 12 },
    overallRow:  { flexDirection: 'row', gap: 16, marginBottom: 16 },
    bigRating:   { alignItems: 'center', gap: 6 },
    bigScore:    { fontSize: 48, fontWeight: '800', color: colors.dark, lineHeight: 52 },
    totalCount:  { fontSize: 12, color: colors.gray300, fontWeight: '500' },
    distribution:{ flex: 1, justifyContent: 'center', gap: 4 },
    distRow:     { flexDirection: 'row', alignItems: 'center', gap: 6 },
    distLabel:   { fontSize: 11, color: colors.secondaryText, width: 24 },
    distTrack:   { flex: 1, height: 6, backgroundColor: colors.gray100, borderRadius: 3, overflow: 'hidden' },
    distFill:    { height: 6, backgroundColor: '#FFCA28', borderRadius: 3 },
    distCount:   { fontSize: 11, color: colors.gray300, width: 18, textAlign: 'right' },
    categoryGrid:{ gap: 8 },
    barRow:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
    barLabel:    { fontSize: 12, color: colors.secondaryText, width: 80 },
    barTrack:    { flex: 1, height: 6, backgroundColor: colors.gray100, borderRadius: 3, overflow: 'hidden' },
    barFill:     { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
    barValue:    { fontSize: 12, fontWeight: '600', color: colors.dark, width: 26, textAlign: 'right' },

    // Sort bar
    sortBar:     { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 8, gap: 8 },
    sortBtn:     { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: colors.gray100, borderWidth: 1, borderColor: 'transparent' },
    sortBtnActive: { backgroundColor: '#EFF6FF', borderColor: colors.primary },
    sortText:    { fontSize: 13, color: colors.gray300, fontWeight: '600' },
    sortTextActive:{ color: colors.primary },

    // Review card
    card:        { backgroundColor: colors.white, marginHorizontal: 16, marginBottom: 12, padding: 16, borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 2 },
    cardHeader:  { flexDirection: 'row', gap: 12, marginBottom: 10 },
    avatar:      { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
    avatarText:  { color: colors.white, fontWeight: '700', fontSize: 14 },
    reviewerName:{ fontSize: 14, fontWeight: '700', color: colors.dark },
    reviewDate:  { fontSize: 12, color: colors.gray300, marginTop: 2 },
    reviewTitle: { fontSize: 14, fontWeight: '700', color: colors.dark, marginBottom: 6 },
    reviewBody:  { fontSize: 14, color: colors.secondaryText, lineHeight: 21 },
    subRatings:  { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.gray100 },
    subRating:   { gap: 3 },
    subRatingLabel: { fontSize: 11, color: colors.gray300 },

    // Empty state
    emptyState:  { alignItems: 'center', paddingVertical: 60, gap: 8 },
    emptyTitle:  { fontSize: 18, fontWeight: '700', color: colors.dark },
    emptyBody:   { fontSize: 14, color: colors.gray300 },
    emptyBtn:    { marginTop: 16, backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
    emptyBtnText:{ color: colors.white, fontWeight: '700' },
});

export default ReviewsScreen;
