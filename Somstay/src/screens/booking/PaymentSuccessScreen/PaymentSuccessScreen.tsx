import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles } from './PaymentSuccessScreen.styles';
import { colors } from '@/src/theme';

export const PaymentSuccessScreen: React.FC = () => {
    const router = useRouter();
    const { bookingId, title, checkIn, checkOut, totalPrice, guests, type } = useLocalSearchParams();
    const guestInfo = guests || '2 Travelers';

    const handleViewBooking = () => {
        router.push('/bookings');
    };

    const handleGoHome = () => {
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Success Icon */}
                    <View style={styles.successIconWrapper}>
                        <View style={styles.outerCircle}>
                            <View style={styles.innerCircle}>
                                <Ionicons name="checkmark" size={40} color={colors.success} />
                            </View>
                        </View>
                    </View>

                    {/* Titles */}
                    <Text style={styles.title}>Payment Successful!</Text>
                    <Text style={styles.description}>
                        Your journey begins soon. Your {type === 'Room' ? 'hotel room' : 'property'} booking is confirmed.
                    </Text>

                    {/* Information Card */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.bookingIdContainer}>
                                <View style={styles.iconBox}>
                                    <MaterialCommunityIcons name="ticket-confirmation-outline" size={24} color={colors.primary} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.label}>BOOKING ID</Text>
                                    <Text style={styles.bookingId} numberOfLines={1}>#BOK-{bookingId || '16'}</Text>
                                </View>
                            </View>
                            <View style={styles.amountContainer}>
                                <Text style={styles.label}>TOTAL PAID</Text>
                                <Text style={styles.amount}>${totalPrice || '150.00'}</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailsSection}>
                            <View style={styles.detailItem}>
                                <Ionicons name="business-outline" size={18} color={colors.primary} />
                                <Text style={styles.detailsText} numberOfLines={1}>{title || 'Hargeisa Heights'}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Ionicons name="calendar-outline" size={18} color="#9BA3A3" />
                                <Text style={styles.detailsText}>{checkIn && checkOut ? `${checkIn} - ${checkOut}` : 'Oct 12 - Oct 14, 2023'}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Ionicons name="people-outline" size={18} color="#9BA3A3" />
                                <Text style={styles.detailsText}>{guestInfo}</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={styles.helperText}>
                        A confirmation text and notification has been sent to your registered account.
                    </Text>
                </ScrollView>

                {/* Footer Actions */}
                <View style={styles.footerContainer}>
                    <TouchableOpacity style={styles.primaryButton} onPress={handleViewBooking}>
                        <Text style={styles.primaryButtonText}>View Booking</Text>
                        <Ionicons name="arrow-forward" size={20} color={colors.white} />
                    </TouchableOpacity>

                    <View style={styles.secondaryActions}>
                        <TouchableOpacity style={styles.secondaryButton} onPress={handleGoHome}>
                            <Ionicons name="home-outline" size={20} color={colors.dark} />
                            <Text style={styles.secondaryButtonText}>Home</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push({ pathname: '/receipt', params: { bookingId } })}>
                            <MaterialCommunityIcons name="file-document-outline" size={20} color={colors.dark} />
                            <Text style={styles.secondaryButtonText}>Receipt</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};
