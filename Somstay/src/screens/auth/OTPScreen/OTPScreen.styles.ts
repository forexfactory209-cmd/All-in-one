import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, borderRadius } from '@/src/theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        marginBottom: 32,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
    },
    title: {
        fontSize: 30,
        fontWeight: '900',
        color: '#000000',
        marginBottom: 12,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        lineHeight: 24,
        marginBottom: 40,
        fontWeight: '500',
    },
    phoneNumber: {
        color: colors.primary,
        fontWeight: '700',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    otpInput: {
        width: (width - spacing.xl * 2 - 50) / 6,
        height: 58,
        borderWidth: 1.5,
        borderColor: '#F3F4F6',
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '700',
        color: colors.dark,
        backgroundColor: '#FFFFFF',
    },
    activeOtpInput: {
        borderColor: colors.primary,
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    resendButton: {
        paddingVertical: 4,
    },
    resendText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
    },
    timerContainer: {
        backgroundColor: '#F0F9FB',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    timerText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.dark,
        marginLeft: 4,
    },
    verifyButton: {
        height: 58,
        backgroundColor: colors.primary,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        marginTop: 'auto',
        marginBottom: 24,
    },
    verifyButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
        marginRight: 8,
    },
    footerText: {
        fontSize: 12,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 18,
        marginBottom: 20,
    },
});
