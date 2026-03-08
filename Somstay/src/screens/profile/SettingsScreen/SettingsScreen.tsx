import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet,
    Switch, StatusBar, Alert, Modal, FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, shadows } from '@/src/theme';
import { useApp, useTheme, Language } from '@/src/context/AppContext';

// ─── Helpers ─────────────────────────────────────────────────────────────────
interface SettingRowProps {
    icon: keyof typeof Ionicons.glyphMap;
    iconBg: string;
    iconColor: string;
    title: string;
    subtitle?: string;
    value?: boolean;
    onToggle?: (v: boolean) => void;
    onPress?: () => void;
    rightLabel?: string;
    showArrow?: boolean;
}

const SettingRow: React.FC<SettingRowProps & { theme: any }> = ({
    icon, iconBg, iconColor, title, subtitle,
    value, onToggle, onPress, rightLabel, showArrow = false, theme,
}) => (
    <TouchableOpacity
        style={[styles.settingRow, { backgroundColor: theme.card }]}
        onPress={onPress}
        activeOpacity={onToggle ? 1 : 0.7}
        disabled={!!onToggle && !onPress}
    >
        <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
            <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <View style={styles.settingText}>
            <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
            {subtitle ? <Text style={[styles.settingSub, { color: theme.textSecondary }]}>{subtitle}</Text> : null}
        </View>
        {onToggle !== undefined && value !== undefined ? (
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: '#E5E7EB', true: colors.primary + '50' }}
                thumbColor={value ? colors.primary : '#CBD5E1'}
            />
        ) : rightLabel ? (
            <Text style={[styles.rightLabel, { color: theme.textSecondary }]}>{rightLabel}</Text>
        ) : showArrow ? (
            <Ionicons name="chevron-forward" size={18} color={theme.textSecondary} />
        ) : null}
    </TouchableOpacity>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
