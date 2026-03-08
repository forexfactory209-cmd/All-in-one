import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, Share, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/src/theme';

// Hooks & Styles
import { useCarDetails } from './hooks/useCarDetails';
import { styles } from './styles/CarRentalDetailScreen.styles';

// Components
import { CarHeader } from './components/CarHeader';
import { CarSpecs } from './components/CarSpecs';
import { RentalTerms } from './components/RentalTerms';

export const CarRentalDetailScreen: React.FC = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { car, loading, error } = useCarDetails(id as string);
    const [isFavorite, setIsFavorite] = useState(false);

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out this ${car?.year} ${car?.make} ${car?.model} on Somstay!`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (error || !car) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
                <Text style={styles.errorText}>{error || 'Car not found.'}</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.bookButton}>
                    <Text style={styles.bookButtonText}>Return to Services</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" translucent backgroundColor="transparent" />
            
            <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
                <CarHeader 
                    image={car.main_image} 
                    onShare={handleShare}
                    isFavorite={isFavorite}
                    onToggleFavorite={() => setIsFavorite(!isFavorite)}
                />

                <View style={styles.content}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Verified Vehicle</Text>
                    </View>

                    <View style={styles.titleRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.title} numberOfLines={2}>
                                {car.make} {car.model}
                            </Text>
                            <View style={[styles.locationRow, { marginTop: 4 }]}>
                                <Ionicons name="location-outline" size={16} color={colors.secondaryText} />
                                <Text style={styles.locationText}>{car.location} • {car.year}</Text>
                            </View>
                        </View>
                        <View style={styles.priceTag}>
                           <Text style={styles.priceLabel}>Daily Rate</Text>
                            <Text style={styles.priceText}>${car.price_per_day}</Text>
                        </View>
                    </View>

                    <CarSpecs 
                        seats={car.seats} 
                        doors={car.doors} 
                        transmission={car.transmission} 
                        rating={car.rating} 
                    />

                    {/* Highly Stylish Owner Info Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Vehicle Owner Info</Text>
                        <View style={styles.ownerCard}>
                            <View style={styles.ownerAvatar}>
                                <Ionicons name="person" size={24} color={colors.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.ownerName}>{car.owner_name || 'Verified Landlord'}</Text>
                                <Text style={styles.ownerSub}>Private Car Hire • Trusted Partner</Text>
                            </View>
                            <TouchableOpacity style={styles.contactBtn}>
                                <Ionicons name="chatbubbles-outline" size={20} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Overview</Text>
                            <TouchableOpacity>
                                <Text style={{ color: colors.primary, fontWeight: '700' }}>Full Specs</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.description}>
                            {car.description || `Experience high-performance Luxury and premium safety with the ${car.year} ${car.make} ${car.model}. This vehicle is meticulously maintained and equipped for long journeys and professional transport alike.`}
                        </Text>
                    </View>

                    {/* Gallery Section */}
                    {car.images && car.images.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Gallery</Text>
                            <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={false} 
                                style={[styles.galleryContainer, { marginTop: 12 }]}
                            >
                                {car.images.map((img: string, index: number) => (
                                    <Image key={index} source={{ uri: img }} style={styles.galleryImage} />
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    <RentalTerms />

                    {/* Highly Stylish Safety Callout */}
                    <View style={{
                        backgroundColor: colors.primary + '10',
                        padding: 24,
                        borderRadius: 32,
                        marginBottom: 40,
                        borderWidth: 1,
                        borderColor: colors.primary + '20',
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 }}>
                            <Ionicons name="shield-checkmark" size={28} color={colors.primary} />
                            <Text style={[styles.sectionTitle, { fontSize: 18, color: colors.primary }]}>Premium Safety</Text>
                        </View>
                        <Text style={[styles.description, { color: colors.primary, opacity: 0.9 }]}>
                           Every Somstay ride includes 24/7 roadside assistance and a comprehensive 52-point multi-inspection before your rental starts.
                        </Text>
                    </View>

                    <View style={{ height: 60 }} />
                </View>
            </ScrollView>

            <View style={styles.bottomBar}>
                <View style={styles.totalInfo}>
                    <Text style={styles.totalLabel}>Grand Total / Day</Text>
                    <Text style={styles.totalPrice}>${car.price_per_day}.00</Text>
                </View>
                <TouchableOpacity 
                    style={styles.bookButton}
                    onPress={() => router.push({ pathname: '/car/book', params: { car_id: id, price: car.price_per_day } } as any)}
                    activeOpacity={0.9}
                >
                    <Text style={styles.bookButtonText}>Reserve Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
