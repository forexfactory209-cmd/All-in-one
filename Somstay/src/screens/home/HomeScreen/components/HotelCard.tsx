import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons as Icon } from '@expo/vector-icons';
import { PropertyResponse } from '@/src/services/property/propertyService.types';
import { styles } from './HotelCard.styles';
import { useApp, useTheme } from '@/src/context/AppContext';
import { colors } from '@/src/theme';

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
    const { t, settings } = useApp();
    const theme = useTheme();

    const imageUri = hotel.photos?.[0]?.photo_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=70';

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}
            onPress={onPress}
            activeOpacity={0.88}
        >
            <View style={styles.innerClip}>
                <Image
                    source={{ uri: imageUri }}
                    style={[styles.image, { backgroundColor: theme.surfaceSecondary }]}
                    resizeMode="cover"
                />

                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={styles.imageOverlay}
                />

                <View style={[styles.featuredBadge, { backgroundColor: '#FFD700' }]}>
                    <Icon name="flash" size={8} color="#1A1A1A" />
                    <Text style={[styles.featuredText, { color: '#1A1A1A' }]}>{settings.language === 'so' ? 'MUDAN' : 'FEATURED'}</Text>
                </View>

                <TouchableOpacity
                    style={[styles.favoriteButton, { backgroundColor: theme.card + 'CC' }]}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    onPress={(e) => {
                        e.stopPropagation();
                        onToggleWishlist?.();
                    }}
                >
                    <Icon
                        name={isWishlisted ? "heart" : "heart-outline"}
                        size={15}
                        color={isWishlisted ? (theme.error || '#FE3335') : theme.textSecondary}
                    />
                </TouchableOpacity>

                {typeof hotel.average_rating === 'number' && (
                    <View style={[styles.ratingOverlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                        <Icon name="star" size={10} color="#FFD700" />
                        <Text style={styles.ratingOverlayText}>
                            {Number(hotel.average_rating || 0).toFixed(1)}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.infoContainer}>
                <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
                    {hotel.title}
                </Text>

                {(hotel as any).hotel_name && (
                    <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 2 }} numberOfLines={1}>
                        at {(hotel as any).hotel_name}
                    </Text>
                )}

                <View style={styles.locationRow}>
                    <Icon name="location-outline" size={11} color={theme.primary} />
                    <Text style={[styles.location, { color: theme.textSecondary }]} numberOfLines={1}>
                        {[hotel.city, hotel.country].filter(Boolean).join(', ')}
                    </Text>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.border }]} />

                <View style={styles.priceRow}>
                    <View style={styles.priceWrap}>
                        <Text style={[styles.currency, { color: theme.primary }]}>$</Text>
                        <Text style={[styles.price, { color: theme.text }]}>
                            {hotel.price_per_night}
                        </Text>
                        <Text style={[styles.priceLabel, { color: theme.textSecondary }]}>/{t('night')}</Text>
                    </View>

                    <View style={[styles.verifiedBadge, { backgroundColor: theme.success + '15' }]}>
                        <Icon name="checkmark-circle" size={11} color={theme.success} />
                        <Text style={[styles.verifiedText, { color: theme.success }]}>{settings.language === 'so' ? 'LA XAQIIJIYAY' : 'VERIFIED'}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
});

HotelCard.displayName = 'HotelCard';

HotelCard.displayName = 'HotelCard';
