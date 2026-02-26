import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, borderRadius } from '@/src/theme';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        height: 50,
        zIndex: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: -12,
    },
    skipButton: {
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.sm,
    },
    skipText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
        letterSpacing: 0.3,
    },
    pager: {
        flex: 1,
    },
    page: {
        width: width,
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
    },
    imageContainer: {
        width: '100%',
        height: height * 0.42,
        borderRadius: 40,
        overflow: 'hidden',
        marginTop: spacing.md,
        marginBottom: -15,
        backgroundColor: '#F7FAFC',
    },
    onboardingImage: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        alignItems: 'center',
        marginTop: spacing.xl * 1.8,
        paddingHorizontal: spacing.md,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#000000',
        textAlign: 'center',
        lineHeight: 35,
        marginTop: -10,
        // marginBottom: spacing.md,
        letterSpacing: -1.2,
    },
    highlight: {
        color: colors.primary,
        fontWeight: '900',
    },
    subtext: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: spacing.md,
        fontWeight: '500',
        marginTop: 4,
    },
    footer: {
        paddingHorizontal: spacing.xl,
        paddingBottom: 40,
        alignItems: 'center',
    },
    paginationContainer: {
        flexDirection: 'row',
        marginBottom: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        height: 6,
        borderRadius: 3,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 5,
    },
    activeDot: {
        width: 24,
        backgroundColor: colors.primary,
    },
    inactiveDot: {
        width: 6,
        backgroundColor: '#D1D5DB',
    },
    primaryButton: {
        width: '100%',
        height: 62,
        backgroundColor: colors.primary,
        borderRadius: 22,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6,
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
});
