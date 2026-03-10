import { StyleSheet } from 'react-native';
import { spacing } from '@/src/theme';

export const styles = StyleSheet.create({
    container: {
        paddingVertical: spacing.md,
        backgroundColor: 'transparent',
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
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    activeIconContainer: {
        // Will be applied along with dynamic background
    },
    categoryName: {
        fontSize: 13,
        fontWeight: '600',
    },
    activeCategoryName: {
        fontWeight: '700',
    },
});
