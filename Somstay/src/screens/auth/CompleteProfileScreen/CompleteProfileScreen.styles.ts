import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, borderRadius } from '@/src/theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        height: 60,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: '800',
        color: colors.dark,
        textAlign: 'center',
        marginRight: 44,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        paddingBottom: 40,
    },
    subtitle: {
        fontSize: 15,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
        fontWeight: '500',
    },
    photoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    photoWrapper: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F3E8D9',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
    },
    editPhotoButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    changePhotoText: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
    },
    formContainer: {
        width: '100%',
    },
    fieldGroup: {
        marginBottom: 20,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.dark,
        marginBottom: 10,
    },
    inputWrapper: {
        flexDirection: 'row',
        height: 58,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        borderRadius: 16,
        alignItems: 'center',
        paddingHorizontal: spacing.md,
    },
    inputIcon: {
        marginRight: 12,
    },
    textInput: {
        flex: 1,
        fontSize: 15,
        color: colors.dark,
        fontWeight: '500',
    },
    passwordStrengthContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
        marginBottom: 8,
    },
    strengthBar: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 2,
    },
    activeStrengthBar: {
        backgroundColor: colors.primary,
    },
    validationText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    finishButton: {
        height: 60,
        backgroundColor: colors.primary,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 24,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    finishButtonText: {
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
    },
    footerLink: {
        color: colors.primary,
        fontWeight: '600',
    },
});
