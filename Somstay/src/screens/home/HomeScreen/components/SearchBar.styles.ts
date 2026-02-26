import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/src/theme';

export const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    searchInputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 8,
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 13,
        color: colors.text.primary,
        fontWeight: '400',
    },
    filterButton: {
        width: 44,
        height: 44,
        backgroundColor: colors.white,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
