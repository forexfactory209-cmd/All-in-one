import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing } from '@/src/theme';
import { useApp, useTheme } from '@/src/context/AppContext';

export interface Booking {
    id: string;
    title: string;
    dateRange: string;
    status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
    image: string;
    entity_type: string;
    entity_id: number;
}

interface BookingCardProps {
    booking: Booking;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
    const router = useRouter();
    const { t, settings } = useApp();
    const theme = useTheme();

    const getStatusStyle = () => {
        const isDark = settings.darkMode;
        switch (booking.status) {
            case 'PENDING':
                return {
                    bg: isDark ? 'rgba(255, 184, 0, 0.15)' : '#FFF9E5',
                    text: isDark ? '#FFD54F' : '#FFB800'
                };
            case 'CONFIRMED':
                return {
                    bg: isDark ? 'rgba(6, 166, 73, 0.15)' : '#E6F8EF',
                    text: isDark ? '#66BB6A' : '#06A649'
                };
            case 'COMPLETED':
                return {
                    bg: isDark ? 'rgba(2, 136, 172, 0.15)' : '#E6F3F7',
                    text: isDark ? '#4FC3F7' : '#0288AC'
                };
            case 'CANCELLED':
            default:
                return {
                    bg: isDark ? 'rgba(255, 255, 255, 0.1)' : '#F5F5F5',
                    text: isDark ? '#AAAAAA' : '#999'
                };
        }
    };

    const statusStyle = getStatusStyle();

    const translatedStatus = () => {
        if (settings.language === 'so') {
            switch (booking.status) {
                case 'PENDING': return 'HAKAD';
                case 'CONFIRMED': return 'LA XAQIIJIYAY';
                case 'COMPLETED': return 'DHAMMAAD';
                case 'CANCELLED': return 'LAAQAY';
                default: return booking.status;
            }
        }
        return booking.status;
    };

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}
            activeOpacity={0.9}
        >
            <Image source={{ uri: booking.image }} style={styles.image} resizeMode="cover" />

            <View style={styles.content}>
                <View style={styles.topRow}>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>{translatedStatus()}</Text>
                    </View>
                </View>

                <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{booking.title}</Text>

                <View style={styles.dateRow}>
                    <Ionicons name="calendar-outline" size={14} color={theme.textSecondary} />
                    <Text style={[styles.dateText, { color: theme.textSecondary }]}>{booking.dateRange}</Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: theme.surfaceSecondary, flex: 1 }]}
                        onPress={() => router.push({ pathname: '/receipt' as any, params: { bookingId: booking.id } })}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.buttonText, { color: theme.primary }]}>
                            {booking.status === 'COMPLETED' ? t('rebook_villa') || 'Rebook' : t('view_details') || 'Details'}
                        </Text>
                    </TouchableOpacity>

                    {booking.status === 'COMPLETED' && (
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: theme.primary, flex: 1 }]}
                            onPress={() => router.push({
                                pathname: '/write-review' as any,
                                params: {
                                    entityType: booking.entity_type,
                                    entity_id: booking.entity_id,
                                    bookingId: booking.id,
                                    entityName: booking.title
                                }
                            })}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.buttonText, { color: colors.white }]}>
                                {t('leave_review') || 'Review'}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 20,
        padding: 12,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 3,
    },
    image: {
        width: 110,
        height: 110,
        borderRadius: 16,
    },
    content: {
        flex: 1,
        marginLeft: 14,
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
        marginBottom: 4,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
    },
    dateText: {
        fontSize: 12,
        fontWeight: '500',
    },
    button: {
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 13,
        fontWeight: '700',
    },
});
