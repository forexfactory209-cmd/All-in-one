import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/src/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        height: 60,
    },
    headerTitle: {
        ...typography.textStyles.h4,
        color: colors.dark,
    },
    
    // Progress Indicator
    progressWrapper: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray100,
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressItem: {
        alignItems: 'center',
        zIndex: 2,
    },
    progressLine: {
        position: 'absolute',
        top: 14,
        left: 30,
        right: 30,
        height: 2,
        backgroundColor: colors.gray200,
        zIndex: 1,
    },
    progressLineActive: {
        backgroundColor: colors.primary,
    },
    progressCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.white,
        borderWidth: 2,
        borderColor: colors.gray200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeCircle: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    completedCircle: {
        backgroundColor: colors.success,
        borderColor: colors.success,
    },
    progressNumber: {
        ...typography.textStyles.labelSmall,
        color: colors.secondaryText,
        fontWeight: '700',
    },
    activeNumber: {
        color: colors.white,
    },
    progressText: {
        ...typography.textStyles.captionSmall,
        color: colors.secondaryText,
        marginTop: 6,
        fontWeight: '700',
    },
    activeText: {
        color: colors.primary,
    },

    scrollContent: {
        padding: spacing.md,
        paddingTop: spacing.lg,
    },

    // Footer
    footer: {
        padding: spacing.md,
        paddingBottom: 34,
        borderTopWidth: 1,
        borderTopColor: colors.gray100,
        flexDirection: 'row',
        gap: spacing.md,
        ...shadows.medium,
    },
    backButton: {
        flex: 1,
        height: 52,
        borderRadius: borderRadius.large,
        backgroundColor: colors.gray100,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.gray200,
    },
    backButtonText: {
        ...typography.textStyles.button,
        color: colors.dark,
    },
    nextButton: {
        flex: 2,
        height: 52,
        borderRadius: borderRadius.large,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.6,
    },
    nextButtonText: {
        ...typography.textStyles.button,
        color: colors.white,
    },
    confirmButton: {
        backgroundColor: colors.success,
    },
});
