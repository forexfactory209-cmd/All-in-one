import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/src/theme';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '@/src/context/AppContext';

interface StepDatesProps {
    formData: any;
    setFormData: (data: any) => void;
}

const TIME_SLOTS = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
];

export const StepDates: React.FC<StepDatesProps> = ({ formData, setFormData }) => {
    const theme = useTheme();
    const [showCalendar, setShowCalendar] = React.useState<{ show: boolean, field: 'pickup_date' | 'return_date' }>({
        show: false,
        field: 'pickup_date'
    });
    const [showTimePicker, setShowTimePicker] = React.useState<{ show: boolean, field: 'pickup_time' | 'return_time' }>({
        show: false,
        field: 'pickup_time'
    });

    const onDateSelect = (day: any) => {
        setFormData({ ...formData, [showCalendar.field]: day.dateString });
        setShowCalendar({ ...showCalendar, show: false });
    };

    const onTimeSelect = (time: string) => {
        setFormData({ ...formData, [showTimePicker.field]: time });
        setShowTimePicker({ ...showTimePicker, show: false });
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
            <Text style={[styles.title, { color: theme.text }]}>LOGISTICS & SERVICES</Text>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>PICKUP INFO</Text>
                <View style={styles.row}>
                    <TouchableOpacity
                        style={[styles.datePicker, { backgroundColor: theme.card, borderColor: theme.border }]}
                        onPress={() => setShowCalendar({ show: true, field: 'pickup_date' })}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconBox, { backgroundColor: theme.surfaceSecondary }]}>
                            <Ionicons name="calendar-sharp" size={20} color={theme.primary} />
                        </View>
                        <Text style={[styles.dateText, { color: theme.text }]}>{formData.pickup_date || 'Set Date'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.datePicker, { backgroundColor: theme.card, borderColor: theme.border }]}
                        onPress={() => setShowTimePicker({ show: true, field: 'pickup_time' })}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconBox, { backgroundColor: theme.surfaceSecondary }]}>
                            <Ionicons name="time-sharp" size={20} color={theme.primary} />
                        </View>
                        <Text style={[styles.dateText, { color: theme.text }]}>{formData.pickup_time || '10:00 AM'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>RETURN INFO</Text>
                <View style={styles.row}>
                    <TouchableOpacity
                        style={[styles.datePicker, { backgroundColor: theme.card, borderColor: theme.border }]}
                        onPress={() => setShowCalendar({ show: true, field: 'return_date' })}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconBox, { backgroundColor: theme.surfaceSecondary }]}>
                            <Ionicons name="calendar-outline" size={20} color={theme.primary} />
                        </View>
                        <Text style={[styles.dateText, { color: theme.text }]}>{formData.return_date || 'Set Date'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.datePicker, { backgroundColor: theme.card, borderColor: theme.border }]}
                        onPress={() => setShowTimePicker({ show: true, field: 'return_time' })}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconBox, { backgroundColor: theme.surfaceSecondary }]}>
                            <Ionicons name="time-outline" size={20} color={theme.primary} />
                        </View>
                        <Text style={[styles.dateText, { color: theme.text }]}>{formData.return_time || '10:00 AM'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>DELIVERY PREFERENCE</Text>
                <View style={styles.row}>
                    <TouchableOpacity
                        style={[
                            styles.radioBtn,
                            { backgroundColor: theme.card, borderColor: theme.border },
                            formData.delivery_type === 'airport' && { borderColor: theme.primary, backgroundColor: theme.primary + '05' }
                        ]}
                        onPress={() => setFormData({ ...formData, delivery_type: 'airport' })}
                        activeOpacity={0.8}
                    >
                        <View style={[
                            styles.radioIcon,
                            { backgroundColor: theme.surfaceSecondary },
                            formData.delivery_type === 'airport' && { backgroundColor: theme.primary }
                        ]}>
                            <Ionicons name="airplane" size={24} color={formData.delivery_type === 'airport' ? colors.white : theme.textSecondary} />
                        </View>
                        <Text style={[
                            styles.radioText,
                            { color: theme.textSecondary },
                            formData.delivery_type === 'airport' && { color: theme.primary }
                        ]}>Airport</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.radioBtn,
                            { backgroundColor: theme.card, borderColor: theme.border },
                            formData.delivery_type === 'hotel' && { borderColor: theme.primary, backgroundColor: theme.primary + '05' }
                        ]}
                        onPress={() => setFormData({ ...formData, delivery_type: 'hotel' })}
                        activeOpacity={0.8}
                    >
                        <View style={[
                            styles.radioIcon,
                            { backgroundColor: theme.surfaceSecondary },
                            formData.delivery_type === 'hotel' && { backgroundColor: theme.primary }
                        ]}>
                            <Ionicons name="business" size={24} color={formData.delivery_type === 'hotel' ? colors.white : theme.textSecondary} />
                        </View>
                        <Text style={[
                            styles.radioText,
                            { color: theme.textSecondary },
                            formData.delivery_type === 'hotel' && { color: theme.primary }
                        ]}>Hotel</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {formData.delivery_type === 'hotel' && (
                <View style={styles.inputGroup}>
                    <View style={styles.rowLabel}>
                        <Ionicons name="location" size={16} color={theme.primary} />
                        <Text style={[styles.label, { color: theme.textSecondary }]}>DELIVERY ADDRESS</Text>
                    </View>
                    <TextInput
                        style={[styles.input, { backgroundColor: theme.card, borderColor: theme.border, color: theme.text }]}
                        value={formData.hotel_room}
                        onChangeText={(t) => setFormData({ ...formData, hotel_room: t })}
                        placeholder="e.g. Hotel Mansoor, Room 302"
                        placeholderTextColor={theme.textSecondary + '80'}
                    />
                </View>
            )}

            <Modal visible={showCalendar.show} transparent animationType="fade">
                <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>Select Date</Text>
                            <TouchableOpacity onPress={() => setShowCalendar({ ...showCalendar, show: false })}>
                                <Ionicons name="close" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>
                        <Calendar
                            onDayPress={onDateSelect}
                            markedDates={{
                                [formData[showCalendar.field]]: { selected: true, selectedColor: theme.primary }
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

            <Modal visible={showTimePicker.show} transparent animationType="fade">
                <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
                    <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>Select Time</Text>
                            <TouchableOpacity onPress={() => setShowTimePicker({ ...showTimePicker, show: false })}>
                                <Ionicons name="close" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ maxHeight: 300 }}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {TIME_SLOTS.map((slot) => (
                                    <TouchableOpacity
                                        key={slot}
                                        style={[
                                            styles.timeSlot,
                                            { backgroundColor: theme.surfaceSecondary },
                                            formData[showTimePicker.field] === slot && { backgroundColor: theme.primary + '15', borderColor: theme.primary, borderWidth: 1 }
                                        ]}
                                        onPress={() => onTimeSelect(slot)}
                                    >
                                        <Text style={[
                                            styles.timeSlotText,
                                            { color: theme.text },
                                            formData[showTimePicker.field] === slot && { color: theme.primary, fontWeight: '700' }
                                        ]}>{slot}</Text>
                                        {formData[showTimePicker.field] === slot && (
                                            <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
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
    rowLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
    label: {
        ...typography.textStyles.labelSmall,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.2
    },
    row: { flexDirection: 'row', gap: 12 },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    datePicker: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 14,
        borderRadius: borderRadius.base,
        borderWidth: 1,
        ...shadows.small,
    },
    dateText: {
        ...typography.textStyles.body,
        fontWeight: '600',
    },
    radioBtn: {
        flex: 1,
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        borderWidth: 1.5,
        ...shadows.small,
    },
    radioIcon: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    radioText: {
        ...typography.textStyles.label,
        fontWeight: 'bold'
    },
    input: {
        padding: 18,
        borderRadius: borderRadius.base,
        borderWidth: 1,
        fontSize: 16,
        ...shadows.small,
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
    timeSlot: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        marginBottom: 8,
    },
    timeSlotText: {
        ...typography.textStyles.body,
    },
});
