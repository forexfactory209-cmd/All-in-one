import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/src/theme';

export const styles = StyleSheet.create({
    container: {
        marginTop: spacing.sm,
        paddingBottom: spacing.md,
    },
    header: {
        paddingHorizontal: 16,
        marginBottom: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#05303D', // Darker blue for premium look
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 20,
    },
    locationCard: {
        alignItems: 'center',
        width: 70,
    },
    imageContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#E6F3F7',
        marginBottom: 8,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    locationName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.dark,
        textAlign: 'center',
    },
    loadingContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
