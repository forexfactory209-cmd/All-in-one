import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles } from './ReceiptScreen.styles';
import BookingService from '@/src/services/booking/bookingService';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export const ReceiptScreen = () => {
    const router = useRouter();
    const { bookingId } = useLocalSearchParams();
    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            if (!bookingId) return;
            try {
                setLoading(true);
                const data = await BookingService.getBookingById(bookingId as string);
                setBooking(data);
            } catch (error) {
                console.error('Error fetching booking for receipt:', error);
                Alert.alert('Error', 'Failed to load receipt details');
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId]);

    const onShare = async () => {
        if (!booking) return;
        try {
            await Share.share({
                message: `SomStay Receipt #${bookingId} - Total Paid $${booking.total_price}`,
            });
        } catch (error: any) {
            console.log(error.message);
        }
    };

    const handleDownloadPDF = async () => {
        if (!booking) return;
        try {
            const html = `
                <html>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
                        <style>
                            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
                            h1 { color: #0288AC; }
                            .header { border-bottom: 2px solid #EEE; padding-bottom: 15px; margin-bottom: 20px; }
                            .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                            .label { font-weight: bold; color: #666; width: 150px; }
                            .value { color: #000; }
                            .total { font-size: 24px; font-weight: bold; color: #0288AC; margin-top: 20px; }
                            .footer { margin-top: 40px; font-size: 12px; color: #999; text-align: center; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>SomStay - Booking Receipt</h1>
                            <p>Premium Vacation Rentals in Somaliland</p>
                        </div>
                        
                        <div class="subtitle" style="font-size: 18px; margin-bottom: 15px; border-bottom: 1px solid #EEE; padding-bottom: 5px;">Receipt #${booking.id}</div>
                        
                        <div class="row">
                            <span class="label">Date Issued:</span>
                            <span class="value">${new Date().toLocaleDateString()}</span>
                        </div>
                        <div class="row">
                            <span class="label">Status:</span>
                            <span class="value">${booking.payment_status?.toUpperCase() || 'PAID'}</span>
                        </div>
                        
                        <div class="subtitle" style="font-size: 18px; margin-bottom: 15px; margin-top: 30px; border-bottom: 1px solid #EEE; padding-bottom: 5px;">Guest Information</div>
                        <div class="row">
                            <span class="label">Name:</span>
                            <span class="value">${booking.guest_name || 'Valued Guest'}</span>
                        </div>
                        <div class="row">
                            <span class="label">Contact:</span>
                            <span class="value">${booking.guest_phone || booking.guest_email || 'N/A'}</span>
                        </div>
                        
                <div class="subtitle" style="font-size: 18px; margin-bottom: 15px; margin-top: 30px; border-bottom: 1px solid #EEE; padding-bottom: 5px;">Stay Details</div>
                <div class="row">
                    <span class="label">Property/Hotel:</span>
                    <span class="value">${booking.entity_name || 'Somstay Property'}</span>
                </div>
                ${booking.unit_number ? `
                <div class="row">
                    <span class="label">Unit/Room:</span>
                    <span class="value">${booking.unit_type ? booking.unit_type + ' - ' : ''}#${booking.unit_number}</span>
                </div>` : ''}
                <div class="row">
                    <span class="label">Location:</span>
                    <span class="value">${booking.location || 'Somaliland'}</span>
                </div>
                <div class="row">
                    <span class="label">Check-in:</span>
                    <span class="value">${new Date(booking.check_in).toLocaleDateString()}</span>
                </div>
                <div class="row">
                    <span class="label">Check-out:</span>
                    <span class="value">${new Date(booking.check_out).toLocaleDateString()}</span>
                </div>

                <div class="row" style="margin-top: 30px;">
                    <span class="label" style="font-size: 20px;">Total Paid:</span>
                    <span class="total">$${booking.total_price}</span>
                </div>

                        <div class="footer">
                            <p>Thank you for choosing SomStay!</p>
                            <p>Contact us at support@somstay.com for any inquiries.</p>
                        </div>
                    </body>
                </html>
            `;
            const { uri } = await Print.printToFileAsync({ html });
            
            if (Platform.OS === 'ios') {
                await Sharing.shareAsync(uri);
            } else {
                // On Android, Sharing might require additional configurations, so use default sharing
                await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
            Alert.alert('Error', 'Failed to generate PDF');
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#0288AC" />
            </View>
        );
    }

    if (!booking) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Booking not found</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Custom Header */}
            <View style={styles.screenHeader}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.replace('/(tabs)')}
                    activeOpacity={0.7}
                >
                    <Ionicons name="close" size={24} color="#1A1A1A" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Receipt</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <View style={{ backgroundColor: '#0288AC', padding: 6, borderRadius: 8 }}>
                                <MaterialCommunityIcons name="home-city" size={24} color="white" />
                            </View>
                            <View>
                                <Text style={styles.brandName}>SomStay</Text>
                                <Text style={styles.brandSubtitle}>PREMIUM VACATION RENTALS</Text>
                            </View>
                        </View>

                        <View style={styles.contactInfo}>
                            <View style={styles.contactItem}>
                                <Ionicons name="location-outline" size={14} color="#666" />
                                <Text style={styles.contactText}>Hargeisa, Somaliland</Text>
                            </View>
                            <View style={styles.contactItem}>
                                <Ionicons name="mail-outline" size={14} color="#666" />
                                <Text style={styles.contactText}>support@somstay.com</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.invoiceInfo}>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>{booking.payment_status?.toUpperCase() || 'PAID'}</Text>
                        </View>
                        <Text style={styles.invoiceLabel}>Booking ID</Text>
                        <Text style={styles.invoiceNumber}>#{booking.id}</Text>
                        <Text style={styles.invoiceLabel}>Booking Date</Text>
                        <Text style={styles.issueDate}>{new Date(booking.created_at).toLocaleDateString()}</Text>
                    </View>
                </View>

                {/* Guest Information */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="person-outline" size={16} color="#999" />
                        <Text style={styles.sectionLabel}>Guest Information</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>{booking.guest_name || 'Guest User'}</Text>
                        <Text style={styles.infoSubtitle}>{booking.guest_phone || booking.guest_email || 'No contact provided'}</Text>
                    </View>
                </View>

                {/* Stay Details Block */}
                <View style={styles.section}>
                    <View style={styles.stayDetailsCard}>
                        <View style={styles.stayDetailsHeader}>
                            <Ionicons name="bed-outline" size={20} color="#0288AC" />
                            <Text style={styles.stayDetailsHeaderText}>Stay Details</Text>
                        </View>

                        <View style={styles.stayDetailsContent}>
                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>{booking.entity_type === 'Property' ? 'Vacation Rental' : 'Hotel Room'}</Text>
                                <Text style={styles.detailValue}>{booking.entity_name || 'Somstay Property'}</Text>
                                {booking.unit_number && (
                                    <Text style={[styles.detailSubValue, { color: '#000', marginTop: 2 }]}>
                                        Unit {booking.unit_number} {booking.unit_type ? `(${booking.unit_type})` : ''}
                                    </Text>
                                )}
                                <Text style={styles.detailSubValue}>{booking.location || 'Somaliland'}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Check-in</Text>
                                    <Text style={styles.detailValueBlack}>{new Date(booking.check_in).toLocaleDateString()}</Text>
                                </View>
                                <View style={[styles.detailItem, { alignItems: 'flex-end' }]}>
                                    <Text style={styles.detailLabel}>Check-out</Text>
                                    <Text style={styles.detailValueBlack}>{new Date(booking.check_out).toLocaleDateString()}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Payment Summary */}
                <View style={styles.paymentSummary}>
                    <Text style={styles.sectionLabel}>Payment Summary</Text>

                    <View style={styles.totalCard}>
                        <Text style={styles.totalLabel}>Total Amount Paid</Text>
                        <Text style={styles.totalValue}>${booking.total_price}</Text>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.downloadBtn} onPress={handleDownloadPDF} activeOpacity={0.8}>
                        <Ionicons name="download-outline" size={20} color="white" />
                        <Text style={styles.downloadBtnText}>Download PDF</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shareBtn} onPress={onShare} activeOpacity={0.8}>
                        <Ionicons name="share-outline" size={20} color="#1A1A1A" />
                        <Text style={styles.shareBtnText}>Share Receipt</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

export default ReceiptScreen;
