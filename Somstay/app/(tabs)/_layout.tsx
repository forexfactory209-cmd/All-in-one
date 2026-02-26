import { Tabs } from 'expo-router';
import { BottomNavigation } from '@/src/components/BottomNavigation';
import React from 'react';

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => (
                <BottomNavigation
                    activeTab={props.state.routes[props.state.index].name}
                    onTabPress={(tabId) => props.navigation.navigate(tabId)}
                />
            )}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen name="index" options={{ title: 'Home' }} />
            <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
            <Tabs.Screen name="bookings" options={{ title: 'Bookings' }} />
            <Tabs.Screen name="account" options={{ title: 'Account' }} />
        </Tabs>
    );
}
