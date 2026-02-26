import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/src/theme';

export const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        marginTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.text.primary,
    },
    viewAll: {
        fontSize: 13,
        color: colors.primary,
        fontWeight: '600',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 15,
        gap: 16,
    },
    brokerCard: {
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 12,
        width: 100,
        // Individual Card Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
        marginHorizontal: 4,
    },
    brokerImage: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: colors.gray100,
        marginBottom: 8,
    },
    verifiedBadge: {
        position: 'absolute',
        top: 44,
        left: '50%',
        marginLeft: 12,
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 2,
    },
    brokerName: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 4,
        textAlign: 'center',
        lineHeight: 14,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    rating: {
        fontSize: 11,
        fontWeight: '600',
        color: colors.text.primary,
    },
});
