import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, StatusBar, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles } from './styles/CheckoutScreen.styles';
import { colors, spacing } from '@/src/theme';
import BookingService from '@/src/services/booking/bookingService';
import PropertyService from '@/src/services/property/propertyService';
import { LoginModal } from '@/src/components/LoginModal/LoginModal';
import { useApp } from '@/src/context/AppContext';

export const CheckoutScreen: React.FC = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(false);

    // Destructure params
    const { id, type, title: paramTitle, image: paramImage, checkIn: paramCheckIn, checkOut: paramCheckOut, price: paramPrice, total_price: paramTotalPrice, adults: paramAdults, children: paramChildren } = params;

    // Local state for real data
    const [bookingDetails, setBookingDetails] = useState({
        title: (paramTitle as string) || '',
        image: (paramImage as string) || '',
        price: parseFloat(String(paramTotalPrice || paramPrice || '0')),
        checkIn: (paramCheckIn as string) || new Date().toISOString().split('T')[0],
        checkOut: (paramCheckOut as string) || new Date(Date.now() + 86400000).toISOString().split('T')[0],
        adults: parseInt(String(paramAdults || '2'), 10),
        children: parseInt(String(paramChildren || '0'), 10)
    });

    useEffect(() => {
        const fetchRealData = async () => {
            if (!id || !type) return;
            
            // If we already have a price > 0 and a title, we might not need to fetch
            // But to be safe and make it a "real data page", let's fetch
            try {
                setFetchingData(true);
                let data;
                if (type === 'property') {
                    data = await PropertyService.getPropertyById(id as string);
                } else if (type === 'room') {
                    data = await PropertyService.getRoomById(id as string);
                }

                if (data) {
                    console.log('DEBUG: Fetched data from API:', JSON.stringify(data, null, 2));
                    setBookingDetails(prev => {
                        const newPrice = parseFloat(data.price || data.price_per_night || prev.price);
                        console.log('DEBUG: Updating bookingDetails price to:', newPrice);
                        return {
                            ...prev,
                            title: data.name || data.title || (data.type ? data.type + ' Room' : prev.title),
                            image: data.main_image || data.image_url || data.image || prev.image,
                            price: newPrice
                        };
                    });
                }
            } catch (error) {
                console.error('Error fetching real booking data:', error);
            } finally {
                setFetchingData(false);
            }
        };

        fetchRealData();
    }, [id, type]);

    const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'card' | 'bank'>('mobile');
    const [phoneNumber, setPhoneNumber] = useState('');

    // Card State
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    // Bank State
    const [selectedBank, setSelectedBank] = useState('Premier Bank');
    const [isBankPickerOpen, setIsBankPickerOpen] = useState(false);

    const formatCardNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        const matched = cleaned.match(/.{1,4}/g);
        return matched ? matched.join(' ') : cleaned;
    };

    // Auth State
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const { user, setReturnUrl } = useApp();
    const isAuthenticated = !!user;

    const bookingTotal = bookingDetails.price;

    console.log('DEBUG: CheckoutScreen Computed total:', {
        rawPrice: paramPrice,
        rawTotalPrice: paramTotalPrice,
        fetchedPrice: bookingDetails.price,
        parsedTotal: bookingTotal
    });

    const processPayment = async () => {
        try {
            setLoading(true);

            if (!user) {
                setReturnUrl('/confirm-pay');
                setIsLoginModalVisible(true);
                setLoading(false);
                return;
            }

            if (bookingTotal <= 0) {
                Alert.alert('Invalid Price', 'The total price must be greater than 0 to proceed with booking.');
                setLoading(false);
                return;
            }

            const bookingData: any = {
                user_id: user.id,
                entity_type: (type?.toString().toLowerCase() === 'property' ? 'Property' : 'Room'),
                entity_id: parseInt(id as string, 10),
                check_in: bookingDetails.checkIn,
                check_out: bookingDetails.checkOut,
                total_price: bookingTotal,
                status: 'Confirmed',
                payment_status: 'Paid'
            };

            console.log('DEBUG: Sending bookingData to API:', JSON.stringify(bookingData, null, 2));

            const response = await BookingService.createBooking(bookingData);

            if (response.success) {
                router.push({
                    pathname: '/payment-success',
                    params: {
                        bookingId: response.data?.id || response.id || 'new',
                        title: bookingDetails.title,
                        checkIn: bookingDetails.checkIn,
                        checkOut: bookingDetails.checkOut,
                        totalPrice: bookingTotal.toFixed(2),
                        guests: `${bookingDetails.adults} Adults, ${bookingDetails.children} Children`,
                        type: type as string
                    }
                });
            } else {
                Alert.alert('Error', response.message || 'Failed to create booking');
            }
        } catch (error: any) {
            console.error('Booking error:', error.message || error);
            const errorMsg = error.response?.data?.message || 'An unexpected error occurred during booking';
            Alert.alert('Error', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmPay = () => {
        processPayment();
    };

    const handleLoginSuccess = () => {
        setIsLoginModalVisible(false);
        // User state is updated in context, so isAuthenticated will become true
        processPayment();
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={colors.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        {fetchingData ? (
                            <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 15 }} />
                        ) : (
                            <Image 
                                source={{ uri: bookingDetails.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80' }} 
                                style={styles.propertyImage} 
                            />
                        )}
                        <View style={styles.propertyInfo}>
                            <Text style={styles.categoryText}>{type === 'property' ? 'VACATION RENTAL' : 'HOTEL ROOM'}</Text>
                            <Text style={styles.propertyTitle}>{bookingDetails.title || `Booking for ${type}`}</Text>
                            <View style={styles.datesRow}>
                                <Ionicons name="calendar-outline" size={14} color="#999" />
                                <Text style={styles.datesText}>{bookingDetails.checkIn} - {bookingDetails.checkOut}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.priceDetails}>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceLabel}>Guests</Text>
                            <Text style={styles.priceValue}>{bookingDetails.adults} Adults, {bookingDetails.children} Children</Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>${bookingTotal.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>

                {/* Payment Method Section */}
                <Text style={styles.sectionTitle}>Payment Method</Text>

                <View style={styles.paymentMethods}>
                    {/* Mobile Money */}
                    <TouchableOpacity
                        style={[styles.methodCard, paymentMethod === 'mobile' && styles.methodCardSelected]}
                        onPress={() => setPaymentMethod('mobile')}
                    >
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="cellphone" size={24} color={colors.primary} />
                        </View>
                        <View style={styles.methodInfo}>
                            <Text style={styles.methodTitle}>Local Mobile Money</Text>
                            <Text style={styles.methodDesc}>ZAAD (Telesom) or e-Dahab (Somtel)</Text>

                            {paymentMethod === 'mobile' && (
                                <View style={styles.mobileInputContainer}>
                                    <Text style={styles.mobilePrompt}>
                                        Enter your mobile number to receive payment prompt
                                    </Text>
                                    <View style={styles.inputRow}>
                                        <View style={styles.prefixContainer}>
                                            <Text style={styles.prefixText}>+252</Text>
                                        </View>
                                        <TextInput
                                            style={styles.phoneInput}
                                            placeholder="63XXXXXXX"
                                            placeholderTextColor="#CCC"
                                            keyboardType="phone-pad"
                                            value={phoneNumber}
                                            onChangeText={setPhoneNumber}
                                        />
                                    </View>
                                    <Text style={styles.inputHint}>ENTER 7 OR 9 DIGITS</Text>
                                </View>
                            )}
                        </View>
                        <View style={[styles.radioCircle, paymentMethod === 'mobile' && styles.radioCircleSelected]}>
                            {paymentMethod === 'mobile' && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>

                    {/* International Card (MasterCard) */}
                    <TouchableOpacity
                        style={[styles.methodCard, paymentMethod === 'card' && styles.methodCardSelected]}
                        onPress={() => setPaymentMethod('card')}
                    >
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="credit-card-outline" size={24} color={paymentMethod === 'card' ? colors.primary : colors.dark} />
                        </View>
                        <View style={styles.methodInfo}>
                            <Text style={styles.methodTitle}>International Card</Text>
                            <Text style={styles.methodDesc}>Visa, Mastercard, AMEX</Text>

                            {paymentMethod === 'card' && (
                                <View style={styles.formContainer}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>CARD NUMBER</Text>
                                        <TextInput
                                            style={styles.baseInput}
                                            placeholder="XXXX XXXX XXXX XXXX"
                                            placeholderTextColor="#CCC"
                                            keyboardType="numeric"
                                            maxLength={19}
                                            value={cardNumber}
                                            onChangeText={(val) => setCardNumber(formatCardNumber(val))}
                                        />
                                    </View>
                                    <View style={styles.inputRow}>
                                        <View style={[styles.inputGroup, { flex: 1 }]}>
                                            <Text style={styles.inputLabel}>EXPIRY DATE</Text>
                                            <TextInput
                                                style={styles.baseInput}
                                                placeholder="MM/YY"
                                                placeholderTextColor="#CCC"
                                                maxLength={5}
                                                value={expiry}
                                                onChangeText={setExpiry}
                                            />
                                        </View>
                                        <View style={[styles.inputGroup, { flex: 1 }]}>
                                            <Text style={styles.inputLabel}>CVC</Text>
                                            <TextInput
                                                style={styles.baseInput}
                                                placeholder="XXX"
                                                placeholderTextColor="#CCC"
                                                keyboardType="numeric"
                                                maxLength={3}
                                                secureTextEntry
                                                value={cvc}
                                                onChangeText={setCvc}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                        <View style={[styles.radioCircle, paymentMethod === 'card' && styles.radioCircleSelected]}>
                            {paymentMethod === 'card' && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>

                    {/* Bank Transfer */}
                    <TouchableOpacity
                        style={[styles.methodCard, paymentMethod === 'bank' && styles.methodCardSelected]}
                        onPress={() => setPaymentMethod('bank')}
                    >
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="bank-outline" size={24} color={paymentMethod === 'bank' ? colors.primary : colors.dark} />
                        </View>
                        <View style={styles.methodInfo}>
                            <Text style={styles.methodTitle}>Bank Transfer</Text>
                            <Text style={styles.methodDesc}>Direct transfer to Premier Bank or Salaam</Text>

                            {paymentMethod === 'bank' && (
                                <View style={styles.formContainer}>
                                    <Text style={styles.mobilePrompt}>Select your preferred bank to view transfer details</Text>
                                    <TouchableOpacity
                                        style={styles.bankSelector}
                                        onPress={() => setIsBankPickerOpen(!isBankPickerOpen)}
                                    >
                                        <Text style={styles.bankText}>{selectedBank}</Text>
                                        <Ionicons name={isBankPickerOpen ? "chevron-up" : "chevron-down"} size={20} color="#999" />
                                    </TouchableOpacity>

                                    {isBankPickerOpen && (
                                        <View style={styles.bankOptions}>
                                            {['Premier Bank', 'Salaam Bank', 'Dahabshil Bank'].map(bank => (
                                                <TouchableOpacity
                                                    key={bank}
                                                    style={styles.bankOption}
                                                    onPress={() => {
                                                        setSelectedBank(bank);
                                                        setIsBankPickerOpen(false);
                                                    }}
                                                >
                                                    <Text style={styles.bankOptionText}>{bank}</Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}

                                    <View style={[styles.summaryCard, { marginTop: spacing.sm, marginBottom: 0, padding: spacing.sm }]}>
                                        <Text style={styles.inputLabel}>ACCOUNT NAME</Text>
                                        <Text style={[styles.methodTitle, { fontSize: 13, marginBottom: 8 }]}>SOMSTAY RENTALS LTD</Text>
                                        <Text style={styles.inputLabel}>ACCOUNT NUMBER</Text>
                                        <Text style={[styles.methodTitle, { fontSize: 13 }]}>1002-3490-5582</Text>
                                    </View>
                                </View>
                            )}
                        </View>
                        <View style={[styles.radioCircle, paymentMethod === 'bank' && styles.radioCircleSelected]}>
                            {paymentMethod === 'bank' && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Security Badges */}
                <View style={styles.securityBadges}>
                    <View style={styles.badgeItem}>
                        <Ionicons name="shield-checkmark-outline" size={16} color="#999" />
                        <Text style={styles.badgeText}>SECURE PAYMENT</Text>
                    </View>
                    <View style={styles.badgeItem}>
                        <Ionicons name="lock-closed-outline" size={16} color="#999" />
                        <Text style={styles.badgeText}>ENCRYPTED CHECKOUT</Text>
                    </View>
                </View>

                {/* Footer Disclaimer */}
                <Text style={styles.footerText}>
                    By clicking "Confirm & Pay", you agree to our Terms of Service and Privacy Policy. Your payment will be processed securely.
                </Text>

            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.confirmButton, loading && { opacity: 0.7 }]}
                    onPress={handleConfirmPay}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.white} />
                    ) : (
                        <>
                            <Text style={styles.confirmButtonText}>Confirm & Pay ${bookingTotal.toFixed(2)}</Text>
                            <Ionicons name="arrow-forward" size={18} color={colors.white} />
                        </>
                    )}
                </TouchableOpacity>
            </View>

            <LoginModal
                visible={isLoginModalVisible}
                onClose={() => setIsLoginModalVisible(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </SafeAreaView>
    );
};
