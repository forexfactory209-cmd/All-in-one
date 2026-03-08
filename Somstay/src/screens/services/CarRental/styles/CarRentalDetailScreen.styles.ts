import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, borderRadius, shadows, typography } from '@/src/theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
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
        color: colors.error,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    
    // Header
    imageContainer: {
        width: '100%',
        height: 380,
        position: 'relative',
        backgroundColor: colors.gray100,
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
        top: 60,
        left: spacing.md,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.medium,
    },
    headerActions: {
        position: 'absolute',
        top: 60,
        right: spacing.md,
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.95)',
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
        backgroundColor: colors.white,
        marginTop: -50,
        paddingTop: spacing.xl,
        zIndex: 10,
        elevation: 20, // High elevation for visibility
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: colors.primary + '15', // Translucent brand color
        alignSelf: 'flex-start',
        marginBottom: spacing.sm,
    },
    badgeText: {
        ...typography.textStyles.caption,
        color: colors.primary,
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
        ...typography.textStyles.h2,
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 32,
    },
    priceTag: {
        alignItems: 'flex-end',
    },
    priceText: {
        ...typography.textStyles.h3,
        color: colors.primary,
        fontSize: 28,
        fontWeight: 'bold',
    },
    priceLabel: {
        ...typography.textStyles.caption,
        color: colors.secondaryText,
        fontWeight: '600',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.lg,
        gap: 8,
    },
    locationText: {
        ...typography.textStyles.bodySmall,
        color: colors.secondaryText,
        fontWeight: '500',
    },

    // High Stylish Specs Grid
    featuresGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: spacing.xl,
        gap: 12,
    },
    featureCard: {
        flex: 1,
        backgroundColor: colors.gray100,
        padding: 16,
        borderRadius: 24,
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: colors.white,
        ...shadows.small,
    },
    featureIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureValue: {
        ...typography.textStyles.label,
        color: '#000000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    featureLabel: {
        ...typography.textStyles.captionSmall,
        color: '#333333',
        fontWeight: '600',
        marginTop: 2,
    },

    // Owner Card
    ownerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.gray100,
        borderRadius: 24,
        gap: 12,
        borderWidth: 1,
        borderColor: colors.gray200,
    },
    ownerAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.small,
    },
    ownerName: {
        ...typography.textStyles.body,
        color: '#000000',
        fontWeight: 'bold',
    },
    ownerSub: {
        ...typography.textStyles.caption,
        color: '#333333',
    },
    contactBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: colors.primary,
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
        color: colors.dark,
        fontWeight: '800',
    },
    description: {
        ...typography.textStyles.bodySmall,
        lineHeight: 24,
        color: colors.secondaryText,
        fontSize: 15,
    },

    // Gallery
    galleryContainer: {
        marginHorizontal: -spacing.xl,
        paddingLeft: spacing.xl,
    },
    galleryImage: {
        width: 220,
        height: 150,
        borderRadius: 28,
        marginRight: 16,
        borderWidth: 4,
        borderColor: colors.gray100,
    },

    // Terms with Style
    termItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        padding: 18,
        backgroundColor: colors.background,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.gray200,
    },
    termIconBox: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.small,
    },
    termText: {
        ...typography.textStyles.bodySmall,
        color: colors.dark,
        fontWeight: '600',
        flex: 1,
    },

    // Bottom Bar (The "Booking Action Center")
    bottomBar: {
        flexDirection: 'row',
        paddingHorizontal: spacing.xl,
        paddingTop: spacing.md,
        paddingBottom: 40,
        backgroundColor: colors.white,
        borderTopLeftRadius: 36,
        borderTopRightRadius: 36,
        alignItems: 'center',
        justifyContent: 'space-between',
        ...shadows.large,
    },
    totalInfo: {
        flex: 1,
    },
    totalLabel: {
        ...typography.textStyles.captionSmall,
        color: '#333333',
        fontWeight: 'bold',
        marginBottom: 2,
    },
    totalPrice: {
        ...typography.textStyles.h2,
        color: '#000000',
        fontSize: 26,
        fontWeight: 'bold',
    },
    bookButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xl,
        height: 64,
        borderRadius: 24,
        minWidth: 180,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.medium,
    },
    bookButtonText: {
        ...typography.textStyles.button,
        color: colors.white,
        fontSize: 18,
        fontWeight: '800',
    },
});
