import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/src/theme';

export const styles = StyleSheet.create({
    container: {
        paddingVertical: 16,
        marginTop: -12,

    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.text.primary,
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 16,
    },
    locationItem: {
        alignItems: 'center',
        width: 80,

    },
    locationImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.gray100,
        marginBottom: 8,
        borderWidth: 5,
        borderColor: '#000000',
    },
    locationName: {
        fontSize: 12,
        color: colors.text.primary,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 16,
    },
});
