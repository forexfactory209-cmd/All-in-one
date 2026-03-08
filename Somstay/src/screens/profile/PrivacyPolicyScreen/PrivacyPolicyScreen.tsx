import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet,
    StatusBar, Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, shadows } from '@/src/theme';
import { useApp, useTheme } from '@/src/context/AppContext';

const LAST_UPDATED = 'March 1, 2026';
const LAST_UPDATED_SO = '1-da Maarso, 2026';

const getSections = (lang: string) => [
    {
        icon: 'person-circle-outline' as const,
        title: lang === 'so' ? '1. Macluumaadka Aan Ururinno' : '1. Information We Collect',
        content: lang === 'so'
            ? 'Waxaan ururinaynaa macluumaadka aad si toos ah noogu siisay, oo ay ku jiraan magacaaga, cinwaanka emailka, lambarka telefoonka, macluumaadka lacag-bixinta, iyo xogta shakhsiga marka aad diiwaangelinayso ama isticmayso adeegyadayada.'
            : 'We collect information you provide directly to us, including name, email address, phone number, payment information, and profile data when you register for an account or interact with our services.',
    },
    {
        icon: 'cog-outline' as const,
        title: lang === 'so' ? '2. Sida Aan Xogta U Isticmaallo' : '2. How We Use Your Information',
        content: lang === 'so'
            ? 'Waxaan isticmaalaynaa xogtaada si aan u bixino, u xifaalinno, oo u hormarinno adeegyadayada; si aan u fulino buukinnada; si aan xaqiijinnada buukinka ugu dirno; si aan faallooyin xawaare-heynta ah u dirno; iyo si aan ammaanka iyo dhulnimada madaxyada nagu ah u hubinno.'
            : 'We use your information to provide, maintain, and improve our services; process bookings and payments; send booking confirmations and updates; communicate promotional offers (with your consent); and ensure the security and integrity of our platform.',
    },
    {
        icon: 'shield-half-outline' as const,
        title: lang === 'so' ? '3. Wadaagida Macluumaadka' : '3. Information Sharing',
        content: lang === 'so'
            ? 'Kuma iibiyo xogta shakhsiga ahaaneed ee halabuur kale. Waxaan wadaagi karnaa xogtaada hoteelada iyo mulkiilaha hoteelada si aan buukinnada u dhammaystirinno, macalimiinta lacag-bixinta, iyo adeegeyaasha kale ee naga caawiya maamulista madaxyadeena.'
            : 'We do not sell your personal information to third parties. We may share your information with hotels and property owners to complete your bookings, payment processors to handle transactions, and service providers who assist us in operating our platform.',
    },
    {
        icon: 'lock-closed-outline' as const,
        title: lang === 'so' ? '4. Amniga Xogta' : '4. Data Security',
        content: lang === 'so'
            ? 'Waxaan hirgelinaynaa talaabooyin amni oo warshadaha caadiga ah ah, oo ay ku jiraan SSL encryption, servicirrada ammaan ah, iyo baarista amniga ee joogtada ah si aan u ilaalinno xogta shakhsiga ahaaneed.'
            : 'We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your personal information.',
    },
    {
        icon: 'location-outline' as const,
        title: lang === 'so' ? '5. Xogta Goobta' : '5. Location Data',
        content: lang === 'so'
            ? 'Fasaxkaan, waxaan ururinaynaa oo ka shaqeeynaynaa goobtagaaga si aan hoteelada kuwa eg kuu soo dirsanno, si aan adeegyada khariidada saxda ah u bixinno, iyo si aan natiijada raadinta u hormarinno.'
            : 'With your permission, we collect and process your location to show nearby hotels, provide accurate map services, and improve search results. You can disable location access at any time through your device settings.',
    },
    {
        icon: 'finger-print-outline' as const,
        title: lang === 'so' ? '6. Xuquuqahaaga' : '6. Your Rights',
        content: lang === 'so'
            ? 'Waxaad haystaa xaq aad ku geli karto, ku cusbooneysiin karto, ama ku tirtiri karto xogta shakhsiga ahaaneed ee mar walba. Waxaad ka bixi kartaa xaaladaha faallimaha. Waxaad codsan kartaa nuqul buuxa oo xogtaada ah adigoo la xiriiraya kooxdayada taageerada.'
            : 'You have the right to access, update, or delete your personal information at any time. You can opt-out of promotional communications. You can request a complete copy of your data by contacting our support team.',
    },
    {
        icon: 'phone-portrait-outline' as const,
        title: lang === 'so' ? '7. Cookies & Raacitaanka' : '7. Cookies & Tracking',
        content: lang === 'so'
            ? 'Waxaan isticmaalaynaa cookies iyo tignoolojiyada la mid ah si aan u horumarinno khibradahaaga, u falanqeynno qaababka isticmaalka, iyo u bixinno macluumaad shakhsiyaysan.'
            : 'We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and deliver personalized content.',
    },
    {
        icon: 'refresh-circle-outline' as const,
        title: lang === 'so' ? '8. Isbeddelada Siyaasaddan' : '8. Changes to This Policy',
        content: lang === 'so'
            ? 'Waxaan cusbooneysiin karnaa Siyaasadda Asturnaanta ee mar kasta. Waxaan kugula soo wargelin doonaa isbeddelada muhiimka ah iyada oo loo marayo app-ka ama emailka.'
            : 'We may update this Privacy Policy from time to time. We will notify you of significant changes through the app or via email.',
    },
];

