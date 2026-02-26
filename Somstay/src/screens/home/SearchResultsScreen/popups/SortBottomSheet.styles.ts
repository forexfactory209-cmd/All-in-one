import { StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/src/theme';

export const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    sheetContainer: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#E5E7EB',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.dark,
    },
    closeButton: {
        padding: 4,
    },
    optionsContainer: {
        marginBottom: 32,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: spacing.sm,
    },
    selectedOptionItem: {
        borderColor: 'rgba(2, 136, 172, 0.1)',
        backgroundColor: 'rgba(2, 136, 172, 0.05)',
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    optionText: {
        fontSize: 15,
        color: colors.secondaryText,
        fontWeight: '500',
    },
    selectedOptionText: {
        color: colors.primary,
        fontWeight: '600',
    },
    radioCircle: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRadioCircle: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
    },
    radioInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.white,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    resetButton: {
        flex: 0.35,
        height: 52,
        borderRadius: 16,
        backgroundColor: '#F3F7F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resetText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.dark,
    },
    applyButton: {
        flex: 0.6,
        height: 52,
        borderRadius: 16,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    applyText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.white,
    },
});
