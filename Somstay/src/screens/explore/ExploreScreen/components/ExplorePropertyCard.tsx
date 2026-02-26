import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '@/src/theme';

const { width } = Dimensions.get('window');

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
    const isRental = property.type === 'rental';

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={onPress}>
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
                            <Ionicons name="star" size={12} color={colors.dark} />
                            <Text style={[styles.badgeText, { color: colors.dark }]}>FEATURED</Text>
                        </View>
                    )}
                    {property.isForSale && (
                        <View style={[styles.badge, styles.saleBadge]}>
                            <Text style={styles.badgeText}>FOR SALE</Text>
                        </View>
                    )}
                </View>

                {/* Favorite Button */}
                <TouchableOpacity style={styles.favoriteButton} onPress={onFavoritePress}>
                    <Ionicons
                        name={property.isFavorite ? "heart" : "heart-outline"}
                        size={22}
                        color={property.isFavorite ? colors.error : colors.dark}
                    />
                </TouchableOpacity>
            </View>

            {/* Content Section */}
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <Text style={styles.title} numberOfLines={1}>{property.title}</Text>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.ratingText}>{property.rating.toFixed(1)}</Text>
                    </View>
                </View>

                <View style={styles.locationRow}>
                    <Ionicons name="location-outline" size={14} color="#999" />
                    <Text style={styles.locationText} numberOfLines={1}>{property.location}</Text>
                </View>

                <View style={styles.footerRow}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>{property.price}</Text>
                        {property.priceLabel && (
                            <Text style={styles.priceLabelText}> {property.priceLabel}</Text>
                        )}
                    </View>

                    <TouchableOpacity
                        style={[
                            styles.actionButton,
                            isRental ? styles.bookButton : styles.contactButton
                        ]}
                        onPress={(e) => {
                            e.stopPropagation();
                            onActionPress?.();
                        }}
                    >
                        <Text style={[
                            styles.actionButtonText,
                            isRental ? styles.bookButtonText : styles.contactButtonText
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
        backgroundColor: colors.white,
        borderRadius: 12, // Standardizing with home screen
        marginHorizontal: spacing.md,
        marginBottom: 20, // Match home screen spacing for shadows
        // Refined individual card shadow (matching HomeScreen PropertyCard)
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
        overflow: 'visible',
    },
    imageContainer: {
        width: '100%',
        height: 220,
        position: 'relative',
        backgroundColor: colors.gray100,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        overflow: 'hidden', // Keep overflow hidden here for the image
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    badgeContainer: {
        position: 'absolute',
        top: spacing.sm,
        left: spacing.sm,
        gap: spacing.xs,
        zIndex: 2,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 4, // Match home screen badge radius
        gap: 4,
    },
    verifiedBadge: {
        backgroundColor: colors.success,
    },
    featuredBadge: {
        backgroundColor: '#FFEA00',
    },
    saleBadge: {
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    badgeText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: '800',
    },
    favoriteButton: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.small,
    },
    content: {
        padding: spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.dark,
        flex: 1,
        marginRight: spacing.sm,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    ratingText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.dark,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: spacing.md,
    },
    locationText: {
        fontSize: 13,
        color: '#7C7C7C',
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
        fontWeight: '700',
        color: colors.primary,
    },
    priceLabelText: {
        fontSize: 14,
        color: '#7C7C7C',
    },
    actionButton: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.large,
    },
    bookButton: {
        backgroundColor: '#E6F3F7',
    },
    contactButton: {
        backgroundColor: colors.primary,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
    bookButtonText: {
        color: colors.primary,
    },
    contactButtonText: {
        color: colors.white,
    },
});
