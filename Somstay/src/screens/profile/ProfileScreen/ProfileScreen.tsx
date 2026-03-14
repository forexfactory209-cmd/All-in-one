import React from 'react';
import { ScrollView, StyleSheet, StatusBar, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp, useTheme } from '@/src/context/AppContext';
import { BlurView } from 'expo-blur';
import { colors, spacing, borderRadius } from '@/src/theme';
import { useRouter } from 'expo-router';

// Components
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileInfo } from './components/ProfileInfo';
import { ProfileStats } from './components/ProfileStats';
import { ProfileMenu } from './components/ProfileMenu';

export const ProfileScreen: React.FC = () => {
    const { settings, user } = useApp();
    const theme = useTheme();
    const router = useRouter();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            <StatusBar barStyle={settings.darkMode ? 'light-content' : 'dark-content'} />
            <ProfileHeader />
            <View style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    style={{ backgroundColor: theme.background }}
                >
                    <ProfileInfo />
                    <ProfileStats />
                    <ProfileMenu />
                </ScrollView>

                {!user && (
                    <BlurView intensity={25} tint={settings.darkMode ? 'dark' : 'light'} style={styles.blurOverlay}>
                        <View style={[styles.authPromptContainer, { backgroundColor: settings.darkMode ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)' }]}>
                            <Text style={[styles.authTitle, { color: theme.text }]}>Join Somstay</Text>
                            <Text style={[styles.authSubtitle, { color: theme.textSecondary }]}>
                                Log in or sign up to manage your bookings and profile
                            </Text>
                            
                            <TouchableOpacity 
                                style={[styles.authButton, { backgroundColor: colors.primary }]}
                                onPress={() => router.push('/login')}
                            >
                                <Text style={styles.authButtonText}>Log In</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.authButton, { borderColor: colors.primary, borderWidth: 1, marginTop: spacing.sm }]}
                                onPress={() => router.push('/signup')}
                            >
                                <Text style={[styles.authButtonText, { color: colors.primary }]}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </BlurView>
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    blurOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    authPromptContainer: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: spacing.xl,
        borderRadius: borderRadius.large,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 5,
    },
    authTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: spacing.xs,
    },
    authSubtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    authButton: {
        width: '100%',
        height: 56,
        borderRadius: borderRadius.button,
        justifyContent: 'center',
        alignItems: 'center',
    },
    authButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
    },
});
