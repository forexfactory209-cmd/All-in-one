import React from 'react';
import { View, Text, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from './PaymentSuccessScreen.styles';
import { colors } from '@/src/theme';

export const PaymentSuccessScreen: React.FC = () => {
    const router = useRouter();

    const handleViewBooking = () => {
        router.push('/bookings');
    };

    const handleGoHome = () => {
        router.replace('/');
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
                        Your journey begins soon. Your flight and hotel bookings are confirmed.
                    </Text>

                    {/* Information Card */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.bookingIdContainer}>
                                <View style={styles.iconBox}>
                                    <MaterialCommunityIcons name="ticket-percent" size={24} color={colors.primary} />
                                </View>
                                <View>
                                    <Text style={styles.label}>BOOKING ID</Text>
                                    <Text style={styles.bookingId}>#BOK-98231</Text>
                                </View>
                            </View>
                            <View style={styles.amountContainer}>
                                <Text style={styles.label}>TOTAL PAID</Text>
                                <Text style={styles.amount}>$1,240.00</Text>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.detailsRow}>
                            <Ionicons name="airplane" size={18} color="#9BA3A3" />
                            <Text style={styles.detailsText}>Hargisa (CDG) • 2 Travelers</Text>
                        </View>
                    </View>
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
                        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/receipt')}>
                            <MaterialCommunityIcons name="file-document-outline" size={20} color={colors.dark} />
                            <Text style={styles.secondaryButtonText}>Receipt</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
};
