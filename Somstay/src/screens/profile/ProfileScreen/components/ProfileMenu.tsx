import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius } from '@/src/theme';

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    isLast?: boolean;
    isLogout?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onPress, isLogout }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={[styles.iconContainer, isLogout && { backgroundColor: '#FFF5F5' }]}>
            <Ionicons name={icon} size={20} color={isLogout ? '#FF5252' : colors.primary} />
        </View>
        <Text style={[styles.label, isLogout && { color: '#FF5252' }]}>{label}</Text>
        {!isLogout && <Ionicons name="chevron-forward" size={18} color="#CCC" />}
    </TouchableOpacity>
);

export const ProfileMenu: React.FC = () => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>ACCOUNT SETTINGS</Text>

            <MenuItem icon="heart-outline" label="My Favorites" onPress={() => { }} />
            <MenuItem icon="calendar-outline" label="My Bookings" onPress={() => router.push('/bookings')} />
            <MenuItem icon="chatbubble-outline" label="Support" onPress={() => { }} />
            <MenuItem icon="notifications-outline" label="Notifications" onPress={() => { }} />
            <MenuItem icon="document-text-outline" label="Privacy & Policy" onPress={() => { }} />
            <MenuItem icon="settings-outline" label="Settings" onPress={() => { }} />
            <MenuItem icon="log-out-outline" label="Logout" onPress={() => { }} isLogout />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: spacing.lg,
        paddingHorizontal: spacing.md,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#999',
        letterSpacing: 0.5,
        marginBottom: spacing.md,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        marginBottom: spacing.xs,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#F0F9FB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    label: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: colors.dark,
    },
});
