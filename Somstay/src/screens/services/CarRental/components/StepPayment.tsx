import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/src/theme';

interface StepPaymentProps {
    formData: any;
    daysCount: number;
    totalPrice: number;
}

export const StepPayment: React.FC<StepPaymentProps> = ({ formData, daysCount, totalPrice }) => {
    const summaryItems = [
        { label: 'Booking Duration', value: `${daysCount} Days`, icon: 'calendar-outline' },
        { label: 'Pickup Location', value: formData.delivery_type === 'airport' ? 'Hargeisa Airport' : 'Hotel Delivery', icon: 'location-outline' },
        { label: 'Protection Plan', value: 'Comprehensive Insurance', icon: 'shield-outline' },
    ];

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            <Text style={styles.title}>SUMMARY & PAYMENT</Text>
            
            <View style={styles.summaryCard}>
                <View style={styles.summaryHeader}>
                    <Text style={styles.summaryTitle}>Review Your Booking</Text>
                    <Ionicons name="checkmark-done-circle" size={24} color={colors.success} />
                </View>

                <View style={styles.divider} />

                {summaryItems.map((item, idx) => (
                    <View key={idx} style={styles.summaryItem}>
                        <View style={styles.itemIconWrap}>
                             <Ionicons name={item.icon as any} size={20} color={colors.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.itemLabel}>{item.label}</Text>
                            <Text style={styles.itemValue}>{item.value}</Text>
                        </View>
                    </View>
                ))}

                <View style={styles.totalSection}>
                    <Text style={styles.totalLabel}>Total Rental Amount</Text>
                    <Text style={styles.totalVal}>${totalPrice.toFixed(2)}</Text>
                </View>
            </View>

            <View style={styles.depositBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <Ionicons name="alert-circle" size={24} color={colors.primary} />
                    <Text style={[styles.summaryTitle, { fontSize: 18 }]}>Security Deposit</Text>
                </View>
                <Text style={styles.itemLabel}>
                    A refundable security deposit of <Text style={{ fontWeight: '900', color: colors.dark }}>$200.00</Text> will be required at the time of pickup.
                </Text>
            </View>

            <View style={{ marginTop: 24 }}>
                <Text style={[styles.label, { marginBottom: 12 }]}>SELECT PAYMENT METHOD</Text>
                <TouchableOpacity style={styles.paymentMethod}>
                    <View style={styles.paymentIcon}>
                         <Ionicons name="phone-portrait" size={24} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.itemValue}>ZAAD / Telesom</Text>
                        <Text style={styles.itemLabel}>Mobile Money Transfer</Text>
                    </View>
                    <Ionicons name="radio-button-on" size={24} color={colors.primary} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.paymentMethod, { opacity: 0.6, marginTop: 12 }]}>
                    <View style={styles.paymentIcon}>
                         <Ionicons name="card-outline" size={24} color={colors.secondaryText} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.itemValue}>Credit / Debit Card</Text>
                        <Text style={styles.itemLabel}>Coming soon</Text>
                    </View>
                    <Ionicons name="radio-button-off" size={24} color={colors.gray300} />
                </TouchableOpacity>
            </View>
            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: spacing.md },
    title: { ...typography.textStyles.h3, color: colors.dark, fontWeight: '900', marginBottom: 24, fontSize: 32 },
    label: { ...typography.textStyles.labelSmall, color: colors.secondaryText, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2 },
    summaryCard: {
        backgroundColor: colors.white,
        borderRadius: 32,
        padding: 24,
        ...shadows.large,
        borderWidth: 1,
        borderColor: colors.gray100,
    },
    summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    summaryTitle: { ...typography.textStyles.h6, color: colors.dark, fontWeight: '800', fontSize: 20 },
    divider: { height: 1.5, backgroundColor: colors.gray100, marginBottom: 16 },
    summaryItem: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
    itemIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primary + '10', justifyContent: 'center', alignItems: 'center' },
    itemLabel: { ...typography.textStyles.caption, color: colors.secondaryText, fontWeight: '600', fontSize: 13 },
    itemValue: { ...typography.textStyles.bodySmall, color: colors.dark, fontWeight: '800', fontSize: 16 },
    totalSection: {
        marginTop: 8,
        paddingTop: 20,
        borderTopWidth: 2,
        borderTopColor: colors.gray50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    totalLabel: { ...typography.textStyles.labelSmall, color: colors.secondaryText, fontWeight: '800' },
    totalVal: { ...typography.textStyles.h2, color: colors.primary, fontWeight: '900', fontSize: 32 },
    depositBox: {
        marginTop: 24,
        padding: 24,
        backgroundColor: colors.primary + '05',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.primary + '20',
        borderStyle: 'dashed',
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.white,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: colors.gray100,
        gap: 16,
        ...shadows.small,
    },
    paymentIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: colors.gray100,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
