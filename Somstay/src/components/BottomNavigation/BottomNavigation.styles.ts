import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/src/theme';

export const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm,
        paddingBottom: spacing.md,
        borderTopWidth: 0,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xs,
    },
    navLabel: {
        fontSize: 11,
        color: colors.white,
        marginTop: 4,
        fontWeight: '500',
    },
    navLabelActive: {
        color: colors.white,
        fontWeight: '700',
    },
});
