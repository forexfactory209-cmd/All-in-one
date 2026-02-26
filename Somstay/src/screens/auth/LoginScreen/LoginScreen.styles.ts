import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, borderRadius } from '@/src/theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        justifyContent: 'center',
        paddingBottom: 40,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#000000',
        textAlign: 'center',
        letterSpacing: -1,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: colors.secondaryText,
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: spacing.md,
    },
    inputContainer: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.dark,
        marginBottom: 8,
    },
    phoneInputWrapper: {
        flexDirection: 'row',
        height: 58,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 16,
        overflow: 'hidden',
    },
    countryCode: {
        width: 70,
        height: '100%',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1,
        borderRightColor: '#F3F4F6',
    },
    countryCodeText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.dark,
    },
    input: {
        flex: 1,
        paddingHorizontal: spacing.md,
        fontSize: 16,
        color: colors.dark,
        fontWeight: '500',
    },
    continueButton: {
        height: 58,
        backgroundColor: colors.primary,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    passwordLoginLink: {
        alignSelf: 'center',
    },
    passwordLoginText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        paddingHorizontal: spacing.xl,
    },
    footerText: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 18,
    },
    linkText: {
        color: '#6B7280',
        textDecorationLine: 'underline',
        fontWeight: '600',
    },
});
