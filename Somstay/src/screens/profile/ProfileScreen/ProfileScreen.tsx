import React from 'react';
import { ScrollView, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp, useTheme } from '@/src/context/AppContext';

// Components
import { ProfileHeader } from './components/ProfileHeader';
import { ProfileInfo } from './components/ProfileInfo';
import { ProfileStats } from './components/ProfileStats';
import { ProfileMenu } from './components/ProfileMenu';

export const ProfileScreen: React.FC = () => {
    const { settings } = useApp();
    const theme = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            <StatusBar barStyle={settings.darkMode ? 'light-content' : 'dark-content'} />
            <ProfileHeader />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                style={{ backgroundColor: theme.background }}
            >
                <ProfileInfo />
                <ProfileStats />
                <ProfileMenu />
            </ScrollView>
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
});
