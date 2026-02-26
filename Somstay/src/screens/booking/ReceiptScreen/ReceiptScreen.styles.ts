import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        padding: 20,
        paddingTop: 15,
        paddingBottom: 60,
    },
    // Custom Header
    screenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: '#FFF',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1A1A',
        flex: 1,
        textAlign: 'center',
        marginRight: 40, // Balance the back button
    },
    backButton: {
        padding: 10,
        backgroundColor: '#F7F8F9',
        borderRadius: 14,
    },
    // Main Receipt Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 35,
    },
    logoContainer: {
        flex: 1.4,
    },
    brandName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0288AC',
    },
    brandSubtitle: {
        fontSize: 10,
        fontWeight: '600',
        color: '#666',
        letterSpacing: 0.5,
    },
    contactInfo: {
        marginTop: 12,
        gap: 4,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    contactText: {
        fontSize: 12,
        color: '#666',
    },
    invoiceInfo: {
        alignItems: 'flex-end',
    },
    statusBadge: {
        backgroundColor: '#E0F2F7',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 12,
    },
    statusText: {
        color: '#0288AC',
        fontSize: 12,
        fontWeight: '700',
    },
    invoiceLabel: {
        fontSize: 9,
        fontWeight: '800',
        color: '#BBB',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    invoiceNumber: {
        fontSize: 14,
        fontWeight: '900',
        color: '#111',
        marginBottom: 16,
    },
    issueDate: {
        fontSize: 14,
        color: '#111',
        fontWeight: '800',
    },
    // Sections
    section: {
        marginTop: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    infoCard: {
        backgroundColor: '#F8F9FA',
        borderRadius: 12,
        padding: 16,
    },
    infoTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    infoSubtitle: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    // Stay Details Blue Card
    stayDetailsCard: {
        backgroundColor: '#F8FBFC',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E1E8EB',
        overflow: 'hidden',
    },
    stayDetailsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 16,
        backgroundColor: '#F4F7F8',
        borderBottomWidth: 1,
        borderBottomColor: '#E1E8EB',
    },
    stayDetailsHeaderText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    stayDetailsContent: {
        padding: 16,
        gap: 16,
    },
    detailItem: {
        gap: 4,
    },
    detailLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#999',
        textTransform: 'uppercase',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0288AC',
    },
    detailValueBlack: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    detailSubValue: {
        fontSize: 13,
        color: '#666',
    },
    // Payment Summary
    paymentSummary: {
        marginTop: 32,
        gap: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    summaryLabel: {
        fontSize: 15,
        color: '#444',
        fontWeight: '600',
    },
    summarySubLabel: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    totalCard: {
        backgroundColor: '#F0F7F9',
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0288AC',
        textTransform: 'uppercase',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0288AC',
    },
    // Footer
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    thanksText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0288AC',
        marginBottom: 8,
    },
    importantInfo: {
        fontSize: 10,
        fontWeight: '700',
        color: '#999',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    disclaimer: {
        fontSize: 11,
        color: '#666',
        textAlign: 'center',
        lineHeight: 16,
        paddingHorizontal: 20,
    },
    // Actions
    actions: {
        marginTop: 32,
        gap: 12,
    },
    downloadBtn: {
        backgroundColor: '#0288AC',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 8,
        gap: 8,
    },
    downloadBtnText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    shareBtn: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E1E8EB',
        gap: 8,
    },
    shareBtnText: {
        color: '#1A1A1A',
        fontSize: 15,
        fontWeight: '700',
    },
});
