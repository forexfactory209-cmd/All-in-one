import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/src/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },

    // Progress Indicator
    progressWrapper: {
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.lg,
        borderBottomWidth: 1,
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
    progressCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    progressNumber: {
        ...typography.textStyles.labelSmall,
        fontWeight: '700',
    },
    progressText: {
        ...typography.textStyles.captionSmall,
        marginTop: 6,
        fontWeight: '700',
    },

    scrollContent: {
        padding: spacing.md,
        paddingTop: spacing.lg,
    },

    // Footer
    footer: {
        padding: spacing.md,
        paddingBottom: 20,
        borderTopWidth: 1,
        flexDirection: 'row',
        gap: spacing.md,
        ...shadows.medium,
    },
    backButton: {
        flex: 1,
        height: 52,
        borderRadius: borderRadius.large,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    backButtonText: {
        ...typography.textStyles.button,
    },
    nextButton: {
        flex: 2,
        height: 52,
        borderRadius: borderRadius.large,
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
});
