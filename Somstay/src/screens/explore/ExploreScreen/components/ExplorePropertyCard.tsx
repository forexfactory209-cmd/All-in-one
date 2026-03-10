import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/src/theme';
import { useTheme } from '@/src/context/AppContext';

export interface Property {
    id: string;
    title: string;
    location: string;
    price: string;
    priceLabel?: string;
    rating: number;
    image: string;
    isVerified?: boolean;
    isFeatured?: boolean;
    isForSale?: boolean;
    isFavorite?: boolean;
    type: 'rental' | 'sale';
}

interface ExplorePropertyCardProps {
    property: Property;
    onPress: () => void;
    onFavoritePress: () => void;
    onActionPress?: () => void;
}

export const ExplorePropertyCard: React.FC<ExplorePropertyCardProps> = ({
    property,
    onPress,
    onFavoritePress,
    onActionPress,
}) => {
    const theme = useTheme();
    const isRental = property.type === 'rental';

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}
            activeOpacity={0.9}
            onPress={onPress}
        >
            {/* Image Section */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: property.image }} style={styles.image} />

                {/* Overlays */}
                <View style={styles.badgeContainer}>
                    {property.isVerified && (
                        <View style={[styles.badge, styles.verifiedBadge]}>
                            <Ionicons name="checkmark-circle" size={12} color={colors.white} />
                            <Text style={styles.badgeText}>VERIFIED</Text>
                        </View>
                    )}
                    {property.isFeatured && (
                        <View style={[styles.badge, styles.featuredBadge]}>
                            <Ionicons name="flash" size={12} color="#1A1A1A" />
                            <Text style={[styles.badgeText, { color: '#1A1A1A' }]}>FEATURED</Text>
                        </View>
                    )}
                    {property.isForSale && (
                        <View style={[styles.badge, styles.saleBadge]}>
                            <Text style={styles.badgeText}>FOR SALE</Text>
                        </View>
                    )}
                </View>

                {/* Favorite Button */}
                <TouchableOpacity
                    style={[styles.favoriteButton, { backgroundColor: theme.card + 'CC' }]}
                    onPress={onFavoritePress}
                >
                    <Ionicons
                        name={property.isFavorite ? "heart" : "heart-outline"}
                        size={22}
                        color={property.isFavorite ? colors.error : theme.textSecondary}
                    />
                </TouchableOpacity>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{property.title}</Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={[styles.ratingText, { color: theme.text }]}>{Number(property.rating || 4.5).toFixed(1)}</Text>
                    </View>
                </View>

                <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={14} color={theme.primary} />
                    <Text style={[styles.locationText, { color: theme.textSecondary }]} numberOfLines={1}>{property.location}</Text>
                </View>

                <View style={styles.footerRow}>
                    <View style={styles.priceContainer}>
                        <Text style={[styles.priceText, { color: theme.primary }]}>{property.price}</Text>
                        {property.priceLabel && (
                            <Text style={[styles.priceLabelText, { color: theme.textSecondary }]}> {property.priceLabel}</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            { backgroundColor: isRental ? theme.surfaceSecondary : theme.primary }
                        ]}
                        onPress={(e) => {
                            e.stopPropagation();
                            onActionPress?.();
                        }}
                    >
                        <Text style={[
                            styles.actionButtonText,
                            { color: isRental ? theme.primary : colors.white }
                        ]}>
                            {isRental ? 'Book Now' : 'Contact Agent'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        marginHorizontal: spacing.md,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 6,
    },
    imageContainer: {
        width: '100%',
        height: 220,
        position: 'relative',
        backgroundColor: colors.gray100,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    badgeContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        gap: 6,
        zIndex: 2,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        gap: 4,
    },
    verifiedBadge: {
        backgroundColor: colors.success,
    },
    featuredBadge: {
        backgroundColor: '#FFEA00',
    },
    saleBadge: {
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    badgeText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: '800',
    },
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        padding: spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
        marginRight: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 12,
    },
    locationText: {
        fontSize: 13,
        fontWeight: '500',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    priceText: {
        fontSize: 20,
        fontWeight: '800',
    },
    priceLabelText: {
        fontSize: 14,
        fontWeight: '500',
    },
    actionButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
});
