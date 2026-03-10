import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/src/theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    errorText: {
        ...typography.textStyles.body,
        textAlign: 'center',
        marginBottom: spacing.md,
    },

    // Header
    imageContainer: {
        width: '100%',
        height: 380,
        position: 'relative',
    },
    mainImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    linearGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 120, // Top shadow for buttons
    },
    overlayBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 160,
    },
    backButton: {
        position: 'absolute',
        left: spacing.md,
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.medium,
    },
    headerActions: {
        position: 'absolute',
        right: spacing.md,
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.medium,
    },

    // Content Card
    content: {
        flex: 1,
        paddingHorizontal: spacing.xl,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: -50,
        paddingTop: spacing.xl,
        zIndex: 10,
        elevation: 10,
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: spacing.sm,
    },
    badgeText: {
        ...typography.textStyles.caption,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    title: {
        ...typography.textStyles.h1,
        fontSize: 26,
        flexWrap: 'wrap',
    },
    priceTag: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.medium,
    },
    priceText: {
        ...typography.textStyles.h4,
        fontSize: 20,
        fontWeight: 'bold',
    },
    priceLabel: {
        ...typography.textStyles.captionSmall,
        fontWeight: '700',
        textTransform: 'uppercase',
        opacity: 0.9,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        gap: 6,
    },
    locationText: {
        ...typography.textStyles.captionSmall,
    },

    // Refined Specs Grid (Smaller for user request)
    featuresGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: spacing.md,
        gap: 8,
    },
    featureCard: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 6,
        borderRadius: 16,
        alignItems: 'center',
        borderWidth: 1,
    },
    featureIconContainer: {
        width: 28,
        height: 28,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    featureValue: {
        ...typography.textStyles.label,
        fontWeight: '800',
        fontSize: 14,
    },
    featureLabel: {
        fontSize: 9,
        fontWeight: '700',
        marginTop: 1,
        textTransform: 'uppercase',
        opacity: 0.7,
    },

    // Owner Card
    ownerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 24,
        gap: 14,
        borderWidth: 1,
    },
    ownerAvatar: {
        width: 52,
        height: 52,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ownerName: {
        ...typography.textStyles.h6,
        fontSize: 16,
    },
    ownerSub: {
        ...typography.textStyles.caption,
        marginTop: 2,
        fontWeight: '600',
        opacity: 0.8,
    },
    contactBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Sections
    section: {
        marginBottom: spacing.xl,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.textStyles.h4,
        fontWeight: '800',
    },
    description: {
        ...typography.textStyles.bodySmall,
        lineHeight: 22,
        fontSize: 14,
    },

    // Gallery
    galleryContainer: {
        marginHorizontal: -spacing.xl,
        paddingLeft: spacing.xl,
    },
    galleryImage: {
        width: 200,
        height: 140,
        borderRadius: 24,
        marginRight: 12,
        borderWidth: 2,
    },

    // Terms with Style
    termItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        borderRadius: 18,
        marginBottom: 10,
        borderWidth: 1,
    },
    termIconBox: {
        width: 38,
        height: 38,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    termText: {
        ...typography.textStyles.bodySmall,
        fontWeight: '600',
        flex: 1,
    },

    // Bottom Bar
    bottomBar: {
        flexDirection: 'row',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        paddingBottom: 30, // insets handled in screen
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    totalInfo: {
        flex: 1,
    },
    totalLabel: {
        fontSize: 11,
        fontWeight: '800',
        marginBottom: 2,
        opacity: 0.7,
    },
    totalPrice: {
        ...typography.textStyles.h2,
        fontSize: 24,
        fontWeight: 'bold',
    },
    bookButton: {
        paddingHorizontal: 32,
        height: 58,
        borderRadius: 20,
        minWidth: 160,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bookButtonText: {
        ...typography.textStyles.button,
        color: colors.white,
        fontSize: 16,
        fontWeight: '800',
    },
});
