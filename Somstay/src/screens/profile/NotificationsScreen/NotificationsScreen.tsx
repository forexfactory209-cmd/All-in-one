import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, shadows } from '@/src/theme';
import { useApp, useTheme } from '@/src/context/AppContext';

const getNotifications = (lang: string) => [
    {
        id: '1', type: 'booking',
        icon: 'calendar-outline' as const,
        title: lang === 'so' ? 'Buukinka Waa La Xaqiijiyay' : 'Booking Confirmed',
        body: lang === 'so'
            ? 'Buukinkaa hoteelka Mansoor Palace waa la xaqiijiyay Oct 12–15'
            : 'Your booking at Mansoor Palace Hotel has been confirmed for Oct 12–15.',
        time: lang === 'so' ? '2 saac kahor' : '2 hours ago', read: false,
    },
    {
        id: '2', type: 'promo',
        icon: 'pricetag-outline' as const,
        title: lang === 'so' ? 'Xawaaraha Toddobaadka 🎉' : 'Weekend Special 🎉',
        body: lang === 'so'
            ? 'Hel %20 oo dhimo dhammaan hoteelada Hargeysa toddobaadkan!'
            : 'Get 20% off on all hotels in Hargeisa this weekend only!',
        time: lang === 'so' ? '5 saac kahor' : '5 hours ago', read: false,
    },
    {
        id: '3', type: 'system',
        icon: 'shield-checkmark-outline' as const,
        title: lang === 'so' ? 'Cusbooneysiinta Amniga' : 'Security Update',
        body: lang === 'so'
            ? 'Furimaha sirta akawntigaaga si guul ah ayaa loo beddeley.'
            : 'Your account password was changed successfully.',
        time: lang === 'so' ? 'Shalay' : 'Yesterday', read: true,
    },
    {
        id: '4', type: 'booking',
        icon: 'star-outline' as const,
        title: lang === 'so' ? 'Qii Joogitaankaaga' : 'Rate Your Stay',
        body: lang === 'so'
            ? 'Sideed u martiqaadsatay hoteelka Beder? Kala wadaag khibradahaaga.'
            : 'How was your stay at Beder Hotel? Share your experience.',
        time: lang === 'so' ? '3 maalmood kahor' : '3 days ago', read: true,
    },
];

const iconColorMap: Record<string, { bg: string; color: string }> = {
    booking: { bg: colors.primary + '15', color: colors.primary },
    promo: { bg: '#FF6B3515', color: '#FF6B35' },
    system: { bg: '#06A64915', color: '#06A649' },
};

export const NotificationsScreen: React.FC = () => {
    const router = useRouter();
    const { settings, t } = useApp();
    const theme = useTheme();
    const [notifs, setNotifs] = useState(() => getNotifications(settings.language));
    const [prefs, setPrefs] = useState({
        bookingUpdates: true,
        promotions: true,
        priceAlerts: false,
        appUpdates: true,
        reminders: true,
    });

    const setPref = (key: keyof typeof prefs) => (val: boolean) =>
        setPrefs(prev => ({ ...prev, [key]: val }));

    const markAllRead = () => setNotifs(notifs.map(n => ({ ...n, read: true })));
    const unreadCount = notifs.filter(n => !n.read).length;

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
                    <View style={[styles.card, { backgroundColor: theme.card }]}>
                        {notifs.map((n, i) => {
                            const c = iconColorMap[n.type] || iconColorMap.system;
                            return (
                                <TouchableOpacity
                                    key={n.id}
                                    style={[
                                        styles.notifRow,
                                        !n.read && { backgroundColor: colors.primary + '06' },
                                        i < notifs.length - 1 && [styles.notifBorder, { borderBottomColor: theme.border }],
                                    ]}
                                    onPress={() => setNotifs(notifs.map(x => x.id === n.id ? { ...x, read: true } : x))}
                                    activeOpacity={0.8}
                                >
                                    <View style={[styles.notifIcon, { backgroundColor: c.bg }]}>
                                        <Ionicons name={n.icon} size={20} color={c.color} />
                                    </View>
                                    <View style={styles.notifText}>
                                        <View style={styles.notifTitleRow}>
                                            <Text style={[styles.notifTitle, { color: theme.text }]}>{n.title}</Text>
                                            {!n.read && <View style={styles.unreadDot} />}
                                        </View>
                                        <Text style={[styles.notifBody, { color: theme.textSecondary }]} numberOfLines={2}>{n.body}</Text>
                                        <Text style={styles.notifTime}>{n.time}</Text>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* Preferences */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>{t('notification_preferences').toUpperCase()}</Text>
                    <View style={[styles.card, { backgroundColor: theme.card }]}>
                        {[
                            { key: 'bookingUpdates', icon: 'calendar-outline', bg: colors.primary + '15', color: colors.primary, titleKey: 'booking_updates', subKey: 'booking_updates_sub' },
                            { key: 'promotions', icon: 'pricetag-outline', bg: '#FF6B3515', color: '#FF6B35', titleKey: 'promotions', subKey: 'promotions_sub' },
                            { key: 'priceAlerts', icon: 'trending-down-outline', bg: '#06A64915', color: '#06A649', titleKey: 'price_alerts', subKey: 'price_alerts_sub' },
                            { key: 'reminders', icon: 'notifications-outline', bg: '#7C3AED15', color: '#7C3AED', titleKey: 'reminders', subKey: 'reminders_sub' },
                            { key: 'appUpdates', icon: 'phone-portrait-outline', bg: '#0288AC15', color: colors.primary, titleKey: 'app_updates', subKey: 'app_updates_sub' },
                        ].map((item, i, arr) => (
                            <View key={item.key}>
                                <View style={styles.toggleRow}>
                                    <View style={[styles.toggleIcon, { backgroundColor: item.bg }]}>
                                        <Ionicons name={item.icon as any} size={20} color={item.color} />
                                    </View>
                                    <View style={styles.toggleText}>
                                        <Text style={[styles.toggleTitle, { color: theme.text }]}>{t(item.titleKey)}</Text>
                                        <Text style={[styles.toggleSub, { color: theme.textSecondary }]}>{t(item.subKey)}</Text>
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
