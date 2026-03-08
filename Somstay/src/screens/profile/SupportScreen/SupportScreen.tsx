import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, StyleSheet,
    Linking, TextInput, Alert, StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, borderRadius, shadows } from '@/src/theme';

const SUPPORT_EMAIL = 'support@somstay.com';
const SUPPORT_PHONE = '+252 63 3805130';
const WHATSAPP_NUMBER = '+252633805130';

interface SupportOptionProps {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle: string;
    color: string;
    bg: string;
    onPress: () => void;
}

const SupportOption: React.FC<SupportOptionProps> = ({ icon, title, subtitle, color, bg, onPress }) => (
    <TouchableOpacity style={[styles.optionCard, { borderLeftColor: color }]} onPress={onPress} activeOpacity={0.8}>
        <View style={[styles.optionIcon, { backgroundColor: bg }]}>
            <Ionicons name={icon} size={24} color={color} />
        </View>
        <View style={styles.optionText}>
            <Text style={styles.optionTitle}>{title}</Text>
            <Text style={styles.optionSubtitle}>{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#C9CED4" />
    </TouchableOpacity>
);

const faqs = [
    {
        q: 'How do I cancel a booking?',
        a: 'Go to My Bookings in your Profile, select the booking you want to cancel, and press "Cancel Booking". Refunds are processed within 3-5 business days.',
    },
    {
        q: 'How do I change my check-in date?',
        a: 'Contact the hotel directly through the in-app chat or email support@somstay.com with your booking ID and new preferred dates.',
    },
    {
        q: 'What payment methods are accepted?',
        a: 'We accept major credit/debit cards, mobile money (EVC Plus, Zaad), and bank transfers.',
    },
    {
        q: 'How do I leave a review?',
        a: 'After checkout, you will receive a notification prompting you to rate your stay. You can also visit the hotel page and tap "Write a Review".',
    },
    {
        q: 'Is my payment information secure?',
        a: 'Yes. All transactions are encrypted using industry-standard SSL. We do not store your full card details on our servers.',
    },
];

const FAQItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
    const [open, setOpen] = useState(false);
    return (
        <View style={styles.faqItem}>
            <TouchableOpacity style={styles.faqQuestion} onPress={() => setOpen(!open)} activeOpacity={0.8}>
                <Text style={styles.faqQ}>{q}</Text>
                <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={colors.primary} />
            </TouchableOpacity>
            {open && <Text style={styles.faqA}>{a}</Text>}
        </View>
    );
};