export const SettingsScreen: React.FC = () => {
    const router = useRouter();
    const { settings, setDarkMode, setLanguage, setLocationEnabled, t } = useApp();
    const theme = useTheme();

    const [faceId, setFaceId] = useState(true);
    const [savePay, setSavePay] = useState(true);
    const [analytics, setAnalytics] = useState(false);
    const [langModalVisible, setLangModalVisible] = useState(false);

    const languages: { code: Language; label: string; nativeLabel: string }[] = [
        { code: 'en', label: 'English', nativeLabel: 'English' },
        { code: 'so', label: 'Somali', nativeLabel: 'Af-Soomaali' },
    ];

    const handleClearCache = () => {
        Alert.alert(
            t('clear_cache'),
            'This will remove temporary data. Your bookings and account will not be affected.',
            [
                { text: t('cancel'), style: 'cancel' },
                { text: 'Clear', style: 'destructive', onPress: () => Alert.alert(t('success'), 'Cache cleared successfully.') },
            ]
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            `⚠️ ${t('delete_account')}`,
            t('delete_account_sub'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('delete_account'),
                    style: 'destructive',
                    onPress: () => Alert.alert('Request Sent', 'Your account deletion request has been received. Support will contact you within 48 hours.'),
                },
            ]
        );
    };

    const Row = (props: SettingRowProps) => <SettingRow {...props} theme={theme} />;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
            <StatusBar barStyle={settings.darkMode ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>{t('settings_title')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* Appearance */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>{t('appearance')}</Text>
                    <View style={[styles.card, { backgroundColor: theme.card }]}>
                        <Row
                            icon="moon-outline" iconBg="#7C3AED15" iconColor="#7C3AED"
                            title={t('dark_mode')} subtitle={t('dark_mode_sub')}
                            value={settings.darkMode}
                            onToggle={setDarkMode}
                        />
                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        <Row
                            icon="language-outline" iconBg={colors.primary + '15'} iconColor={colors.primary}
                            title={t('language')} subtitle={t('language_sub')}
                            rightLabel={settings.language === 'so' ? 'Af-Soomaali' : 'English'} showArrow
                            onPress={() => setLangModalVisible(true)}
                        />
                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        <Row
                            icon="cash-outline" iconBg="#06A64915" iconColor="#06A649"
                            title={t('currency')} subtitle={t('currency_sub')}
                            rightLabel="USD $" showArrow onPress={() => Alert.alert(t('currency'), 'Currency selection coming soon.')}
                        />
                    </View>
                </View>

                {/* Privacy & Security */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>{t('privacy_security')}</Text>
                    <View style={[styles.card, { backgroundColor: theme.card }]}>
                        <Row
                            icon="finger-print-outline" iconBg="#FF6B3515" iconColor="#FF6B35"
                            title={t('face_id')} subtitle={t('face_id_sub')}
                            value={faceId} onToggle={setFaceId}
                        />
                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        <Row
                            icon="card-outline" iconBg={colors.primary + '15'} iconColor={colors.primary}
                            title={t('save_payment')} subtitle={t('save_payment_sub')}
                            value={savePay} onToggle={setSavePay}
                        />
                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        <Row
                            icon="location-outline" iconBg="#25D36615" iconColor="#25D366"
                            title={t('location_services')} subtitle={t('location_services_sub')}
                            value={settings.locationEnabled}
                            onToggle={(v) => setLocationEnabled(v)}
                        />
                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        <Row
                            icon="bar-chart-outline" iconBg="#7C3AED15" iconColor="#7C3AED"
                            title={t('analytics')} subtitle={t('analytics_sub')}
                            value={analytics} onToggle={setAnalytics}
                        />
                    </View>
                </View>

                {/* Account */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>{t('account')}</Text>
                    <View style={[styles.card, { backgroundColor: theme.card }]}>
                        <Row
                            icon="key-outline" iconBg={colors.primary + '15'} iconColor={colors.primary}
                            title={t('change_password')} showArrow
                            onPress={() => Alert.alert(t('change_password'), 'A reset link will be sent to your email.')}
                        />
                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        <Row
                            icon="trash-outline" iconBg="#FFF0F0" iconColor={colors.error}
                            title={t('clear_cache')} showArrow onPress={handleClearCache}
                        />
                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        <Row
                            icon="download-outline" iconBg="#06A64915" iconColor="#06A649"
                            title={t('download_data')} showArrow
                            onPress={() => Alert.alert(t('download_data'), 'You will receive an email with your data export link within 48 hours.')}
                        />
                    </View>
                </View>

                {/* About */}
                <View style={styles.section}>
                    <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>{t('about')}</Text>
                    <View style={[styles.card, { backgroundColor: theme.card }]}>
                        <Row
                            icon="information-circle-outline" iconBg={colors.primary + '15'} iconColor={colors.primary}
                            title={t('app_version')} rightLabel="v1.0.0"
                        />
                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        <Row
                            icon="star-outline" iconBg="#FFEA0015" iconColor="#FFBE0B"
                            title={t('rate_somstay')} showArrow
                            onPress={() => Alert.alert(t('rate_somstay'), 'Thank you! Rating opens in App Store.')}
                        />
                        <View style={[styles.divider, { backgroundColor: theme.border }]} />
                        <Row
                            icon="share-social-outline" iconBg="#25D36615" iconColor="#25D366"
                            title={t('share_somstay')} showArrow
                            onPress={() => Alert.alert(t('share_somstay'), 'Share functionality coming soon.')}
                        />
                    </View>
                </View>

                {/* Danger Zone */}
                <View style={[styles.section, { marginBottom: 0 }]}>
                    <Text style={[styles.sectionLabel, { color: '#FF4E4E' }]}>{t('danger_zone')}</Text>
                    <TouchableOpacity style={styles.deleteCard} onPress={handleDeleteAccount} activeOpacity={0.85}>
                        <Ionicons name="warning-outline" size={22} color="#FF4E4E" />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.deleteTitle}>{t('delete_account')}</Text>
                            <Text style={styles.deleteSub}>{t('delete_account_sub')}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#FF4E4E" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Language Picker Modal */}
            <Modal
                visible={langModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setLangModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalSheet, { backgroundColor: theme.surface }]}>
                        <View style={styles.modalHandle} />
                        <Text style={[styles.modalTitle, { color: theme.text }]}>{t('language')}</Text>
                        {languages.map((lang) => (
                            <TouchableOpacity
                                key={lang.code}
                                style={[
                                    styles.langOption,
                                    { borderColor: theme.border },
                                    settings.language === lang.code && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }
                                ]}
                                onPress={() => { setLanguage(lang.code); setLangModalVisible(false); }}
                                activeOpacity={0.8}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.langLabel, { color: theme.text }]}>{lang.nativeLabel}</Text>
                                    <Text style={[styles.langSub, { color: theme.textSecondary }]}>{lang.label}</Text>
                                </View>
                                {settings.language === lang.code && (
                                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                                )}
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.modalCancel} onPress={() => setLangModalVisible(false)}>
                            <Text style={[styles.modalCancelText, { color: theme.textSecondary }]}>{t('cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    section: { paddingHorizontal: spacing.md, marginTop: spacing.xl },
    sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, marginBottom: spacing.sm },
    card: {
        borderRadius: 20,
        overflow: 'hidden',
        ...shadows.medium,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: 14,
        gap: spacing.md,
    },
    settingIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    settingText: { flex: 1 },
    settingTitle: { fontSize: 14, fontWeight: '600' },
    settingSub: { fontSize: 12, marginTop: 2 },
    rightLabel: { fontSize: 13, fontWeight: '600' },
    divider: { height: 1, marginHorizontal: spacing.md },
    deleteCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF5F5',
        borderRadius: 16,
        padding: spacing.md,
        gap: spacing.md,
        borderWidth: 1,
        borderColor: '#FFE0E0',
    },
    deleteTitle: { fontSize: 14, fontWeight: '700', color: '#FF4E4E' },
    deleteSub: { fontSize: 12, color: '#FF9090', marginTop: 2 },
    // Language Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
    modalSheet: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: spacing.lg,
        paddingBottom: 36,
    },
    modalHandle: { width: 40, height: 5, backgroundColor: '#D1D5DB', borderRadius: 3, alignSelf: 'center', marginBottom: spacing.md },
    modalTitle: { fontSize: 20, fontWeight: '800', marginBottom: spacing.lg, textAlign: 'center' },
    langOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderRadius: 16,
        borderWidth: 1.5,
        marginBottom: spacing.sm,
    },
    langLabel: { fontSize: 16, fontWeight: '700' },
    langSub: { fontSize: 13, marginTop: 2 },
    modalCancel: { paddingVertical: 14, alignItems: 'center', marginTop: spacing.sm },
    modalCancelText: { fontSize: 15, fontWeight: '600' },
});
