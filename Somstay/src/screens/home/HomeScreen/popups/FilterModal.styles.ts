import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, borderRadius } from '@/src/theme';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        borderTopLeftRadius: borderRadius.lg,
        borderTopRightRadius: borderRadius.lg,
        maxHeight: height * 0.9,
        paddingBottom: 20,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: colors.gray200,
        borderRadius: 2.5,
        alignSelf: 'center',
        marginTop: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    closeButton: {
        padding: 5,
    },
    content: {
        paddingHorizontal: spacing.md,
    },
    section: {
        marginTop: spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: spacing.md,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeChip: {
        backgroundColor: colors.primary,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
    },
    activeChipText: {
        color: colors.white,
    },
    priceRangeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    priceDisplayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    priceBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    priceBadgeText: {
        color: colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    priceSeparator: {
        fontSize: 16,
    },
    sliderContainer: {
        height: 40,
        justifyContent: 'center',
        marginTop: 10,
    },
    sliderTrack: {
        height: 4,
        borderRadius: 2,
        position: 'relative',
    },
    activeTrack: {
        position: 'absolute',
        height: 4,
        backgroundColor: colors.primary,
        borderRadius: 2,
    },
    sliderThumb: {
        position: 'absolute',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.primary,
        borderWidth: 4,
        top: -10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sliderLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    sliderLabelText: {
        fontSize: 12,
        fontWeight: '500',
    },
    rowSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: spacing.xl,
    },
    textContainer: {
        flex: 1,
        marginRight: spacing.md,
    },
    rowSubTitle: {
        fontSize: 14,
        marginTop: 4,
    },
    ratingChipContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    ratingChip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1,
        gap: 6,
    },
    activeRatingChip: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    ratingText: {
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingTop: spacing.lg,
        paddingBottom: spacing.lg,
        marginTop: spacing.xl,
        borderTopWidth: 1,
        gap: 20,
    },
    resetButton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
    },
    resetText: {
        fontSize: 16,
        fontWeight: '600',
    },
    applyButton: {
        flex: 2,
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    applyButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.white,
    },
    destinationScrollView: {
        marginTop: spacing.xs,
    },
    destinationChip: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeDestinationChip: {
        borderColor: colors.primary,
        borderWidth: 1.5,
    },
    destinationText: {
        fontSize: 14,
        fontWeight: '600',
    },
    activeDestinationText: {
        color: colors.primary,
    },
});
