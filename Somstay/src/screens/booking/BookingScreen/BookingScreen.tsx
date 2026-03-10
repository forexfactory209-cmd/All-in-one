import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spacing } from '@/src/theme';
import { useApp, useTheme } from '@/src/context/AppContext';

// Components
import { BookingHeader } from './components/BookingHeader';
import { BookingTabs } from './components/BookingTabs';
import { BookingCard } from './components/BookingCard';

// Hooks
import { useBookings } from './hooks/useBookings';

export const BookingScreen: React.FC = () => {
    const { settings } = useApp();
    const theme = useTheme();

    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const { bookings, loading } = useBookings();

    const filteredBookings = bookings.filter(booking => {
        if (activeTab === 'upcoming') {
            return booking.status === 'PENDING' || booking.status === 'CONFIRMED';
        } else {
            return booking.status === 'COMPLETED' || booking.status === 'CANCELLED';
        }
    });

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            <StatusBar barStyle={settings.darkMode ? 'light-content' : 'dark-content'} />
            <BookingHeader />
            <BookingTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredBookings}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <BookingCard booking={item} />}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingVertical: 12,
        paddingBottom: 100, // Space for bottom nav
    },
});
