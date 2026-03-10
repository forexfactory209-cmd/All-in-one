import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, shadows } from '@/src/theme';
import { useApp, useTheme } from '@/src/context/AppContext';

import { notificationService } from '@/src/services/api/notificationService';

const iconColorMap: Record<string, { bg: string; color: string; icon: string }> = {
    booking: { bg: colors.primary + '15', color: colors.primary, icon: 'calendar-outline' },
    promo: { bg: '#FF6B3515', color: '#FF6B35', icon: 'pricetag-outline' },
    system: { bg: '#06A64915', color: '#06A649', icon: 'shield-checkmark-outline' },
    inapp: { bg: colors.primary + '15', color: colors.primary, icon: 'notifications-outline' },
};

export const NotificationsScreen: React.FC = () => {
    const router = useRouter();
    const { settings, t } = useApp();
    const theme = useTheme();
    const [notifs, setNotifs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [prefs, setPrefs] = useState({
        push_enabled: true,
        email_enabled: true,
        sms_enabled: false,
        promotions_enabled: false,
    });

    const fetchNotificationsAndSettings = async () => {
        try {
            setLoading(true);
            const [notifData, settingsData] = await Promise.all([
                notificationService.getNotifications('1'),
                notificationService.getSettings('1')
            ]);

            if (notifData && notifData.success) {
                setNotifs(notifData.data);
            }
            if (settingsData && settingsData.success && settingsData.data) {
                setPrefs({
                    push_enabled: !!settingsData.data.push_enabled,
                    email_enabled: !!settingsData.data.email_enabled,
                    sms_enabled: !!settingsData.data.sms_enabled,
                    promotions_enabled: !!settingsData.data.promotions_enabled,
                });
            }
        } catch (error) {
            console.error('Error fetching notifications or settings:', error);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchNotificationsAndSettings();
    }, []);

    const setPref = (key: keyof typeof prefs) => async (val: boolean) => {
        // Optimistic UI Update
        const newPrefs = { ...prefs, [key]: val };
        setPrefs(newPrefs);

        // Sync with backend
        try {
            await notificationService.updateSettings('1', newPrefs);
        } catch (error) {
            console.error('Failed to update settings:', error);
            // Rollback if failed
            setPrefs(prefs);
        }
    };

    const handleMarkAsRead = async (id: string | number) => {
        try {
            await notificationService.markAsRead(id.toString(), '1');
            setNotifs(notifs.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const markAllRead = async () => {
        try {
            await notificationService.markAllAsRead('1');
            setNotifs(notifs.map(n => ({ ...n, read_at: new Date().toISOString() })));
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    const unreadCount = notifs.filter(n => !n.read_at).length;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
            <StatusBar barStyle={settings.darkMode ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={[styles.headerTitle, { color: theme.text }]}>{t('notifications_title')}</Text>
                    {unreadCount > 0 && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{unreadCount}</Text>
                        </View>
                    )}
                </View>
                <TouchableOpacity onPress={markAllRead}>
                    <Text style={styles.markAll}>{t('mark_all_read')}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* Recent Notifications */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>{t('recent').toUpperCase()}</Text>

                    {loading ? (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: theme.textSecondary }}>Loading notifications...</Text>
                        </View>
                    ) : notifs.length === 0 ? (
                        <View style={{ padding: 20, alignItems: 'center' }}>
                            <Text style={{ color: theme.textSecondary }}>No new notifications available.</Text>
                        </View>
                    ) : (
                        <View style={[styles.card, { backgroundColor: theme.card }]}>
                            {notifs.map((n, i) => {
                                const c = iconColorMap[n.type?.toLowerCase()] || iconColorMap.inapp;
                                const isRead = !!n.read_at;
                                return (
                                    <TouchableOpacity
                                        key={n.id}
                                        style={[
                                            styles.notifRow,
                                            !isRead && { backgroundColor: colors.primary + '06' },
                                            i < notifs.length - 1 && [styles.notifBorder, { borderBottomColor: theme.border }],
                                        ]}
                                        onPress={() => !isRead && handleMarkAsRead(n.id)}
                                        activeOpacity={0.8}
                                    >
                                        <View style={[styles.notifIcon, { backgroundColor: c.bg }]}>
                                            <Ionicons name={c.icon as any} size={20} color={c.color} />
                                        </View>
                                        <View style={styles.notifText}>
                                            <View style={styles.notifTitleRow}>
                                                <Text style={[styles.notifTitle, { color: theme.text }]}>{n.title}</Text>
                                                {!isRead && <View style={styles.unreadDot} />}
                                            </View>
                                            <Text style={[styles.notifBody, { color: theme.textSecondary }]} numberOfLines={2}>{n.message}</Text>
                                            <Text style={styles.notifTime}>
                                                {new Date(n.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>

                {/* Preferences */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>{t('notification_preferences').toUpperCase()}</Text>
                    <View style={[styles.card, { backgroundColor: theme.card }]}>
                        {[
                            { key: 'push_enabled', icon: 'notifications-outline', bg: colors.primary + '15', color: colors.primary, title: 'Push Notifications', sub: 'Receive app push notifications' },
                            { key: 'email_enabled', icon: 'mail-outline', bg: '#06A64915', color: '#06A649', title: 'Email Alerts', sub: 'Receive updates via email' },
                            { key: 'sms_enabled', icon: 'chatbubble-outline', bg: '#7C3AED15', color: '#7C3AED', title: 'SMS Reminders', sub: 'Urgent booking texts to your phone' },
                            { key: 'promotions_enabled', icon: 'pricetag-outline', bg: '#FF6B3515', color: '#FF6B35', title: 'Promotions & Offers', sub: 'Get notified about discounts' }
                        ].map((item, i, arr) => (
                            <View key={item.key}>
                                <View style={styles.toggleRow}>
                                    <View style={[styles.toggleIcon, { backgroundColor: item.bg }]}>
                                        <Ionicons name={item.icon as any} size={20} color={item.color} />
                                    </View>
                                    <View style={styles.toggleText}>
                                        <Text style={[styles.toggleTitle, { color: theme.text }]}>{item.title}</Text>
                                        <Text style={[styles.toggleSub, { color: theme.textSecondary }]}>{item.sub}</Text>
                                    </View>
                                    <Switch
                                        value={prefs[item.key as keyof typeof prefs]}
                                        onValueChange={setPref(item.key as keyof typeof prefs)}
                                        trackColor={{ false: '#E5E7EB', true: colors.primary + '50' }}
                                        thumbColor={prefs[item.key as keyof typeof prefs] ? colors.primary : '#CBD5E1'}
                                    />
                                </View>
                                {i < arr.length - 1 && <View style={[styles.divider, { backgroundColor: theme.border }]} />}
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1,
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    badge: {
        backgroundColor: colors.error, width: 20, height: 20,
        borderRadius: 10, justifyContent: 'center', alignItems: 'center',
    },
    badgeText: { color: colors.white, fontSize: 11, fontWeight: '800' },
    markAll: { fontSize: 13, fontWeight: '600', color: colors.primary },
    section: { paddingHorizontal: spacing.md, marginTop: spacing.xl },
    sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: spacing.sm },
    card: { borderRadius: 20, overflow: 'hidden', ...shadows.medium },
    notifRow: { flexDirection: 'row', padding: spacing.md, alignItems: 'flex-start', gap: spacing.sm },
    notifBorder: { borderBottomWidth: 1 },
    notifIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    notifText: { flex: 1 },
    notifTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
    notifTitle: { fontSize: 14, fontWeight: '700' },
    unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
    notifBody: { fontSize: 13, lineHeight: 18 },
    notifTime: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
    divider: { height: 1, marginHorizontal: spacing.md },
    toggleRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: spacing.md, paddingVertical: 14, gap: spacing.md,
    },
    toggleIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    toggleText: { flex: 1 },
    toggleTitle: { fontSize: 14, fontWeight: '600' },
    toggleSub: { fontSize: 12, marginTop: 2 },
});
