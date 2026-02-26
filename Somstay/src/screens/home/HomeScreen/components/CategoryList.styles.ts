import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, borderRadius } from '@/src/theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        width: '100%',
    },
    scrollContent: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width, // Force width to handle centering sensation
    },
    categoryItem: {
        alignItems: 'center',

        width: (width - 40 - 45) / 4, // Calculate width based on screen and gaps
    },
    iconContainer: {
        width: 65,
        height: 65,
        borderRadius: 16,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        // Add subtle shadow to icons too
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    categoryName: {
        fontSize: 12,
        color: colors.text.primary,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 14,
    },
});
