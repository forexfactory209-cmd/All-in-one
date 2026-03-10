import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/src/theme';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '@/src/context/AppContext';

interface StepDriverInfoProps {
    formData: any;
    setFormData: (data: any) => void;
}

export const StepDriverInfo: React.FC<StepDriverInfoProps> = ({ formData, setFormData }) => {
    const theme = useTheme();
    const [showDobModal, setShowDobModal] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData({
            ...formData,
            driver_info: {
                ...formData.driver_info,
                [field]: value
            }
        });
    };

    const handleDobSelect = (day: any) => {
        handleInputChange('dob', day.dateString);
        setShowDobModal(false);
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>DRIVER INFO</Text>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>FULL LEGAL NAME</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                    placeholder="Enter full name"
                    value={formData.driver_info.full_name}
                    onChangeText={(t) => handleInputChange('full_name', t)}
                    placeholderTextColor={theme.textSecondary + '80'}
                />
            </View>

            <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1.2 }]}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>MOBILE PHONE</Text>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                        placeholder="+252..."
                        keyboardType="phone-pad"
                        value={formData.driver_info.phone_number}
                        onChangeText={(t) => handleInputChange('phone_number', t)}
                        placeholderTextColor={theme.textSecondary + '80'}
                    />
                </View>
                <View style={[styles.inputGroup, { flex: 0.8 }]}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>BIRTH DATE</Text>
                    <TouchableOpacity
                        style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border }]}
                        onPress={() => setShowDobModal(true)}
                        activeOpacity={0.7}
                    >
                        <Text style={{
                            color: formData.driver_info.dob ? theme.text : (theme.textSecondary + '80'),
                            fontSize: 14,
                            fontWeight: '600'
                        }}>
                            {formData.driver_info.dob || 'Set DOB'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>EMAIL ADDRESS</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                    placeholder="driver@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.driver_info.email}
                    onChangeText={(t) => handleInputChange('email', t)}
                    placeholderTextColor={theme.textSecondary + '80'}
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>NATIONALITY</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                    placeholder="e.g. Somaliland"
                    value={formData.driver_info.nationality}
                    onChangeText={(t) => handleInputChange('nationality', t)}
                    placeholderTextColor={theme.textSecondary + '80'}
                />
            </View>

            <View style={[styles.infoBox, { backgroundColor: theme.primary + '10', borderColor: theme.primary + '20' }]}>
                <Ionicons name="information-circle" size={20} color={theme.primary} />
                <Text style={[styles.note, { color: theme.primary }]}>All data is encrypted and handled per international safety standards.</Text>
            </View>

            <Modal visible={showDobModal} transparent animationType="fade">
                <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>Select Birth Date</Text>
                            <TouchableOpacity onPress={() => setShowDobModal(false)}>
                                <Ionicons name="close" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>
                        <Calendar
                            current={'2000-01-01'}
                            onDayPress={handleDobSelect}
                            markedDates={{
                                [formData.driver_info.dob]: { selected: true, selectedColor: theme.primary }
                            }}
                            theme={{
                                calendarBackground: theme.card,
                                textSectionTitleColor: theme.textSecondary,
                                selectedDayBackgroundColor: theme.primary,
                                selectedDayTextColor: '#ffffff',
                                todayTextColor: theme.primary,
                                dayTextColor: theme.text,
                                textDisabledColor: theme.textSecondary + '40',
                                dotColor: theme.primary,
                                selectedDotColor: '#ffffff',
                                arrowColor: theme.primary,
                                disabledArrowColor: theme.textSecondary + '20',
                                monthTextColor: theme.text,
                                indicatorColor: theme.primary,
                                textDayFontFamily: typography.fontFamily.regular,
                                textMonthFontFamily: typography.fontFamily.bold,
                                textDayHeaderFontFamily: typography.fontFamily.regular,
                                textDayFontWeight: '600',
                                textMonthFontWeight: 'bold',
                                textDayHeaderFontWeight: 'bold',
                                textDayFontSize: 14,
                                textMonthFontSize: 16,
                                textDayHeaderFontSize: 12
                            }}
                        />
                    </View>
                </View>
            </Modal>
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
    inputGroup: { marginBottom: spacing.xl },
    label: {
        ...typography.textStyles.labelSmall,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 12
    },
    input: {
        padding: 18,
        borderRadius: borderRadius.base,
        borderWidth: 1,
        fontSize: 16,
        ...shadows.small,
    },
    row: { flexDirection: 'row', gap: 12 },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 18,
        borderRadius: 20,
        marginTop: 8,
        borderWidth: 1,
    },
    note: {
        ...typography.textStyles.caption,
        fontWeight: '600',
        flex: 1
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        padding: 20
    },
    modalContent: {
        borderRadius: 24,
        padding: 20,
        ...shadows.large
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    modalTitle: {
        ...typography.textStyles.h6,
        fontWeight: '700'
    },
});
