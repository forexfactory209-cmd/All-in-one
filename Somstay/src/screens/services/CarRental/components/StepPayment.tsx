import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/src/theme';
import { useTheme } from '@/src/context/AppContext';

interface StepPaymentProps {
    formData: any;
    daysCount: number;
    totalPrice: number;
}

export const StepPayment: React.FC<StepPaymentProps> = ({ formData, daysCount, totalPrice }) => {
    const theme = useTheme();
    const summaryItems = [
        { label: 'Booking Duration', value: `${daysCount} Days`, icon: 'calendar-outline' },
        { label: 'Pickup Location', value: formData.delivery_type === 'airport' ? 'Hargeisa Airport' : 'Hotel Delivery', icon: 'location-outline' },
        { label: 'Protection Plan', value: 'Comprehensive Insurance', icon: 'shield-outline' },
    ];

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>SUMMARY & PAYMENT</Text>

            <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.summaryHeader}>
                    <Text style={[styles.summaryTitle, { color: theme.text }]}>Review Your Booking</Text>
                    <Ionicons name="checkmark-done-circle" size={24} color={theme.success} />
                </View>

                <View style={[styles.divider, { backgroundColor: theme.border }]} />

                {summaryItems.map((item, idx) => (
                    <View key={idx} style={styles.summaryItem}>
                        <View style={[styles.itemIconWrap, { backgroundColor: theme.surfaceSecondary }]}>
                            <Ionicons name={item.icon as any} size={20} color={theme.primary} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.itemLabel, { color: theme.textSecondary }]}>{item.label}</Text>
                            <Text style={[styles.itemValue, { color: theme.text }]}>{item.value}</Text>
                        </View>
                    </View>
                ))}

                <View style={[styles.totalSection, { borderTopColor: theme.border }]}>
                    <Text style={[styles.totalLabel, { color: theme.text }]}>Total Rental Amount</Text>
                    <Text style={[styles.totalVal, { color: theme.primary }]}>${totalPrice.toFixed(2)}</Text>
                </View>
            </View>

            <View style={[styles.depositBox, { backgroundColor: theme.primary + '05', borderColor: theme.primary + '20' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <Ionicons name="alert-circle" size={24} color={theme.primary} />
                    <Text style={[styles.summaryTitle, { fontSize: 18, color: theme.text }]}>Security Deposit</Text>
                </View>
                <Text style={[styles.itemLabel, { color: theme.textSecondary }]}>
                    A refundable security deposit of <Text style={{ fontWeight: '900', color: theme.text }}>$200.00</Text> will be required at the time of pickup.
                </Text>
            </View>

            <View style={{ marginTop: 24 }}>
                <Text style={[styles.label, { marginBottom: 12, color: theme.textSecondary }]}>SELECT PAYMENT METHOD</Text>
                <TouchableOpacity style={[styles.paymentMethod, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <View style={[styles.paymentIcon, { backgroundColor: theme.surfaceSecondary }]}>
                        <Ionicons name="phone-portrait" size={24} color={theme.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.itemValue, { color: theme.text }]}>ZAAD / Telesom</Text>
                        <Text style={[styles.itemLabel, { color: theme.textSecondary }]}>Mobile Money Transfer</Text>
                    </View>
                    <Ionicons name="radio-button-on" size={24} color={theme.primary} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.paymentMethod, { backgroundColor: theme.card, borderColor: theme.border, opacity: 0.6, marginTop: 12 }]}>
                    <View style={[styles.paymentIcon, { backgroundColor: theme.surfaceSecondary }]}>
                        <Ionicons name="card-outline" size={24} color={theme.textSecondary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.itemValue, { color: theme.text }]}>Credit / Debit Card</Text>
                        <Text style={[styles.itemLabel, { color: theme.textSecondary }]}>Coming soon</Text>
                    </View>
                    <Ionicons name="radio-button-off" size={24} color={theme.textSecondary + '60'} />
                </TouchableOpacity>
            </View>
            <View style={{ height: 40 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingVertical: spacing.md },
    title: {
        ...typography.textStyles.h1,
        marginBottom: spacing.lg,
        fontSize: 28,
    },
    label: {
        ...typography.textStyles.labelSmall,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.2
    },
    summaryCard: {
        borderRadius: 24,
        padding: 20,
        ...shadows.medium,
        borderWidth: 1,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
    },
    summaryTitle: {
        ...typography.textStyles.h6,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        marginBottom: 16
    },
    summaryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 16
    },
    itemIconWrap: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    itemLabel: {
        ...typography.textStyles.caption,
        fontWeight: '600',
    },
    itemValue: {
        ...typography.textStyles.bodySmall,
        fontWeight: '700',
    },
    totalSection: {
        marginTop: 8,
        paddingTop: 16,
        borderTopWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        ...typography.textStyles.label,
        fontWeight: '700'
    },
    totalVal: {
        ...typography.textStyles.h1,
        fontWeight: '800',
        fontSize: 28
    },
    depositBox: {
        marginTop: 24,
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: borderRadius.base,
        borderWidth: 1,
        gap: 16,
        ...shadows.small,
    },
    paymentIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
