import { StyleSheet, Dimensions } from 'react-native';
import { colors } from '@/src/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Responsive 2-column layout
const COLUMN_GAP = 12;
const HORIZONTAL_PADDING = 14;
export const CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - COLUMN_GAP) / 2;
const IMAGE_HEIGHT = CARD_WIDTH * 0.8; // Smaller image for longer info section

export const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        borderRadius: 18,
        // Standard shadow for better dark mode compatibility
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: COLUMN_GAP,
        overflow: 'visible',
    },
    // Inner clip wrapper to keep image inside rounded corners
    innerClip: {
        borderRadius: 18,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: IMAGE_HEIGHT,
        backgroundColor: colors.gray100,
    },
    // ── Overlay gradient strip at bottom of image ──────────────────────────────
    imageOverlay: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: IMAGE_HEIGHT * 0.38,
    },
    // ── Top left badge ──────────────────────────────────────────────────────────
    featuredBadge: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#FFEA00',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        zIndex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    featuredText: {
        fontSize: 9,
        fontWeight: '800',
        color: '#1A1A1A',
        letterSpacing: 0.6,
    },
    // ── Top right favourite button ───────────────────────────────────────────────
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },
    // ── Rating chip overlaid on image bottom ────────────────────────────────────
    ratingOverlay: {
        position: 'absolute',
        bottom: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.52)',
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 20,
        gap: 3,
        zIndex: 2,
    },
    ratingOverlayText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    // ── Info body ────────────────────────────────────────────────────────────────
    infoContainer: {
        paddingHorizontal: 11,
        paddingTop: 10,
        paddingBottom: 12,
    },
    title: {
        fontSize: 13,
        fontWeight: '800',
        marginBottom: 4,
        lineHeight: 17,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    location: {
        marginLeft: 3,
        fontSize: 11,
        flex: 1,
        lineHeight: 14,
    },
    // ── Divider ─────────────────────────────────────────────────────────────────
    divider: {
        height: 1,
        marginBottom: 8,
        marginHorizontal: 2,
    },
    // ── Price + badge row ────────────────────────────────────────────────────────
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    priceWrap: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    currency: {
        fontSize: 11,
        fontWeight: '600',
        marginRight: 1,
    },
    price: {
        fontSize: 17,
        fontWeight: '900',
        letterSpacing: -0.3,
    },
    priceLabel: {
        marginLeft: 2,
        fontSize: 10,
        fontWeight: '500',
    },
    // ── Verified badge (bottom right) ────────────────────────────────────────────
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 5,
        gap: 3,
    },
    verifiedText: {
        fontSize: 9,
        fontWeight: '800',
        color: '#06A649',
        letterSpacing: 0.3,
    },
});
