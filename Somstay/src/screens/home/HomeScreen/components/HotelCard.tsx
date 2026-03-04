import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons as Icon } from '@expo/vector-icons';
import { PropertyResponse } from '@/src/services/property/propertyService.types';
import { styles } from './HotelCard.styles';

interface HotelCardProps {
    hotel: PropertyResponse;
    onPress: () => void;
    isWishlisted?: boolean;
    onToggleWishlist?: () => void;
}

export const HotelCard: React.FC<HotelCardProps> = memo(({
    hotel,
    onPress,
    isWishlisted = false,
    onToggleWishlist
}) => {
    const imageUri = hotel.photos?.[0]?.photo_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=70';

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.88}
        >
            {/* Inner clip for image rounded corners */}
            <View style={styles.innerClip}>

                {/* Hotel Image */}
                <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                    resizeMode="cover"
                />

                {/* Gradient overlay at bottom of image for legibility */}
                <LinearGradient
                    colors={['transparent', 'rgba(4,37,46,0.58)']}
                    style={styles.imageOverlay}
                />

                {/* FEATURED badge — top left */}
                <View style={styles.featuredBadge}>
                    <Icon name="flash" size={8} color="#1A1A1A" />
                    <Text style={styles.featuredText}>FEATURED</Text>
                </View>

                {/* Favourite — top right */}
                <TouchableOpacity
                    style={styles.favoriteButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    onPress={(e) => {
                        e.stopPropagation();
                        onToggleWishlist?.();
                    }}
                >
                    <Icon
                        name={isWishlisted ? "heart" : "heart-outline"}
                        size={15}
                        color={isWishlisted ? "#FE3335" : "#FE3335"}
                    />
                </TouchableOpacity>

                {/* Rating chip — bottom right of image */}
                {hotel.average_rating != null && (
                    <View style={styles.ratingOverlay}>
                        <Icon name="star" size={10} color="#FFD700" />
                        <Text style={styles.ratingOverlayText}>
                            {hotel.average_rating.toFixed(1)}
                        </Text>
                    </View>
                )}

            </View>

            {/* Info body */}
            <View style={styles.infoContainer}>

                {/* Hotel name */}
                <Text style={styles.title} numberOfLines={1}>
                    {hotel.title}
                </Text>

                {/* Location */}
                <View style={styles.locationRow}>
                    <Icon name="location-outline" size={11} color="#0288AC" />
                    <Text style={styles.location} numberOfLines={1}>
                        {[hotel.city, hotel.country].filter(Boolean).join(', ')}
                    </Text>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Price + Verified */}
                <View style={styles.priceRow}>
                    <View style={styles.priceWrap}>
                        <Text style={styles.currency}>$</Text>
                        <Text style={styles.price}>
                            {hotel.price_per_night}
                        </Text>
                        <Text style={styles.priceLabel}>/night</Text>
                    </View>

                    <View style={styles.verifiedBadge}>
                        <Icon name="checkmark-circle" size={11} color="#06A649" />
                        <Text style={styles.verifiedText}>VERIFIED</Text>
                    </View>
                </View>

            </View>
        </TouchableOpacity>
    );
});

HotelCard.displayName = 'HotelCard';
