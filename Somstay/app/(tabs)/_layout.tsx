import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '@/src/theme';
import { useApp, useTheme } from '@/src/context/AppContext';

export default function TabLayout() {
    const { t } = useApp();
    const theme = useTheme();
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: theme.textSecondary,
                tabBarStyle: {
                    backgroundColor: theme.card,
                    borderTopWidth: 1,
                    borderTopColor: theme.border,
                    height: 70, // Slightly taller to accommodate the circle
                    paddingBottom: 10,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '700',
                    marginTop: 4, // Adjust spacing from icon
                },
                tabBarIconStyle: {
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                tabBarHideOnKeyboard: true,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: t('home'),
                    tabBarIcon: ({ focused, color, size }) => (
                        <View style={[styles.iconContainer, focused && styles.activeIconCircle]}>
                            <Ionicons name={focused ? "home" : "home-outline"} size={focused ? 24 : 22} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: t('explore'),
                    tabBarIcon: ({ focused, color, size }) => (
                        <View style={[styles.iconContainer, focused && styles.activeIconCircle]}>
                            <Ionicons name={focused ? "search" : "search-outline"} size={focused ? 24 : 22} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="bookings"
                options={{
                    title: t('booking'),
                    tabBarIcon: ({ focused, color, size }) => (
                        <View style={[styles.iconContainer, focused && styles.activeIconCircle]}>
                            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={focused ? 24 : 22} color={color} />
                        </View>
                    ),
                }}
            />
            <Tabs.Screen
                name="account"
                options={{
                    title: t('profile'),
                    tabBarIcon: ({ focused, color, size }) => (
                        <View style={[styles.iconContainer, focused && styles.activeIconCircle]}>
                            <Ionicons name={focused ? "person" : "person-outline"} size={focused ? 24 : 22} color={color} />
                        </View>
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        // marginBottom: ,
    },
    activeIconCircle: {
        backgroundColor: colors.primary + '1A', // Subtle primary tint
    },
});
