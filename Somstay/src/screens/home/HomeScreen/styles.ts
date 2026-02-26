import { StyleSheet } from 'react-native';
import { colors, spacing } from '@/src/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 20,
    },
    statusBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: spacing.xs,
        marginBottom: spacing.sm,
    },
    time: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '600',
    },
    appTitle: {
        fontSize: 25,
        fontWeight: '700',
        color: colors.white,
        textAlign: 'center',
        letterSpacing: 3,
        marginBottom: 15,
        marginTop: 4,
    },
    locationSubtitle: {
        fontSize: 13,
        color: colors.white,
        textAlign: 'left',
        marginBottom: 7,
        marginLeft: 10,
        fontWeight: '400',
    },
    locationHighlight: {
        fontWeight: '700',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    section: {
        marginTop: 10,
    },
});
