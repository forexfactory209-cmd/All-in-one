import React from 'react';
import {
    View, Text, ScrollView, TouchableOpacity,
    TextInput, ActivityIndicator, StyleSheet, SafeAreaView, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/src/theme';
import { useWriteReview } from './hooks/useWriteReview';
import { EntityType } from '@/src/services/review/reviewService';

// ── Star Picker ──────────────────────────────────────────────────────────────
const StarPicker = ({
    value, onChange, label, size = 32
}: { value: number; onChange: (v: number) => void; label?: string; size?: number }) => (
    <View style={{ marginBottom: label ? 12 : 0 }}>
        {label && <Text style={s.subLabel}>{label}</Text>}
        <View style={{ flexDirection: 'row', gap: 6 }}>
            {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity key={star} onPress={() => onChange(star)} activeOpacity={0.7}>
                    <Ionicons
                        name={value >= star ? 'star' : 'star-outline'}
                        size={size}
                        color={value >= star ? '#FFCA28' : '#CBD5E1'}
                    />
                </TouchableOpacity>
            ))}
        </View>
    </View>
);

// ── Screen ───────────────────────────────────────────────────────────────────
export const WriteReviewScreen: React.FC = () => {
    const router = useRouter();
    const params = useLocalSearchParams<{
        entityType: string; entityId: string;
        bookingId?: string; entityName?: string;
    }>();

    const entityType = params.entityType as EntityType;
    const entityId   = parseInt(params.entityId);
    const bookingId  = params.bookingId ? parseInt(params.bookingId) : undefined;

    const {
        rating, setRating, title, setTitle, body, setBody,
        cleanliness, setCleanliness, service, setService,
        value, setValue, locationRate, setLocationRate,
        submitting, error, isValid, submit,
    } = useWriteReview({
        entityType, entityId, bookingId,
        onSuccess: () => router.back(),
    });

    return (
        <SafeAreaView style={s.safe}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

            {/* Header */}
            <View style={s.header}>
                <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.dark} />
                </TouchableOpacity>
                <Text style={s.headerTitle}>Write a Review</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={s.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Entity name */}
                {params.entityName && (
                    <View style={s.entityCard}>
                        <Ionicons name="business-outline" size={20} color={colors.primary} />
                        <Text style={s.entityName} numberOfLines={1}>{params.entityName}</Text>
                    </View>
                )}

                {/* Overall rating */}
                <View style={s.card}>
                    <Text style={s.sectionLabel}>Overall Rating *</Text>
                    <Text style={s.ratingHint}>
                        {rating === 0 ? 'Tap a star' : ['', '😞 Poor', '😐 Fair', '🙂 Good', '😊 Great', '🤩 Excellent!'][rating]}
                    </Text>
                    <StarPicker value={rating} onChange={setRating} size={40} />
                </View>

                {/* Sub-ratings */}
                <View style={s.card}>
                    <Text style={s.sectionLabel}>Category Ratings (optional)</Text>
                    <StarPicker value={cleanliness} onChange={setCleanliness} label="🧹 Cleanliness" size={26} />
                    <StarPicker value={service}     onChange={setService}     label="🤝 Service"     size={26} />
                    <StarPicker value={value}       onChange={setValue}       label="💰 Value"        size={26} />
                    <StarPicker value={locationRate}onChange={setLocationRate}label="📍 Location"    size={26} />
                </View>

                {/* Title */}
                <View style={s.card}>
                    <Text style={s.sectionLabel}>Review Title (optional)</Text>
                    <TextInput
                        style={s.input}
                        placeholder="Summarize your experience..."
                        placeholderTextColor="#94A3B8"
                        value={title}
                        onChangeText={setTitle}
                        maxLength={150}
                    />
                </View>

                {/* Body */}
                <View style={s.card}>
                    <Text style={s.sectionLabel}>Your Review</Text>
                    <TextInput
                        style={[s.input, s.textarea]}
                        placeholder="Tell others about your stay — what you loved, what could be improved..."
                        placeholderTextColor="#94A3B8"
                        value={body}
                        onChangeText={setBody}
                        multiline
                        numberOfLines={5}
                        maxLength={1000}
                    />
                    <Text style={s.charCount}>{body.length}/1000</Text>
                </View>

                {error && (
                    <View style={s.errorBanner}>
                        <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
                        <Text style={s.errorText}>{error}</Text>
                    </View>
                )}
            </ScrollView>

            {/* Submit button */}
            <View style={s.footer}>
                <TouchableOpacity
                    style={[s.submitBtn, (!isValid || submitting) && s.submitDisabled]}
                    onPress={submit}
                    disabled={!isValid || submitting}
                    activeOpacity={0.8}
                >
                    {submitting
                        ? <ActivityIndicator color={colors.white} />
                        : <Text style={s.submitText}>Submit Review</Text>
                    }
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const s = StyleSheet.create({
    safe:         { flex: 1, backgroundColor: colors.white },
    header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.gray100 },
    backBtn:      { width: 40, height: 40, justifyContent: 'center' },
    headerTitle:  { fontSize: 18, fontWeight: '700', color: colors.dark },
    container:    { flex: 1, backgroundColor: '#F8FAFC' },
    entityCard:   { flexDirection: 'row', alignItems: 'center', gap: 10, margin: 16, padding: 12, backgroundColor: '#EFF6FF', borderRadius: 12, borderWidth: 1, borderColor: '#BFDBFE' },
    entityName:   { flex: 1, fontSize: 14, fontWeight: '600', color: colors.primary },
    card:         { backgroundColor: colors.white, margin: 16, marginTop: 0, padding: 16, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
    sectionLabel: { fontSize: 15, fontWeight: '700', color: colors.dark, marginBottom: 12 },
    subLabel:     { fontSize: 13, fontWeight: '600', color: colors.secondaryText, marginBottom: 6 },
    ratingHint:   { fontSize: 14, color: colors.secondaryText, marginBottom: 12 },
    input:        { borderWidth: 1, borderColor: colors.gray200, borderRadius: 10, padding: 12, fontSize: 14, color: colors.dark, backgroundColor: '#F8FAFC' },
    textarea:     { height: 120, textAlignVertical: 'top' },
    charCount:    { textAlign: 'right', fontSize: 11, color: '#94A3B8', marginTop: 4 },
    errorBanner:  { flexDirection: 'row', alignItems: 'center', gap: 8, margin: 16, padding: 12, backgroundColor: '#FEF2F2', borderRadius: 10, borderWidth: 1, borderColor: '#FECACA' },
    errorText:    { color: colors.error, fontSize: 13, flex: 1 },
    footer:       { padding: 16, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.gray100 },
    submitBtn:    { backgroundColor: colors.primary, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
    submitDisabled: { backgroundColor: colors.gray200 },
    submitText:   { color: colors.white, fontSize: 16, fontWeight: '700' },
});

export default WriteReviewScreen;
