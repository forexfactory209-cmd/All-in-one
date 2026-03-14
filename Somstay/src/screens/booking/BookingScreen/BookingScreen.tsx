import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator, StatusBar, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { spacing, shadows, colors } from '@/src/theme';
import { useApp, useTheme } from '@/src/context/AppContext';
import { BlurView } from 'expo-blur';
import { LoginModal } from '@/src/components/LoginModal/LoginModal';

// Components
import { BookingHeader } from './components/BookingHeader';
import { BookingTabs } from './components/BookingTabs';
import { BookingCard } from './components/BookingCard';

// Hooks
import { useBookings } from './hooks/useBookings';

export const BookingScreen: React.FC = () => {
    const { settings, user } = useApp();
    const theme = useTheme();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);
    const { bookings, loading } = useBookings();

    const filteredBookings = bookings.filter(booking => {
        // Only show bookings belonging to the current user
        if (!user) return false;
        
        // Debug filtering
        const bookingUserId = (booking as any).user_id;
        console.log(`DEBUG: BookingScreen filtering - BookingID: ${booking.id}, BookingUserID: ${bookingUserId}, CurrentUserID: ${user.id}, Match: ${bookingUserId == user.id}`);
        
        // LOOSE EQUALITY CHECK FOR STRING VS NUMBER
        if (bookingUserId != user.id) return false;
        
        // Check both lowercase and uppercase to match database vs formatted values
        const status = (booking.status || '').toUpperCase();
        if (activeTab === 'upcoming') {
            return status === 'PENDING' || status === 'CONFIRMED';
        } else {
            return status === 'COMPLETED' || status === 'CANCELLED';
        }
    });

    const renderGuestOverlay = () => (
        <View style={StyleSheet.absoluteFill}>
            <BlurView
                intensity={80}
                tint={settings.darkMode ? 'dark' : 'light'}
                style={[StyleSheet.absoluteFill, { justifyContent: 'center', alignItems: 'center', padding: spacing.xl }]}
            >
                <View style={[styles.loginCard, { backgroundColor: theme.card }]}>
                    <View style={[styles.loginIconContainer, { backgroundColor: theme.primary + '15' }]}>
                        <Ionicons name="lock-closed" size={40} color={theme.primary} />
                    </View>
                    <Text style={[styles.loginTitle, { color: theme.text }]}>View Your Bookings</Text>
                    <Text style={[styles.loginSubtitle, { color: theme.textSecondary }]}>
                        Log in or join Somstay to manage your reservations and see your travel history.
                    </Text>
                    
                    <TouchableOpacity 
                        style={[styles.loginButton, { backgroundColor: theme.primary }]}
                        onPress={() => setIsLoginModalVisible(true)}
                    >
                        <Text style={styles.loginButtonText}>Log In</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.joinButton, { borderColor: theme.primary }]}
                        onPress={() => router.push('/signup')}
                    >
                        <Text style={[styles.joinButtonText, { color: theme.primary }]}>Join Somstay</Text>
                    </TouchableOpacity>
                </View>
            </BlurView>
        </View>
    );

    const renderEmptyState = () => (
        <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconContainer, { backgroundColor: theme.primary + '10' }]}>
                <Ionicons name="calendar-outline" size={80} color={theme.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No Bookings Found</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                You haven't made any bookings yet. Start exploring and find your perfect stay!
            </Text>
            <TouchableOpacity 
                style={[styles.bookNowButton, { backgroundColor: theme.primary }]}
                onPress={() => router.push('/(tabs)')}
            >
                <Text style={styles.bookNowText}>Explore Hotels</Text>
            </TouchableOpacity>
        </View>
    );

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
                    ListEmptyComponent={renderEmptyState}
                />
            )}

            {!user && renderGuestOverlay()}

            <LoginModal 
                visible={isLoginModalVisible} 
                onClose={() => setIsLoginModalVisible(false)}
                onLoginSuccess={() => setIsLoginModalVisible(false)}
            />
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
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.xl,
        paddingTop: 60,
    },
    emptyIconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.xl,
    },
    bookNowButton: {
        paddingHorizontal: 40,
        paddingVertical: 16,
        borderRadius: 16,
        ...shadows.medium,
    },
    bookNowText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    loginCard: {
        padding: spacing.xl,
        borderRadius: 24,
        alignItems: 'center',
        width: '100%',
        maxWidth: 340,
        ...shadows.large,
    },
    loginIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    loginTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    loginSubtitle: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.xl,
    },
    loginButton: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
        ...shadows.medium,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    joinButton: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    joinButtonText: {
        fontSize: 16,
        fontWeight: '700',
    }
});
