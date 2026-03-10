import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, Share, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, colors } from '@/src/theme';
import { useApp, useTheme } from '@/src/context/AppContext';

// Hooks & Styles
import { useCarDetails } from './hooks/useCarDetails';
import { styles } from './styles/CarRentalDetailScreen.styles';

// Components
import { CarHeader } from './components/CarHeader';
import { CarSpecs } from './components/CarSpecs';
import { RentalTerms } from './components/RentalTerms';

import { SafeAreaView } from 'react-native-safe-area-context';

export const CarRentalDetailScreen: React.FC = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { settings } = useApp();
    const theme = useTheme();
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
            <SafeAreaView style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
                <ActivityIndicator size="large" color={theme.primary} />
            </SafeAreaView>
        );
    }

    if (error || !car) {
        return (
            <SafeAreaView style={[styles.errorContainer, { backgroundColor: theme.background }]}>
                <Ionicons name="alert-circle-outline" size={64} color={theme.primary} />
                <Text style={[styles.errorText, { color: theme.textSecondary }]}>{error || 'Car not found.'}</Text>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.bookButton, { backgroundColor: theme.primary }]}
                >
                    <Text style={styles.bookButtonText}>Return to Services</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={settings.darkMode ? 'light-content' : 'dark-content'} translucent backgroundColor="transparent" />

            <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
                <CarHeader
                    image={car.main_image}
                    onShare={handleShare}
                    isFavorite={isFavorite}
                    onToggleFavorite={() => setIsFavorite(!isFavorite)}
                />

                <View style={[styles.content, { backgroundColor: theme.background }]}>
                    <View style={[styles.badge, { backgroundColor: theme.primary + '15' }]}>
                        <Text style={[styles.badgeText, { color: theme.primary }]}>Verified Vehicle</Text>
                    </View>

                    <View style={styles.titleRow}>
                        <View style={{ flex: 1, paddingRight: spacing.md }}>
                            <Text style={[styles.title, { color: theme.text }]} numberOfLines={2} adjustsFontSizeToFit>
                                {car.make} {car.model}
                            </Text>
                            <View style={styles.locationRow}>
                                <Ionicons name="location-sharp" size={16} color={theme.primary} />
                                <Text style={[styles.locationText, { color: theme.textSecondary }]}>{car.location} • {car.year}</Text>
                            </View>
                        </View>
                        <View style={[styles.priceTag, { backgroundColor: theme.primary }]}>
                            <Text style={[styles.priceLabel, { color: colors.white }]}>Daily Rate</Text>
                            <Text style={[styles.priceText, { color: colors.white }]} adjustsFontSizeToFit numberOfLines={1}>${car.price_per_day}.00</Text>
                        </View>
                    </View>

                    <CarSpecs
                        seats={car.seats}
                        doors={car.doors}
                        transmission={car.transmission}
                        rating={car.rating}
                    />

                    {/* Owner Info Section */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Vehicle Owner Info</Text>
                        <View style={[styles.ownerCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                            <View style={[styles.ownerAvatar, { backgroundColor: theme.surfaceSecondary }]}>
                                <Ionicons name="person" size={24} color={theme.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.ownerName, { color: theme.text }]}>{car.owner_name || 'Verified Landlord'}</Text>
                                <Text style={[styles.ownerSub, { color: theme.textSecondary }]}>Private Car Hire • Trusted Partner</Text>
                            </View>
                            <TouchableOpacity style={[styles.contactBtn, { backgroundColor: theme.primary }]}>
                                <Ionicons name="chatbubbles-outline" size={20} color={colors.white} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Overview</Text>
                            <TouchableOpacity>
                                <Text style={{ color: theme.primary, fontWeight: '700' }}>Full Specs</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.description, { color: theme.textSecondary }]}>
                            {car.description || `Experience high-performance Luxury and premium safety with the ${car.year} ${car.make} ${car.model}. This vehicle is meticulously maintained and equipped for long journeys and professional transport alike.`}
                        </Text>
                    </View>

                    {/* Gallery Section */}
                    {car.images && car.images.length > 0 && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>Gallery</Text>
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={[styles.galleryContainer, { marginTop: 12 }]}
                            >
                                {car.images.map((img: string, index: number) => (
                                    <View key={index} style={{ marginRight: 12 }}>
                                        <Image source={{ uri: img }} style={[styles.galleryImage, { borderColor: theme.border }]} />
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    <RentalTerms />

                    {/* Safety Callout */}
                    <View style={{
                        backgroundColor: theme.primary + '10',
                        padding: 24,
                        borderRadius: 32,
                        marginBottom: 40,
                        borderWidth: 1,
                        borderColor: theme.primary + '20',
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 }}>
                            <Ionicons name="shield-checkmark" size={28} color={theme.primary} />
                            <Text style={[styles.sectionTitle, { fontSize: 18, color: theme.primary }]}>Premium Safety</Text>
                        </View>
                        <Text style={[styles.description, { color: theme.primary, opacity: 0.9 }]}>
                            Every Somstay ride includes 24/7 roadside assistance and a comprehensive 52-point multi-inspection before your rental starts.
                        </Text>
                    </View>

                    <View style={{ height: 60 }} />
                </View>
            </ScrollView>

            <View style={[styles.bottomBar, { backgroundColor: theme.card, paddingBottom: Math.max(insets.bottom, 20) }]}>
                <View style={styles.totalInfo}>
                    <Text style={[styles.totalLabel, { color: theme.textSecondary }]}>Grand Total / Day</Text>
                    <Text style={[styles.totalPrice, { color: theme.text }]}>${car.price_per_day}.00</Text>
                </View>
                <TouchableOpacity
                    style={[styles.bookButton, { backgroundColor: theme.primary }]}
                    onPress={() => router.push({ pathname: '/car/book', params: { car_id: id, price: car.price_per_day } } as any)}
                    activeOpacity={0.9}
                >
                    <Text style={styles.bookButtonText}>Reserve Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};