export const PrivacyPolicyScreen: React.FC = () => {
    const router = useRouter();
    const { settings, t } = useApp();
    const theme = useTheme();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

    const sections = getSections(settings.language);
    const toggle = (i: number) => setExpandedIndex(expandedIndex === i ? null : i);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
            <StatusBar barStyle={settings.darkMode ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>{t('privacy_title')}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* Banner */}
                <View style={[styles.banner, { backgroundColor: theme.card }]}>
                    <View style={styles.bannerIcon}>
                        <Ionicons name="shield-checkmark" size={36} color={colors.primary} />
                    </View>
                    <Text style={[styles.bannerTitle, { color: theme.text }]}>{t('your_privacy_matters')}</Text>
                    <Text style={[styles.bannerSub, { color: theme.textSecondary }]}>{t('privacy_hero_sub')}</Text>
                    <View style={[styles.updateBadge, { backgroundColor: theme.surfaceSecondary }]}>
                        <Ionicons name="time-outline" size={13} color={theme.textSecondary} />
                        <Text style={[styles.updateText, { color: theme.textSecondary }]}>
                            {t('last_updated')}: {settings.language === 'so' ? LAST_UPDATED_SO : LAST_UPDATED}
                        </Text>
                    </View>
                </View>

                {/* Sections */}
                <View style={styles.sectionsContainer}>
                    {sections.map((s, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[
                                styles.sectionCard,
                                { backgroundColor: theme.card, borderColor: theme.border },
                                expandedIndex === i && { borderColor: colors.primary + '60' }
                            ]}
                            onPress={() => toggle(i)}
                            activeOpacity={0.85}
                        >
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionIconWrap}>
                                    <Ionicons name={s.icon} size={20} color={colors.primary} />
                                </View>
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>{s.title}</Text>
                                <Ionicons
                                    name={expandedIndex === i ? 'chevron-up' : 'chevron-down'}
                                    size={18}
                                    color={theme.textSecondary}
                                />
                            </View>
                            {expandedIndex === i && (
                                <Text style={[styles.sectionContent, { color: theme.textSecondary, borderTopColor: theme.border }]}>
                                    {s.content}
                                </Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Contact */}
                <View style={[styles.contactSection, { backgroundColor: theme.card }]}>
                    <Text style={[styles.contactTitle, { color: theme.text }]}>
                        {settings.language === 'so' ? 'Su\'aal ma haysataa ee ku saabsan Siyaasadda Asturnaanta?' : 'Questions about our Privacy Policy?'}
                    </Text>
                    <TouchableOpacity
                        style={styles.contactBtn}
                        onPress={() => Linking.openURL('mailto:privacy@somstay.com?subject=Privacy Policy Question')}
                        activeOpacity={0.85}
                    >
                        <Ionicons name="mail-outline" size={18} color={colors.white} />
                        <Text style={styles.contactBtnText}>
                            {settings.language === 'so' ? 'La Xiriir Kooxda Asturnaanta' : 'Contact Privacy Team'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
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
    banner: {
        margin: spacing.md,
        borderRadius: 20,
        padding: spacing.xl,
        alignItems: 'center',
        ...shadows.medium,
    },
    bannerIcon: {
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: colors.primary + '15',
        justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md,
    },
    bannerTitle: { fontSize: 20, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
    bannerSub: { fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: 12 },
    updateBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    },
    updateText: { fontSize: 12 },
    sectionsContainer: { paddingHorizontal: spacing.md, gap: spacing.sm },
    sectionCard: { borderRadius: 16, padding: spacing.md, borderWidth: 1 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    sectionIconWrap: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: colors.primary + '15', justifyContent: 'center', alignItems: 'center',
    },
    sectionTitle: { flex: 1, fontSize: 14, fontWeight: '700' },
    sectionContent: {
        fontSize: 13, lineHeight: 20,
        marginTop: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1,
    },
    contactSection: {
        margin: spacing.md, marginTop: spacing.xl,
        borderRadius: 20, padding: spacing.xl, alignItems: 'center',
        ...shadows.medium,
    },
    contactTitle: { fontSize: 15, fontWeight: '700', textAlign: 'center', marginBottom: spacing.md },
    contactBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: 14,
        borderRadius: 14, ...shadows.medium,
    },
    contactBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});
