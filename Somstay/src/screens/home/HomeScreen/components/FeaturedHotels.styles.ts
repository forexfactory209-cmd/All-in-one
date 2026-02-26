import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/src/theme';

export const styles = StyleSheet.create({
    container: {
        marginVertical: 0,
        marginTop: 20,
        // marginBottom
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    title: {
        fontSize: 19,
        fontWeight: '700',
        color: colors.text.primary,
        marginBottom: 6,
    },
    seeAll: {
        fontSize: 15,
        color: colors.primary,
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        gap: 16,
        // marginLeft: -10,
    },
    loadingContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
