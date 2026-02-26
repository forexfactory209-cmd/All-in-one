import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from './styles/ConfirmPayScreen.styles';
import { colors } from '@/src/theme';

export const ConfirmPayScreen: React.FC = () => {
    const router = useRouter();
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);

    // Date Selection State
    const [startDate, setStartDate] = useState<number | null>(12);
    const [endDate, setEndDate] = useState<number | null>(14);
    const [currentMonth, setCurrentMonth] = useState(new Date(2023, 9, 1)); // October 2023

    const property = {
        title: 'Modern Oceanview Villa',
        price: 120,
        rating: 4.9,
        reviews: 128,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80',
    };

    const calendarHeader = ["S", "M", "T", "W", "T", "F", "S"];

    // Simple calendar generator for the mock design (October 2023)
    const generateDates = () => {
        const result = [];
        // October 2023 starts on a Sunday (0 for Sunday)
        // Previous month days (September)
        for (let i = 24; i <= 30; i++) {
            result.push({ day: i, current: false });
        }
        // October days
        for (let i = 1; i <= 31; i++) {
            result.push({ day: i, current: true });
        }
        return result.slice(0, 35); // Keep it to 5 rows for the design look
    };

    const dates = generateDates();

    const handleDatePress = (day: number, isCurrent: boolean) => {
        if (!isCurrent) return;

        if (!startDate || (startDate && endDate)) {
            setStartDate(day);
            setEndDate(null);
        } else if (startDate && !endDate) {
            if (day < startDate) {
                setStartDate(day);
            } else if (day === startDate) {
                setStartDate(null);
            } else {
                setEndDate(day);
            }
        }
    };

    const isInRange = (day: number) => {
        if (!startDate || !endDate) return false;
        return day > startDate && day < endDate;
    };

    const nightsCount = (startDate && endDate) ? endDate - startDate : 2;
    const basePrice = property.price * nightsCount;
    const serviceFee = 10;
    const totalPrice = basePrice + serviceFee;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={colors.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Confirm and pay</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

                {/* Property Summary Card */}
                <View style={styles.propertyCard}>
                    <View style={styles.propertyInfo}>
                        <Text style={styles.propertyTitle}>{property.title}</Text>
                        <Text style={styles.propertyPrice}>${property.price} / night</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <Text style={styles.ratingText}>{property.rating} ({property.reviews} reviews)</Text>
                        </View>
                    </View>
                    <Image source={{ uri: property.image }} style={styles.propertyImage} />
                </View>

                {/* Dates Section */}
                <Text style={styles.sectionTitle}>Dates</Text>
                <View style={styles.calendarContainer}>
                    <View style={styles.calendarHeader}>
                        <TouchableOpacity><Ionicons name="chevron-back" size={20} color={colors.dark} /></TouchableOpacity>
                        <Text style={styles.monthTitle}>October 2023</Text>
                        <TouchableOpacity><Ionicons name="chevron-forward" size={20} color={colors.dark} /></TouchableOpacity>
                    </View>

                    <View style={styles.weekdaysRow}>
                        {calendarHeader.map((d, i) => (
                            <Text key={i} style={styles.weekdayText}>{d}</Text>
                        ))}
                    </View>

                    <View style={styles.daysGrid}>
                        {dates.map((d, i) => {
                            const selected = d.current && (d.day === startDate ? 'start' : d.day === endDate ? 'end' : null);
                            const inRange = d.current && isInRange(d.day);

                            return (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => handleDatePress(d.day, d.current)}
                                    activeOpacity={0.7}
                                    style={[
                                        styles.dayCell,
                                        inRange && styles.rangeDay,
                                        selected === 'start' && { ...styles.selectedDay, borderTopRightRadius: (endDate ? 0 : 18), borderBottomRightRadius: (endDate ? 0 : 18) },
                                        selected === 'end' && { ...styles.selectedDay, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }
                                    ]}
                                >
                                    <Text style={[
                                        styles.dayText,
                                        !d.current && styles.inactiveDayText,
                                        selected && styles.selectedDayText
                                    ]}>
                                        {d.day}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Guests Section */}
                <Text style={styles.sectionTitle}>Guests</Text>

                <View style={styles.guestRow}>
                    <View>
                        <Text style={styles.guestLabel}>Adults</Text>
                        <Text style={styles.guestSubLabel}>Age 13+</Text>
                    </View>
                    <View style={styles.counterContainer}>
                        <TouchableOpacity
                            style={styles.counterButton}
                            onPress={() => adults > 1 && setAdults(adults - 1)}
                        >
                            <Ionicons name="remove" size={20} color="#999" />
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
                        <Text style={styles.guestLabel}>Children</Text>
                        <Text style={styles.guestSubLabel}>Ages 2–12</Text>
                    </View>
                    <View style={styles.counterContainer}>
                        <TouchableOpacity
                            style={styles.counterButton}
                            onPress={() => children > 0 && setChildren(children - 1)}
                        >
                            <Ionicons name="remove" size={20} color="#999" />
                        </TouchableOpacity>
                        <Text style={styles.counterValue}>{children}</Text>
                        <TouchableOpacity
                            style={styles.counterButton}
                            onPress={() => setChildren(children + 1)}
                        >
                            <Ionicons name="add" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Message to Host */}
                <Text style={styles.sectionTitle}>Message to Host</Text>
                <TextInput
                    style={styles.messageInput}
                    multiline
                    placeholder="Tell the host why you're travelling and what you love about their place..."
                    placeholderTextColor="#CCC"
                />

                {/* Price Details */}
                <Text style={styles.sectionTitle}>Price details</Text>
                <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>${property.price} x {nightsCount} nights</Text>
                    <Text style={styles.priceValue}>${basePrice.toFixed(2)}</Text>
                </View>
                <View style={styles.priceRow}>
                    <TouchableOpacity>
                        <Text style={[styles.priceLabel, styles.serviceFee]}>Service fee</Text>
                    </TouchableOpacity>
                    <Text style={styles.priceValue}>${serviceFee.toFixed(2)}</Text>
                </View>

                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total (USD)</Text>
                    <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
                </View>

            </ScrollView>

            {/* Bottom Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.bookingButton}
                    onPress={() => router.push('/checkout')}
                >
                    <Text style={styles.bookingButtonText}>Send Booking Request</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
