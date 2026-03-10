import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '@/src/theme';
import { useApp, useTheme } from '@/src/context/AppContext';

export default function TabLayout() {
    const { t } = useApp();
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    // Safe, reliable tab bar height calculation
    // - iOS: 60px base + home indicator (safe area bottom)
    // - Android: 65px base + gesture bar / nav buttons inset
    // The key is to NOT use paddingBottom < insets.bottom, that causes hiding
    const BOTTOM_PADDING = Math.max(insets.bottom, Platform.OS === 'android' ? 12 : 16);
    const TAB_BAR_HEIGHT = 62 + BOTTOM_PADDING;

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
                    height: TAB_BAR_HEIGHT,
                    // paddingBottom MUST be at least insets.bottom so icons aren't hidden under system nav
                    paddingBottom: BOTTOM_PADDING,
                    paddingTop: 10,
                    ...shadows.medium,
                    // Override elevation AFTER spread so Android nav bar doesn't hide tab bar
                    elevation: Platform.OS === 'android' ? 12 : (shadows.medium as any).elevation,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '700',
                    marginTop: 2,
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
                        <View style={[styles.iconContainer, focused && { backgroundColor: colors.primary + '18' }]}>
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
                        <View style={[styles.iconContainer, focused && { backgroundColor: colors.primary + '18' }]}>
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
                        <View style={[styles.iconContainer, focused && { backgroundColor: colors.primary + '18' }]}>
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
                        <View style={[styles.iconContainer, focused && { backgroundColor: colors.primary + '18' }]}>
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
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