export const SupportScreen: React.FC = () => {
    const router = useRouter();
    const [message, setMessage] = useState('');

    const handleEmail = () => Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Support Request`);
    const handleCall = () => Linking.openURL(`tel:${SUPPORT_PHONE}`);
    const handleWhatsApp = () => Linking.openURL(`https://wa.me/${WHATSAPP_NUMBER}?text=Hello Somstay Support, I need help with...`);

    const handleSendMessage = () => {
        if (!message.trim()) {
            Alert.alert('Empty Message', 'Please write a message before sending.');
            return;
        }
        Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=In-App Support Request&body=${encodeURIComponent(message)}`);
        setMessage('');
        Alert.alert('Message Sent!', "We'll get back to you within 24 hours.");
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Support</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

                {/* Hero Banner */}
                <View style={styles.heroBanner}>
                    <View style={styles.heroIcon}>
                        <Ionicons name="headset-outline" size={40} color={colors.primary} />
                    </View>
                    <Text style={styles.heroTitle}>We're here to help</Text>
                    <Text style={styles.heroSub}>Our support team is available 24/7 to assist you with any questions</Text>
                </View>

                {/* Contact Options */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>CONTACT US</Text>

                    <SupportOption
                        icon="chatbubbles-outline"
                        title="Live Chat"
                        subtitle="Chat with us on WhatsApp"
                        color="#25D366"
                        bg="#25D36615"
                        onPress={handleWhatsApp}
                    />
                    <SupportOption
                        icon="mail-outline"
                        title="Email Support"
                        subtitle={SUPPORT_EMAIL}
                        color={colors.primary}
                        bg={colors.primary + '15'}
                        onPress={handleEmail}
                    />
                    <SupportOption
                        icon="call-outline"
                        title="Call Us"
                        subtitle={SUPPORT_PHONE}
                        color="#FF6B35"
                        bg="#FF6B3515"
                        onPress={handleCall}
                    />
                </View>

                {/* In-App Message */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>SEND A MESSAGE</Text>
                    <View style={styles.messageCard}>
                        <TextInput
                            style={styles.messageInput}
                            placeholder="Describe your issue or question..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={4}
                            value={message}
                            onChangeText={setMessage}
                            textAlignVertical="top"
                        />
                        <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage} activeOpacity={0.85}>
                            <Ionicons name="send" size={18} color={colors.white} />
                            <Text style={styles.sendBtnText}>Send Message</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* FAQs */}
                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>FREQUENTLY ASKED QUESTIONS</Text>
                    <View style={styles.faqCard}>
                        {faqs.map((item, i) => (
                            <FAQItem key={i} q={item.q} a={item.a} />
                        ))}
                    </View>
                </View>

                {/* Operating Hours */}
                <View style={[styles.section, { marginBottom: 0 }]}>
                    <Text style={styles.sectionLabel}>OPERATING HOURS</Text>
                    <View style={styles.hoursCard}>
                        {[
                            { day: 'Monday – Friday', hours: '8:00 AM – 8:00 PM' },
                            { day: 'Saturday', hours: '9:00 AM – 6:00 PM' },
                            { day: 'Sunday', hours: '10:00 AM – 4:00 PM' },
                            { day: 'WhatsApp / Email', hours: '24/7' },
                        ].map((row, i) => (
                            <View key={i} style={[styles.hoursRow, i < 3 && styles.hoursRowBorder]}>
                                <Text style={styles.hoursDay}>{row.day}</Text>
                                <Text style={styles.hoursTime}>{row.hours}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F8FA' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray200,
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: colors.dark },
    heroBanner: {
        backgroundColor: colors.white,
        margin: spacing.md,
        borderRadius: 20,
        padding: spacing.xl,
        alignItems: 'center',
        ...shadows.medium,
    },
    heroIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    heroTitle: { fontSize: 22, fontWeight: '800', color: colors.dark, marginBottom: 8 },
    heroSub: { fontSize: 14, color: '#7C7C7C', textAlign: 'center', lineHeight: 20 },
    section: { paddingHorizontal: spacing.md, marginBottom: spacing.xl },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 0.8,
        marginBottom: spacing.sm,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderLeftWidth: 3,
        ...shadows.small,
    },
    optionIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    optionText: { flex: 1 },
    optionTitle: { fontSize: 15, fontWeight: '700', color: colors.dark },
    optionSubtitle: { fontSize: 13, color: '#7C7C7C', marginTop: 2 },
    messageCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: spacing.md,
        ...shadows.medium,
    },
    messageInput: {
        minHeight: 100,
        fontSize: 14,
        color: colors.dark,
        backgroundColor: '#F7F8F9',
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    sendBtn: {
        backgroundColor: colors.primary,
        borderRadius: 14,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        ...shadows.medium,
    },
    sendBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
    faqCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        overflow: 'hidden',
        ...shadows.medium,
    },
    faqItem: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    faqQuestion: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: spacing.md,
        gap: spacing.sm,
    },
    faqQ: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.dark, lineHeight: 20 },
    faqA: { fontSize: 13, color: '#6B7280', lineHeight: 20, paddingHorizontal: spacing.md, paddingBottom: spacing.md },
    hoursCard: {
        backgroundColor: colors.white,
        borderRadius: 20,
        overflow: 'hidden',
        ...shadows.medium,
    },
    hoursRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: 14,
    },
    hoursRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
    hoursDay: { fontSize: 14, fontWeight: '600', color: colors.dark },
    hoursTime: { fontSize: 14, color: colors.primary, fontWeight: '700' },
});
