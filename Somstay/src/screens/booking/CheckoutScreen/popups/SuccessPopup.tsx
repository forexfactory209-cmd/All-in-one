import React from 'react';
import { View, Text, Modal, TouchableOpacity, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './SuccessPopup.styles';
import { colors } from '@/src/theme';

interface SuccessPopupProps {
    visible: boolean;
    onClose: () => void;
    onViewBooking: () => void;
    onGoHome: () => void;
}

export const SuccessPopup: React.FC<SuccessPopupProps> = ({
    visible,
    onClose,
    onViewBooking,
    onGoHome,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <Pressable style={{ flex: 1 }} onPress={onClose} />

                <SafeAreaView edges={['bottom']}>
                    <View style={styles.sheetContainer}>
                        <View style={styles.handle} />

                        <Text style={styles.headerTitle}>Payment Success</Text>

                        <View style={styles.successIconContainer}>
                            <View style={styles.successCircleInner}>
                                <Ionicons name="checkmark" size={40} color="#10B981" />
                            </View>
                        </View>

                        <Text style={styles.mainTitle}>Payment Successful!</Text>
                        <Text style={styles.subTitle}>
                            Your journey begins soon. Your flight and hotel bookings are confirmed.
                        </Text>

                        {/* Info Card */}
                        <View style={styles.infoCard}>
                            <View style={styles.cardHeader}>
                                <View style={styles.bookingIdSection}>
                                    <View style={styles.ticketIconBox}>
                                        <MaterialCommunityIcons name="ticket-percent-outline" size={24} color={colors.primary} />
                                    </View>
                                    <View>
                                        <Text style={styles.label}>BOOKING ID</Text>
                                        <Text style={styles.bookingId}>#BOK-98231</Text>
                                    </View>
                                </View>
                                <View style={styles.priceSection}>
                                    <Text style={styles.label}>TOTAL PAID</Text>
                                    <Text style={styles.totalPaid}>$1,240.00</Text>
                                </View>
                            </View>

                            <View style={styles.dividerLine} />

                            <View style={styles.cardFooter}>
                                <Ionicons name="airplane-outline" size={18} color="#9BA3A3" />
                                <Text style={styles.footerText}>Hargisa (CDG) • 2 Travelers</Text>
                            </View>
                        </View>

                        {/* Buttons */}
                        <TouchableOpacity style={styles.primaryButton} onPress={onViewBooking}>
                            <Text style={styles.primaryButtonText}>View Booking</Text>
                            <Ionicons name="arrow-forward" size={20} color={colors.white} />
                        </TouchableOpacity>

                        <View style={styles.secondaryButtonsRow}>
                            <TouchableOpacity style={styles.secondaryButton} onPress={onGoHome}>
                                <Ionicons name="home-outline" size={20} color="#5A5E5E" />
                                <Text style={styles.secondaryButtonText}>Home</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.secondaryButton}>
                                <MaterialCommunityIcons name="file-document-outline" size={20} color="#5A5E5E" />
                                <Text style={styles.secondaryButtonText}>Receipt</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
};
