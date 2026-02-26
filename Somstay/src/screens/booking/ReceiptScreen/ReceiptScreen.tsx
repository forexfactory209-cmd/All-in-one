import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from './ReceiptScreen.styles';

export const ReceiptScreen = () => {
    const router = useRouter();
    const onShare = async () => {
        try {
            await Share.share({
                message: 'SomStay Receipt #INV-2024-001 - Total Paid $375.00',
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Custom Header */}
            <View style={styles.screenHeader}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="chevron-back" size={24} color="#1A1A1A" />
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
                                <Text style={styles.contactText}>same servor / Hargeisa, Somaliland</Text>
                            </View>
                            <View style={styles.contactItem}>
                                <Ionicons name="call-outline" size={14} color="#666" />
                                <Text style={styles.contactText}>+252 63 XXXXXXX</Text>
                            </View>
                            <View style={styles.contactItem}>
                                <Ionicons name="mail-outline" size={14} color="#666" />
                                <Text style={styles.contactText}>contact@somalihome.com</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.invoiceInfo}>
                        <View style={styles.statusBadge}>
                            <Text style={styles.statusText}>PAID</Text>
                        </View>
                        <Text style={styles.invoiceLabel}>Invoice Number</Text>
                        <Text style={styles.invoiceNumber}>#INV-2024-001</Text>
                        <Text style={styles.invoiceLabel}>Issue Date</Text>
                        <Text style={styles.issueDate}>Oct 15, 2024</Text>
                    </View>
                </View>

                {/* Guest Information */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="person-outline" size={16} color="#999" />
                        <Text style={styles.sectionLabel}>Guest Information</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>Hassan Ali</Text>
                        <Text style={styles.infoSubtitle}>+252 63 4441234</Text>
                    </View>
                </View>

                {/* Booking Reference */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="document-text-outline" size={16} color="#999" />
                        <Text style={styles.sectionLabel}>Booking Reference</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>#BK-9281</Text>
                        <Text style={styles.infoSubtitle}>Reserved via SomaliHome App</Text>
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
                                <Text style={styles.detailLabel}>Property</Text>
                                <Text style={styles.detailValue}>Ocean View Villa</Text>
                                <Text style={styles.detailSubValue}>Berbera, Somaliland</Text>
                            </View>

                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Guests</Text>
                                <Text style={styles.detailValueBlack}>2 Guests</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={styles.detailItem}>
                                    <Text style={styles.detailLabel}>Check-in</Text>
                                    <Text style={styles.detailValueBlack}>Oct 12, 2024</Text>
                                </View>
                                <View style={[styles.detailItem, { alignItems: 'flex-end' }]}>
                                    <Text style={styles.detailLabel}>Check-out</Text>
                                    <Text style={styles.detailValueBlack}>Oct 15, 2024</Text>
                                </View>
                            </View>

                            <View style={styles.detailItem}>
                                <Text style={styles.detailLabel}>Duration</Text>
                                <Text style={styles.detailValueBlack}>3 Nights</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Payment Summary */}
                <View style={styles.paymentSummary}>
                    <Text style={styles.sectionLabel}>Payment Summary</Text>

                    <View style={styles.summaryRow}>
                        <View>
                            <Text style={styles.summaryLabel}>Nightly Rate</Text>
                            <Text style={styles.summarySubLabel}>$120.00 x 3 nights</Text>
                        </View>
                        <Text style={styles.summaryValue}>$360.00</Text>
                    </View>

                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Service Fee</Text>
                        <Text style={styles.summaryValue}>$15.00</Text>
                    </View>

                    <View style={styles.totalCard}>
                        <Text style={styles.totalLabel}>Total Amount Paid</Text>
                        <Text style={styles.totalValue}>$375.00</Text>
                    </View>
                </View>

                {/* Payment Method Footer */}
                <View style={{ marginTop: 20, gap: 12 }}>
                    <View style={[styles.infoCard, { flexDirection: 'row', alignItems: 'center', gap: 16 }]}>
                        <View style={{ backgroundColor: '#FFF', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#EEE' }}>
                            <Ionicons name="wallet-outline" size={20} color="#0288AC" />
                        </View>
                        <View>
                            <Text style={styles.detailLabel}>Payment Method</Text>
                            <Text style={styles.detailValueBlack}>ZAAD Mobile</Text>
                        </View>
                    </View>

                    <View style={[styles.infoCard, { flexDirection: 'row', alignItems: 'center', gap: 16 }]}>
                        <View style={{ backgroundColor: '#FFF', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#EEE' }}>
                            <Ionicons name="receipt-outline" size={20} color="#0288AC" />
                        </View>
                        <View>
                            <Text style={styles.detailLabel}>Reference #</Text>
                            <Text style={styles.detailValueBlack}>#ZAD-88219</Text>
                        </View>
                    </View>
                </View>

                {/* Footer Thanks */}
                <View style={styles.footer}>
                    <Text style={styles.thanksText}>Thank you for choosing Somstay!</Text>
                    <Text style={styles.importantInfo}>Important Information</Text>
                    <Text style={styles.disclaimer}>
                        This is a system-generated receipt. Full refund available for cancellations made at least 48 hours prior to check-in. Service fees are non-refundable after check-in.
                    </Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.8}>
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
