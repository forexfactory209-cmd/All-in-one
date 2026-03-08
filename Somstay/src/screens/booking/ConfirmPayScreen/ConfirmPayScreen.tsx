import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles } from './styles/ConfirmPayScreen.styles';
import { colors } from '@/src/theme';
import { useRoomDetails } from '../../property/PropertyDetailsScreen/hooks/useRoomDetails';

export const ConfirmPayScreen: React.FC = () => {
    const router = useRouter();
    const { id, type } = useLocalSearchParams();
    const entityType = type as string || 'room';

    const { room: fetchedData, loading } = useRoomDetails(id as string, entityType);

    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);

    // Date Selection State
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date(new Date().setDate(new Date().getDate() + 2)));

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (!fetchedData) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Item not found</Text>
            </View>
        );
    }

    const item = {
        id: fetchedData.id,
        title: fetchedData.name || `${fetchedData.type} Room`,
        price: parseFloat(fetchedData.price || fetchedData.price_per_night),
        rating: 4.9,
        reviews: 128,
        image: fetchedData.main_image || fetchedData.image_url || 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&q=80',
    };

    const calendarHeader = ["S", "M", "T", "W", "T", "F", "S"];

    const generateDates = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const startingDayOfWeek = firstDay.getDay(); // 0-6 (Sun-Sat)
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        
        const result = [];
        
        // Previous month days
        for (let i = 0; i < startingDayOfWeek; i++) {
            result.push({ 
                date: new Date(year, month - 1, daysInPrevMonth - startingDayOfWeek + i + 1), 
                day: daysInPrevMonth - startingDayOfWeek + i + 1, 
                current: false 
            });
        }
        
        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            result.push({ 
                date: new Date(year, month, i), 
                day: i, 
                current: true 
            });
        }
        
        // Next month days to complete 5 or 6 rows (35 or 42 cells)
        const totalCells = result.length > 35 ? 42 : 35;
        const remainingCells = totalCells - result.length;
        for (let i = 1; i <= remainingCells; i++) {
            result.push({ 
                date: new Date(year, month + 1, i), 
                day: i, 
                current: false 
            });
        }
        
        return result;
    };

    const dates = generateDates();

    const handleDatePress = (day: number, isCurrent: boolean, date: Date) => {
        if (!isCurrent) return;

        // Prevent selecting past dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date.getTime() < today.getTime()) {
            return;
        }

        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
        } else if (startDate && !endDate) {
            if (date.getTime() < startDate.getTime()) {
                setStartDate(date);
            } else if (date.getTime() === startDate.getTime()) {
                setStartDate(null);
            } else {
                setEndDate(date);
            }
        }
    };

    const isInRange = (date: Date) => {
        if (!startDate || !endDate) return false;
        return date.getTime() > startDate.getTime() && date.getTime() < endDate.getTime();
    };

    const nightsCount = (startDate && endDate) 
        ? Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))) 
        : 2;
    const basePrice = item.price * nightsCount;
    const serviceFee = 10;
    const totalPrice = basePrice + serviceFee;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
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
                        <Text style={styles.propertyTitle}>{item.title}</Text>
                        <Text style={styles.propertyPrice}>${item.price} / night</Text>
                        <View style={styles.ratingRow}>
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <Text style={styles.ratingText}>{item.rating} ({item.reviews} reviews)</Text>
                        </View>
                    </View>
                    <Image source={{ uri: item.image }} style={styles.propertyImage} />
                </View>

                {/* Dates Section */}
                <Text style={styles.sectionTitle}>Dates</Text>
                <View style={styles.calendarContainer}>
                    <View style={styles.calendarHeader}>
                        <TouchableOpacity onPress={() => {
                            const newMonth = new Date(currentMonth);
                            newMonth.setMonth(newMonth.getMonth() - 1);
                            setCurrentMonth(newMonth);
                        }}><Ionicons name="chevron-back" size={20} color={colors.dark} /></TouchableOpacity>
                        <Text style={styles.monthTitle}>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</Text>
                        <TouchableOpacity onPress={() => {
                            const newMonth = new Date(currentMonth);
                            newMonth.setMonth(newMonth.getMonth() + 1);
                            setCurrentMonth(newMonth);
                        }}><Ionicons name="chevron-forward" size={20} color={colors.dark} /></TouchableOpacity>
                    </View>

                    <View style={styles.weekdaysRow}>
                        {calendarHeader.map((d, i) => (
                            <Text key={i} style={styles.weekdayText}>{d}</Text>
                        ))}
                    </View>

                    <View style={styles.daysGrid}>
                        {dates.map((d, i) => {
                            const isStart = startDate && d.date.getTime() === startDate.getTime();
                            const isEnd = endDate && d.date.getTime() === endDate.getTime();
                            const selected = d.current && (isStart ? 'start' : isEnd ? 'end' : null);
                            const inRange = d.current && isInRange(d.date);

                            return (
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => handleDatePress(d.day, d.current, d.date)}
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
                    <Text style={styles.priceLabel}>${item.price} x {nightsCount} nights</Text>
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
                    onPress={() => router.push({
                        pathname: '/checkout',
                        params: {
                            id: id as string,
                            type: entityType,
                            title: item.title,
                            image: item.image,
                            checkIn: startDate ? 
                                new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString().split('T')[0] 
                                : new Date().toISOString().split('T')[0],
                            checkOut: endDate ? 
                                new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString().split('T')[0] 
                                : new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split('T')[0],
                            adults: adults.toString(),
                            children: children.toString(),
                            totalPrice: totalPrice.toString()
                        }
                    })}
                >
                    <Text style={styles.bookingButtonText}>Send Booking Request</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};
