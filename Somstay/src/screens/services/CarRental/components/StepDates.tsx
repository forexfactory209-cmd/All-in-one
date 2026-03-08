import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/src/theme';

interface StepDatesProps {
    formData: any;
    setFormData: (data: any) => void;
}

export const StepDates: React.FC<StepDatesProps> = ({ formData, setFormData }) => {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>LOGISTICS & SERVICES</Text>
            
            <View style={styles.inputGroup}>
                <Text style={styles.label}>PICKUP INFO</Text>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.datePicker}>
                        <View style={styles.iconBox}>
                             <Ionicons name="calendar" size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.dateText}>{formData.pickup_date || 'Set Date'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.datePicker}>
                        <View style={styles.iconBox}>
                             <Ionicons name="time" size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.dateText}>10:00 AM</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>RETURN INFO</Text>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.datePicker}>
                        <View style={styles.iconBox}>
                            <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.dateText}>{formData.return_date || 'Set Date'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.datePicker}>
                        <View style={styles.iconBox}>
                             <Ionicons name="time-outline" size={20} color={colors.primary} />
                        </View>
                        <Text style={styles.dateText}>10:00 AM</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>DELIVERY PREFERENCE</Text>
                <View style={styles.row}>
                    <TouchableOpacity 
                        style={[styles.radioBtn, formData.delivery_type === 'airport' && styles.radioActive]}
                        onPress={() => setFormData({...formData, delivery_type: 'airport'})}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.radioIcon, formData.delivery_type === 'airport' && styles.radioIconActive]}>
                            <Ionicons name="airplane" size={24} color={formData.delivery_type === 'airport' ? colors.white : colors.secondaryText} />
                        </View>
                        <Text style={[styles.radioText, formData.delivery_type === 'airport' && styles.radioTextActive]}>Airport</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.radioBtn, formData.delivery_type === 'hotel' && styles.radioActive]}
                        onPress={() => setFormData({...formData, delivery_type: 'hotel'})}
                        activeOpacity={0.8}
                    >
                        <View style={[styles.radioIcon, formData.delivery_type === 'hotel' && styles.radioIconActive]}>
                            <Ionicons name="business" size={24} color={formData.delivery_type === 'hotel' ? colors.white : colors.secondaryText} />
                        </View>
                        <Text style={[styles.radioText, formData.delivery_type === 'hotel' && styles.radioTextActive]}>Hotel</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {formData.delivery_type === 'hotel' && (
                <View style={styles.inputGroup}>
                    <View style={styles.rowLabel}>
                        <Ionicons name="location" size={16} color={colors.primary} />
                        <Text style={styles.label}>DELIVERY ADDRESS</Text>
                    </View>
                    <TextInput 
                        style={styles.input} 
                        value={formData.hotel_room} 
                        onChangeText={(t) => setFormData({...formData, hotel_room: t})}
                        placeholder="e.g. Hotel Mansoor, Room 302"
                        placeholderTextColor="#94A3B8"
                    />
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: spacing.md },
    title: { ...typography.textStyles.h3, color: '#000000', fontWeight: 'bold', marginBottom: 24, fontSize: 32 },
    inputGroup: { marginBottom: 24 },
    rowLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
    label: { ...typography.textStyles.labelSmall, color: '#333333', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.2 },
    row: { flexDirection: 'row', gap: 16 },
    iconBox: { width: 32, height: 32, borderRadius: 8, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center', ...shadows.small },
    datePicker: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: colors.gray100,
        padding: 16,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.gray200,
    },
    dateText: { ...typography.textStyles.bodySmall, color: '#000000', fontWeight: 'bold', fontSize: 16 },
    radioBtn: {
        flex: 1,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 28,
        borderWidth: 2,
        borderColor: colors.gray100,
        backgroundColor: colors.white,
        ...shadows.small,
    },
    radioActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '08',
        ...shadows.medium,
    },
    radioIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: colors.gray100,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    radioIconActive: {
        backgroundColor: colors.primary,
    },
    radioText: { ...typography.textStyles.label, color: '#333333', fontWeight: 'bold' },
    radioTextActive: { color: colors.primary },
    input: {
        backgroundColor: colors.gray100,
        padding: 20,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.gray200,
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
    },
});
