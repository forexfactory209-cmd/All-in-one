import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { PropertyResponse } from '@/src/services/property/propertyService.types';
import { styles } from './HotelCard.styles';

interface HotelCardProps {
    hotel: PropertyResponse;
    onPress: () => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({
    hotel,
    onPress,
}) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            {/* Hotel Image */}
            <Image
                source={{ uri: hotel.photos?.[0]?.photo_url || 'https://via.placeholder.com/280x180' }}
                style={styles.image}
                resizeMode="cover"
            />

            {/* Featured Badge */}
            <View style={styles.featuredBadge}>
                <Text style={styles.featuredText}>FEATURED</Text>
            </View>

            {/* Favorite Button */}
            <TouchableOpacity style={styles.favoriteButton}>
                <Icon name="heart-outline" size={20} color="#FE3335" />
            </TouchableOpacity>

            {/* Hotel Info */}
            <View style={styles.infoContainer}>
                <View style={styles.titleRow}>
                    <Text style={styles.title} numberOfLines={1}>
                        {hotel.title}
                    </Text>
                    <View style={styles.verifiedBadge}>
                        <Icon name="checkmark-circle" size={16} color="#06A649" />
                        <Text style={styles.verifiedText}>VERIFIED</Text>
                    </View>
                </View>

                <View style={styles.locationRow}>
                    <Icon name="location-outline" size={14} color="#666" />
                    <Text style={styles.location} numberOfLines={1}>
                        {hotel.city}, {hotel.country}
                    </Text>
                </View>

                <View style={styles.priceRow}>
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>${hotel.price_per_night}</Text>
                        <Text style={styles.priceLabel}>/night</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                        <Icon name="star" size={16} color="#FFD700" />
                        <Text style={styles.rating}>{hotel.average_rating?.toFixed(1)}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};
