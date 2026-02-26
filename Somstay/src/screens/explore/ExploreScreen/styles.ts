import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/src/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    listHeader: {
        paddingBottom: spacing.sm,
    },
    resultsInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    resultsCount: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.dark,
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    sortLabel: {
        fontSize: 13,
        color: '#7C7C7C',
    },
    sortText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.dark,
    },
    scrollContent: {
        paddingVertical: spacing.sm,
        paddingBottom: 100, // Space for FAB
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
