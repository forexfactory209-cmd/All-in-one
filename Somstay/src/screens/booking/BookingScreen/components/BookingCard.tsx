import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/src/theme';

export interface Booking {
    id: string;
    title: string;
    dateRange: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED';
    image: string;
}

interface BookingCardProps {
    booking: Booking;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
    const router = useRouter();
    const getStatusStyle = () => {
        switch (booking.status) {
            case 'PENDING': return { bg: '#FFF9E5', text: '#FFB800' };
            case 'CONFIRMED': return { bg: '#E6F8EF', text: '#06A649' };
            case 'COMPLETED': return { bg: '#0288AC15', text: '#0288AC' };
            default: return { bg: '#F5F5F5', text: '#999' };
        }
    };

    const statusStyle = getStatusStyle();

    return (
        <View style={styles.container}>
            <Image source={{ uri: booking.image }} style={styles.image} resizeMode="cover" />

            <View style={styles.content}>
                <View style={styles.topRow}>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>{booking.status}</Text>
                    </View>
                </View>

                <Text style={styles.title} numberOfLines={1}>{booking.title}</Text>

                <View style={styles.dateRow}>
                    <Ionicons name="calendar-outline" size={14} color="#999" />
                    <Text style={styles.dateText}>{booking.dateRange}</Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => router.push('/receipt')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.buttonText}>
                        {booking.status === 'COMPLETED' ? 'Rebook Villa' : 'View Details'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 24,
        padding: 12,
        marginHorizontal: 16,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 18,
    },
    content: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 6,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: colors.dark,
        marginBottom: 4,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
    },
    dateText: {
        fontSize: 13,
        color: '#999',
        fontWeight: '500',
    },
    button: {
        backgroundColor: '#E6F3F7',
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.primary,
    },
});
