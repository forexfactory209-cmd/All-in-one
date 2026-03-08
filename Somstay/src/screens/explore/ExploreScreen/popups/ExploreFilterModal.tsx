import React, {  useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, TextInput, Dimensions, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '@/src/theme';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Calendar } from 'react-native-calendars';
import { useApp, useTheme } from '@/src/context/AppContext';

interface ExploreFilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
    initialFilters?: any;
}

export const ExploreFilterModal: React.FC<ExploreFilterModalProps> = ({ 
    visible, 
    onClose, 
    onApply,
    initialFilters 
}) => {
    const { t } = useApp();
    const theme = useTheme();

    const [city, setCity] = useState(initialFilters?.city || 'Hargeisa');
    const [adults, setAdults] = useState(initialFilters?.adults || 2);
    const [children, setChildren] = useState(initialFilters?.children || 0);
    const [selectedType, setSelectedType] = useState(initialFilters?.type || 'All');
    const [priceRange, setPriceRange] = useState(initialFilters?.priceRange || [0, 500]);
    const [amenities, setAmenities] = useState<string[]>(initialFilters?.amenities || []);
    
    // Real Calendar dates selection
    const [selectedRange, setSelectedRange] = useState<{
        start?: string;
        end?: string;
    }>({
        start: initialFilters?.startDate || '2026-10-12',
        end: initialFilters?.endDate || '2026-10-15',
    });

    const onDayPress = (day: any) => {
        if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
            setSelectedRange({ start: day.dateString, end: undefined });
        } else {
            if (day.dateString > selectedRange.start) {
                setSelectedRange({ ...selectedRange, end: day.dateString });
            } else {
                setSelectedRange({ start: day.dateString, end: undefined });
            }
        }
    };

    const getMarkedDates = () => {
        const marked: any = {};
        if (selectedRange.start) {
            marked[selectedRange.start] = { 
                startingDay: true, 
                color: colors.primary, 
                textColor: 'white',
                selected: true 
            };
        }
        if (selectedRange.end) {
            marked[selectedRange.end] = { 
                endingDay: true, 
                color: colors.primary, 
                textColor: 'white',
                selected: true 
            };
            
            // Fill the range
            let start = new Date(selectedRange.start!);
            let end = new Date(selectedRange.end);
            let current = new Date(start);
            current.setDate(current.getDate() + 1);
            
            while (current < end) {
                const dateString = current.toISOString().split('T')[0];
                marked[dateString] = { color: colors.primary + '30', textColor: colors.primary };
                current.setDate(current.getDate() + 1);
            }
        }
        return marked;
    };

    const formatDateTooltip = (dateStr?: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const cities = ['Hargeisa', 'Berbera', 'Borama', 'Burco', 'Cerigabo', 'Erigavo'];
    const propertyTypes = ['All', 'Hotel', 'Apartment', 'Guest House', 'Resort', 'Suite'];
    const popularAmenities = ['Wifi', 'Pool', 'Gym', 'Parking', 'AC', 'Breakfast'];

    const toggleAmenity = (name: string) => {
        if (amenities.includes(name)) {
            setAmenities(amenities.filter(a => a !== name));
        } else {
            setAmenities([...amenities, name]);
        }
    };

    const handleApply = () => {
        onApply({
            city: city, // Backend uses city
            adults,
            children,
            type: selectedType === 'All' ? undefined : selectedType,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            amenities: amenities.length > 0 ? amenities.join(',') : undefined,
            details: `${formatDateTooltip(selectedRange.start)} - ${formatDateTooltip(selectedRange.end)} • ${adults + children} Guests`,
            // Pass actual values for persistence
            priceRange,
            startDate: selectedRange.start,
            endDate: selectedRange.end,
        });
        onClose();
    };

    const handleReset = () => {
        setCity('Hargeisa');
        setAdults(2);
        setChildren(0);
        setSelectedType('All');
        setPriceRange([0, 500]);
        setAmenities([]);
        setSelectedRange({
            start: '2026-10-12',
            end: '2026-10-15',
        });
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContainer, { backgroundColor: theme.card }]}>
                    <View style={styles.handle} />

                    <View style={styles.header}>
                        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('search_filters')}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Destination */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('select_city')}</Text>
                            <View style={styles.cityGrid}>
                                {cities.map((c) => (
                                    <TouchableOpacity
                                        key={c}
                                        style={[
                                            styles.cityChip,
                                            { backgroundColor: theme.surface, borderColor: theme.border },
                                            city === c && styles.activeCityChip
                                        ]}
                                        onPress={() => setCity(c)}
                                    >
                                        <Text style={[
                                            styles.cityText,
                                            { color: theme.textSecondary },
                                            city === c && styles.activeCityText
                                        ]}>{c}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Stay Dates */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('select_dates')}</Text>
                            <View style={styles.calendarWrapper}>
                                <Calendar
                                    markingType={'period'}
                                    markedDates={getMarkedDates()}
                                    onDayPress={onDayPress}
                                    theme={{
                                        selectedDayBackgroundColor: colors.primary,
                                        selectedDayTextColor: '#ffffff',
                                        todayTextColor: colors.primary,
                                        dayTextColor: colors.dark,
                                        textDisabledColor: '#d9e1e8',
                                        dotColor: colors.primary,
                                        selectedDotColor: '#ffffff',
                                        arrowColor: colors.primary,
                                        monthTextColor: colors.dark,
                                        indicatorColor: colors.primary,
                                        textDayFontFamily: 'System',
                                        textMonthFontFamily: 'System',
                                        textDayHeaderFontFamily: 'System',
                                        textDayFontWeight: '500',
                                        textMonthFontWeight: 'bold',
                                        textDayHeaderFontWeight: '300',
                                        textDayFontSize: 14,
                                        textMonthFontSize: 16,
                                        textDayHeaderFontSize: 14
                                    }}
                                    style={styles.calendar}
                                />
                            </View>
                            <View style={[styles.rangeDisplay, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                <View style={styles.rangeBox}>
                                    <Text style={[styles.rangeLabel, { color: theme.textSecondary }]}>{t('check_in')}</Text>
                                    <Text style={[styles.rangeValue, { color: theme.primary }]}>{formatDateTooltip(selectedRange.start) || 'Select'}</Text>
                                </View>
                                <Ionicons name="arrow-forward" size={20} color={theme.textSecondary} />
                                <View style={styles.rangeBox}>
                                    <Text style={[styles.rangeLabel, { color: theme.textSecondary }]}>{t('check_out')}</Text>
                                    <Text style={[styles.rangeValue, { color: theme.primary }]}>{formatDateTooltip(selectedRange.end) || 'Select'}</Text>
                                </View>
                            </View>
                        </View>

                        {/* Guests Selection */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('guests')}</Text>
                            <View style={styles.guestRow}>
                                <View>
                                    <Text style={[styles.guestLabel, { color: theme.text }]}>{t('adults')}</Text>
                                    <Text style={[styles.guestSubLabel, { color: theme.textSecondary }]}>{t('ages_above')}</Text>
                                </View>
                                <View style={styles.counterContainer}>
                                    <TouchableOpacity 
                                        style={styles.counterButton}
                                        onPress={() => adults > 1 && setAdults(adults - 1)}
                                    >
                                        <Ionicons name="remove" size={20} color={colors.dark} />
                                    </TouchableOpacity>
                                    <Text style={styles.counterValue}>{adults}</Text>
                                    <TouchableOpacity 
                                        style={styles.counterButton}
                                        onPress={() => setAdults(adults + 1)}
                                    >
                                        <Ionicons name="add" size={20} color={colors.primary} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.guestRow}>
                                <View>
                                    <Text style={[styles.guestLabel, { color: theme.text }]}>{t('children')}</Text>
                                    <Text style={[styles.guestSubLabel, { color: theme.textSecondary }]}>{t('ages_2_12')}</Text>
                                </View>
                                <View style={styles.counterContainer}>
                                    <TouchableOpacity 
                                        style={[styles.counterButton, { borderColor: theme.border }]}
                                        onPress={() => children > 0 && setChildren(children - 1)}
                                    >
                                        <Ionicons name="remove" size={20} color={theme.text} />
                                    </TouchableOpacity>
                                    <Text style={[styles.counterValue, { color: theme.text }]}>{children}</Text>
                                    <TouchableOpacity 
                                        style={[styles.counterButton, { borderColor: theme.border }]}
                                        onPress={() => setChildren(children + 1)}
                                    >
                                        <Ionicons name="add" size={20} color={theme.primary} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Stay Type */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('stay_type')}</Text>
                            <View style={styles.chipContainer}>
                                {propertyTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.chip,
                                            { backgroundColor: theme.surface, borderColor: theme.border },
                                            selectedType === type && styles.activeChip
                                        ]}
                                        onPress={() => setSelectedType(type)}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            { color: theme.textSecondary },
                                            selectedType === type && styles.activeChipText
                                        ]}>{type}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Price Range */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('price_range')}</Text>
                            <View style={styles.sliderContainer}>
                                <MultiSlider
                                    values={[priceRange[0], priceRange[1]]}
                                    sliderLength={Dimensions.get('window').width - 64}
                                    onValuesChange={(values) => setPriceRange(values)}
                                    min={0}
                                    max={1000}
                                    step={10}
                                    selectedStyle={{ backgroundColor: colors.primary }}
                                    markerStyle={styles.markerStyle}
                                />
                                <View style={styles.priceLabels}>
                                    <Text style={styles.priceLabelText}>${priceRange[0]}</Text>
                                    <Text style={styles.priceLabelText}>${priceRange[1]}+</Text>
                                </View>
                            </View>
                        </View>

                        {/* Amenities / Recommendations */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('amenities')}</Text>
                            <View style={styles.chipContainer}>
                                {popularAmenities.map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        style={[
                                            styles.chip,
                                            { backgroundColor: theme.surface, borderColor: theme.border },
                                            amenities.includes(item) && styles.activeChip
                                        ]}
                                        onPress={() => toggleAmenity(item)}
                                    >
                                        <Text style={[
                                            styles.chipText,
                                            { color: theme.textSecondary },
                                            amenities.includes(item) && styles.activeChipText
                                        ]}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        
                        <View style={{ height: 40 }} />
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                            <Text style={[styles.resetText, { color: theme.text }]}>{t('clear_all')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                            <Text style={styles.applyButtonText}>{t('show_hotels')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        height: '90%',
        paddingBottom: 20,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        alignSelf: 'center',
        marginTop: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: colors.dark,
    },
    closeButton: {
        padding: 4,
    },
    content: {
        padding: spacing.lg,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.dark,
        marginBottom: spacing.md,
    },
    cityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    cityChip: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: colors.white,
    },
    activeCityChip: {
        backgroundColor: colors.primary + '10',
        borderColor: colors.primary,
    },
    cityText: {
        fontSize: 14,
        color: '#5A5E5E',
        fontWeight: '500',
    },
    activeCityText: {
        color: colors.primary,
        fontWeight: '700',
    },
    calendarWrapper: {
        backgroundColor: '#F7F8F9',
        borderRadius: 24,
        padding: spacing.sm,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        overflow: 'hidden',
    },
    calendar: {
        borderRadius: 16,
    },
    rangeDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: spacing.md,
        padding: spacing.md,
        backgroundColor: colors.white,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    rangeBox: {
        flex: 1,
        alignItems: 'center',
    },
    rangeLabel: {
        fontSize: 12,
        color: '#7C7C7C',
        marginBottom: 4,
    },
    rangeValue: {
        fontSize: 15,
        fontWeight: '700',
        color: colors.primary,
    },
    guestRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    guestLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.dark,
    },
    guestSubLabel: {
        fontSize: 12,
        color: '#7C7C7C',
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    counterButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterValue: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.dark,
        minWidth: 20,
        textAlign: 'center',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    chip: {
        paddingHorizontal: spacing.lg,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: colors.white,
    },
    activeChip: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        fontSize: 14,
        color: '#5A5E5E',
        fontWeight: '500',
    },
    activeChipText: {
        color: colors.white,
        fontWeight: '700',
    },
    sliderContainer: {
        paddingHorizontal: 8,
    },
    markerStyle: {
        height: 24,
        width: 24,
        borderRadius: 12,
        backgroundColor: colors.white,
        borderWidth: 2,
        borderColor: colors.primary,
        ...shadows.medium,
    },
    priceLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    priceLabelText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
    },
    footer: {
        flexDirection: 'row',
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        gap: spacing.md,
    },
    resetButton: {
        flex: 1,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resetText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.dark,
        textDecorationLine: 'underline',
    },
    applyButton: {
        flex: 2,
        backgroundColor: colors.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.medium,
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.white,
    },
});
