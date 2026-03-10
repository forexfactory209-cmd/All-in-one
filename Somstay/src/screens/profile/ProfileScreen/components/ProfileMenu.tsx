import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { colors, spacing, shadows } from '@/src/theme';
import { useApp, useTheme } from '@/src/context/AppContext';
import { notificationService } from '@/src/services/api/notificationService';

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    sublabel?: string;
    onPress: () => void;
    isLogout?: boolean;
    badgeCount?: number;
    theme: any;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, sublabel, onPress, isLogout, badgeCount, theme }) => (
    <TouchableOpacity style={[styles.menuItem, { backgroundColor: 'transparent' }]} onPress={onPress} activeOpacity={0.75}>
        <View style={[
            styles.iconContainer,
            isLogout
                ? { backgroundColor: theme.error + '12' }
                : { backgroundColor: theme.primary + '12' }
        ]}>
            <Ionicons
                name={icon}
                size={20}
                color={isLogout ? theme.error : theme.primary}
            />
        </View>
        <View style={styles.labelContainer}>
            <Text style={[styles.label, { color: isLogout ? theme.error : theme.text }]}>{label}</Text>
            {sublabel ? <Text style={[styles.sublabel, { color: theme.textSecondary }]}>{sublabel}</Text> : null}
        </View>
        {!isLogout && (
            <View style={styles.rightSide}>
                {badgeCount !== undefined && badgeCount > 0 && (
                    <View style={[styles.badge, { backgroundColor: theme.error }]}>
                        <Text style={styles.badgeText}>{badgeCount}</Text>
                    </View>
                )}
                <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
            </View>
        )}
    </TouchableOpacity>
);

export const ProfileMenu: React.FC = () => {
    const router = useRouter();
    const { t, settings } = useApp();
    const theme = useTheme();
    const [unreadCount, setUnreadCount] = useState<number>(0);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const fetchUnread = async () => {
                try {
                    const data = await notificationService.getUnreadCount('1');
                    if (isActive && data && data.success) {
                        setUnreadCount(data.data.unreadCount);
                    }
                } catch (err) {
                    console.error('Failed to fetch unread count:', err);
                }
            };
            fetchUnread();
            return () => { isActive = false; };
        }, [])
    );

    const handleLogout = () => {
        Alert.alert(
            t('logout'),
            t('logout_confirm'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('logout'),
                    style: 'destructive',
                    onPress: () => {
                        router.dismissAll();
                        router.replace('/login');
                    },
                },
            ]
        );
    };

    const divider = <View style={[styles.divider, { backgroundColor: theme.border }]} />;

    return (
        <View style={styles.container}>
            {/* Account Settings Section */}
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>{t('account_settings').toUpperCase()}</Text>
            <View style={[styles.menuCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
                <MenuItem icon="heart-outline" label={t('my_favorites')} sublabel={t('saved_hotels')}
                    onPress={() => Alert.alert(t('my_favorites'), settings.language === 'so' ? 'Dhawaan!' : 'Coming soon!')}
                    theme={theme}
                />
                {divider}
                <MenuItem icon="calendar-outline" label={t('my_bookings')} sublabel={t('view_reservations')}
                    onPress={() => router.push('/(tabs)/bookings')} theme={theme}
                />
                {divider}
                <MenuItem icon="notifications-outline" label={t('notifications')} sublabel={t('manage_alerts')}
                    onPress={() => router.push('/notifications')} badgeCount={unreadCount} theme={theme}
                />
            </View>

            {/* More Section */}
            <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginTop: spacing.xl }]}>
                {settings.language === 'so' ? 'KALE' : 'MORE'}
            </Text>
            <View style={[styles.menuCard, { backgroundColor: theme.card, shadowColor: theme.text }]}>
                <MenuItem icon="chatbubble-ellipses-outline" label={t('help_support')} sublabel={t('chat_email_call')}
                    onPress={() => router.push('/support')} theme={theme}
                />
                {divider}
                <MenuItem icon="document-text-outline" label={t('privacy_policy')} sublabel={t('how_we_handle')}
                    onPress={() => router.push('/privacy-policy')} theme={theme}
                />
                {divider}
                <MenuItem icon="settings-outline" label={t('settings')} sublabel={t('app_preferences')}
                    onPress={() => router.push('/settings')} theme={theme}
                />
            </View>

            {/* Logout */}
            <View style={[styles.logoutCard, { backgroundColor: theme.error + '08', borderColor: theme.error + '25' }]}>
                <MenuItem icon="log-out-outline" label={t('logout')} onPress={handleLogout} isLogout theme={theme} />
            </View>

            {/* App version */}
            <Text style={[styles.version, { color: theme.textSecondary + '40' }]}>{t('somstay_version')}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
    sectionTitle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: spacing.sm },
    menuCard: { borderRadius: 20, overflow: 'hidden', ...shadows.medium },
    logoutCard: {
        borderRadius: 20, overflow: 'hidden',
        marginTop: spacing.xl, borderWidth: 1,
    },
    menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: spacing.md },
    iconContainer: { width: 44, height: 44, borderRadius: 13, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
    labelContainer: { flex: 1 },
    label: { fontSize: 15, fontWeight: '600' },
    sublabel: { fontSize: 12, marginTop: 2 },
    rightSide: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    badge: { width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    badgeText: { color: colors.white, fontSize: 11, fontWeight: '800' },
    divider: { height: 1, marginHorizontal: spacing.md },
    version: { textAlign: 'center', fontSize: 12, marginTop: spacing.xl, marginBottom: spacing.sm },
});
