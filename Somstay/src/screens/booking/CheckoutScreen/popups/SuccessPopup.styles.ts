import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/src/theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(4, 37, 46, 0.4)', // Darker, semi-transparent overlay
        justifyContent: 'flex-end',
    },
    sheetContainer: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: spacing.lg,
        paddingBottom: 40,
        alignItems: 'center',
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        marginTop: 12,
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.dark,
        marginBottom: 32,
    },
    successIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#ECFDF5', // Soft success green background
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    successCircleInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#D1FAE5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.dark,
        marginBottom: 12,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 14,
        color: '#5A5E5E',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    infoCard: {
        width: '100%',
        backgroundColor: '#F8FAFB', // Very light gray/blue surface
        borderRadius: 20,
        padding: spacing.md,
        marginBottom: 32,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    bookingIdSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ticketIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#E0F2F7', // Soft info blue
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    label: {
        fontSize: 11,
        color: '#9BA3A3',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    bookingId: {
        fontSize: 14,
        color: colors.dark,
        fontWeight: '700',
        marginTop: 2,
    },
    priceSection: {
        alignItems: 'flex-end',
    },
    totalPaid: {
        fontSize: 16,
        color: colors.primary,
        fontWeight: '700',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        width: '100%',
        marginBottom: 16,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    dividerLine: {
        height: 1,
        backgroundColor: '#F0F0F0',
        width: '100%',
        marginBottom: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        fontSize: 13,
        color: '#5A5E5E',
        fontWeight: '500',
        marginLeft: 8,
    },
    primaryButton: {
        width: '100%',
        height: 56,
        backgroundColor: colors.primary,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        ...shadows.button,
    },
    primaryButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    secondaryButtonsRow: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    secondaryButton: {
        flex: 0.48,
        height: 52,
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#5A5E5E',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
});
