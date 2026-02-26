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
        paddingVertical: spacing.md,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.dark,
    },
    closeButton: {
        padding: spacing.xs,
    },
    searchContainer: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.lg,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F9FA',
        borderRadius: 24,
        paddingHorizontal: spacing.md,
        height: 54,
    },
    searchIcon: {
        marginRight: spacing.sm,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: colors.dark,
        fontWeight: '500',
    },
    currentLocationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.xl,
    },
    currentLocationIconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F5F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    currentLocationTextContent: {
        flex: 1,
    },
    currentLocationTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.dark,
    },
    currentLocationSubtitle: {
        fontSize: 12,
        color: '#9BA3A3',
        marginTop: 2,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#9BA3A3',
        letterSpacing: 0.5,
    },
    clearAllText: {
        fontSize: 13,
        fontWeight: '700',
        color: colors.primary,
    },
    recentSearchItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    recentSearchIcon: {
        marginRight: spacing.md,
    },
    recentSearchText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '700',
        color: '#5A5E5E',
    },
    recentSearchTime: {
        fontSize: 12,
        color: '#BDBDBD',
    },
    suggestedCityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    suggestedCityIconBox: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#E6F3F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    suggestedCityTextContent: {
        flex: 1,
    },
    suggestedCityName: {
        fontSize: 17,
        fontWeight: '800',
        color: colors.dark,
    },
    suggestedCityDescription: {
        fontSize: 13,
        color: '#9BA3A3',
        marginTop: 2,
    },
    footerContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: '#B0B8B8',
        textAlign: 'center',
        lineHeight: 20,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginHorizontal: spacing.lg,
        marginVertical: spacing.xs,
    },
});
