import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/src/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '700',
        color: colors.dark,
        marginRight: 40, // To center title relative to back button
    },
    content: {
        padding: spacing.md,
    },
    propertyCard: {
        flexDirection: 'row',
        backgroundColor: '#F7FBFC',
        padding: spacing.md,
        borderRadius: 20,
        marginBottom: spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E8F4F8',
    },
    propertyInfo: {
        flex: 1,
    },
    propertyTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.dark,
        marginBottom: 4,
    },
    propertyPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 12,
        color: '#999',
        marginLeft: 4,
    },
    propertyImage: {
        width: 80,
        height: 80,
        borderRadius: 12,
        marginLeft: spacing.md,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.dark,
        marginBottom: spacing.md,
    },
    calendarContainer: {
        backgroundColor: colors.white,
        borderRadius: 24,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        marginBottom: spacing.xl,
        ...shadows.small,
    },
    calendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    monthTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.dark,
    },
    weekdaysRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: spacing.sm,
    },
    weekdayText: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '600',
        width: 32,
        textAlign: 'center',
    },
    daysGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    dayCell: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    dayText: {
        fontSize: 14,
        color: colors.dark,
    },
    inactiveDayText: {
        color: '#CCC',
    },
    selectedDay: {
        backgroundColor: colors.primary,
        borderRadius: 18,
    },
    selectedDayText: {
        color: colors.white,
        fontWeight: '700',
    },
    rangeDay: {
        backgroundColor: '#E6F3F6',
    },
    guestRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    guestLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.dark,
    },
    guestSubLabel: {
        fontSize: 12,
        color: '#999',
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    counterButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterValue: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.dark,
        minWidth: 20,
        textAlign: 'center',
    },
    messageInput: {
        borderWidth: 1,
        borderColor: '#E8F4F8',
        borderRadius: 20,
        padding: spacing.md,
        height: 100,
        textAlignVertical: 'top',
        fontSize: 14,
        color: colors.dark,
        marginBottom: spacing.xl,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    priceLabel: {
        fontSize: 14,
        color: '#999',
    },
    priceValue: {
        fontSize: 14,
        color: colors.dark,
        fontWeight: '500',
    },
    serviceFee: {
        textDecorationLine: 'underline',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.md,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        marginBottom: spacing.xl,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.dark,
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '800',
        color: colors.primary,
    },
    footer: {
        padding: spacing.md,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    bookingButton: {
        backgroundColor: colors.primary,
        borderRadius: 16,
        paddingVertical: spacing.md,
        alignItems: 'center',
    },
    bookingButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
    },
});
