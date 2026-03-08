import { StyleSheet } from 'react-native';
import { colors } from '@/src/theme';
import { CARD_WIDTH } from './HotelCard.styles';

const COLUMN_GAP = 12;
const HORIZONTAL_PADDING = 14;
const SKELETON_CARD_W = CARD_WIDTH;
const SKELETON_IMG_H = SKELETON_CARD_W * 0.8; // match new ratio

export const styles = StyleSheet.create({
    container: {
        marginTop: 13,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: HORIZONTAL_PADDING,
        marginBottom: 14,
    },
    title: {
        fontSize: 19,
        fontWeight: '700',
        color: colors.text?.primary ?? '#1A1A1A',
    },
    seeAll: {
        fontSize: 14,
        color: colors.primary ?? '#0288AC',
        fontWeight: '600',
    },
    gridContent: {
        paddingHorizontal: HORIZONTAL_PADDING,
        paddingBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: COLUMN_GAP,
    },
    // Skeleton
    skeletonCard: {
        width: SKELETON_CARD_W,
        backgroundColor: colors.white,
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 6,
        elevation: 3,
    },
    skeletonImage: {
        width: '100%',
        height: SKELETON_IMG_H,
        backgroundColor: '#E5E7EB',
    },
    skeletonBody: {
        padding: 10,
    },
    skeletonTitle: {
        height: 12,
        width: '80%',
        backgroundColor: '#E5E7EB',
        borderRadius: 6,
        marginBottom: 8,
    },
    skeletonSub: {
        height: 10,
        width: '55%',
        backgroundColor: '#F3F4F6',
        borderRadius: 6,
    },
    // Footer
    footerLoader: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 13,
        color: '#888',
    },
});
