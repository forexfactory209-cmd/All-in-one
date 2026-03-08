import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '@/src/theme';

export interface TravelService {
    id: string;
    title: string;
    provider: string;
    rating: number;
    reviews: number;
    price: string;
    priceLabel: string;
    image: string;
    badge: string;
    features: string[];
    type?: 'car' | 'tour' | 'airport' | 'intercity';
}

interface TravelServicesCardProps {
    service: TravelService;
}

export const TravelServicesCard: React.FC<TravelServicesCardProps> = ({ service }) => {
    const router = useRouter();

    const handlePress = () => {
        if (service.type === 'car' || service.type === 'airport' || service.type === 'intercity') {
             router.push({ pathname: '/car/[id]', params: { id: service.id } } as any);
        } else if (service.type === 'tour') {
            console.log('Tours not implemented yet');
        } else {
            // Re-fallback just in case
            const isCarStr = service.badge.toLowerCase() + service.title.toLowerCase();
            if (isCarStr.includes('car') || isCarStr.includes('automatic') || isCarStr.includes('manual')) {
                router.push({ pathname: '/car/[id]', params: { id: service.id } } as any);
            } else {
                console.log('Tours not implemented yet');
            }
        }
    };

    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={handlePress}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: service.image }} style={styles.image} />
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{service.badge.toUpperCase()}</Text>
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{service.title}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>{service.price}</Text>
                        <Text style={styles.priceLabel}>{service.priceLabel}</Text>
                    </View>
                </View>

                <View style={styles.providerRow}>
                    <Text style={styles.providerText}>{service.provider} • </Text>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.ratingText}> {service.rating} ({service.reviews})</Text>
                </View>

                <View style={styles.footerRow}>
                    <View style={styles.featuresContainer}>
                        {service.features.map((feature, index) => (
                            <View key={index} style={styles.featureItem}>
                                <Ionicons
                                    name={feature.toLowerCase().includes('seat') ? "people-outline" : "snow-outline"}
                                    size={14}
                                    color="#999"
                                />
                                <Text style={styles.featureText}>{feature}</Text>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity style={styles.bookButton} onPress={handlePress}>
                        <Text style={styles.bookButtonText}>Book Now</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        borderRadius: borderRadius.large,
        marginHorizontal: spacing.md,
        marginBottom: spacing.lg,
        ...shadows.medium,
        overflow: 'hidden',
    },
    imageContainer: {
        width: '100%',
        height: 180,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    badge: {
        position: 'absolute',
        top: spacing.sm,
        left: spacing.sm,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: colors.primary,
    },
    content: {
        padding: spacing.md,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.dark,
        flex: 1,
        marginRight: spacing.sm,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    priceText: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.primary,
    },
    priceLabel: {
        fontSize: 10,
        color: '#999',
    },
    providerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    providerText: {
        fontSize: 14,
        color: '#7C7C7C',
    },
    ratingText: {
        fontSize: 14,
        color: '#999',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    featuresContainer: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    featureText: {
        fontSize: 12,
        color: '#999',
    },
    bookButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
    },
    bookButtonText: {
        color: colors.white,
        fontSize: 14,
        fontWeight: '700',
    },
});
