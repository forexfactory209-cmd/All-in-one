import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows } from '@/src/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFA', // Soft off-white background
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        ...shadows.small,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFA',
        marginRight: spacing.sm,
    },
    headerSearchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        height: 44,
    },
    searchIcon: {
        marginRight: spacing.sm,
    },
    headerTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.dark,
    },
    filterButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: spacing.sm,
    },
    filterChipsContainer: {
        backgroundColor: colors.white,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingHorizontal: spacing.lg,
        paddingVertical: 10,
        borderRadius: 12,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        ...shadows.small,
    },
    activeFilterChip: {
        backgroundColor: '#E6F3F7',
        borderColor: colors.primary,
    },
    filterChipText: {
        fontSize: 13,
        color: '#5A5E5E',
        fontWeight: '500',
    },
    activeFilterChipText: {
        color: colors.primary,
        fontWeight: '600',
    },
    resultsInfo: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
    resultsCount: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.dark,
    },
    resultsSubtitle: {
        fontSize: 12,
        color: '#7C7C7C',
        marginTop: 2,
    },
    listContent: {
        paddingBottom: spacing.xl,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: '#7C7C7C',
        marginTop: spacing.md,
    },
});
