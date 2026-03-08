import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/src/theme';

export const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.md,
        backgroundColor: colors.white,
    },
    listContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
    },
    categoryItem: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 70,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F0F9FB', // Light version of primary
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    activeIconContainer: {
        backgroundColor: colors.primary,
    },
    categoryName: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.secondaryText,
    },
    activeCategoryName: {
        color: colors.primary,
        fontWeight: '700',
    },
});
