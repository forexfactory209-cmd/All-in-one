import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/src/theme';

interface StepDocumentsProps {
    formData: any;
    setFormData: (data: any) => void;
}

export const StepDocuments: React.FC<StepDocumentsProps> = ({ formData, setFormData }) => {
    const handleInputChange = (field: string, value: string) => {
        setFormData({
            ...formData,
            driver_info: {
                ...formData.driver_info,
                [field]: value
            }
        });
    };

    const UploadBox = ({ label, icon, field }: { label: string, icon: string, field: string }) => (
        <TouchableOpacity style={styles.uploadBox} activeOpacity={0.8}>
            <View style={styles.uploadIconWrap}>
                 <Ionicons name={icon as any} size={32} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={styles.uploadLabel}>{label}</Text>
                <Text style={styles.uploadSub}>Tap to select or take photo</Text>
            </View>
            <TouchableOpacity style={styles.cameraBtn}>
                <Ionicons name="camera" size={20} color={colors.white} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            <Text style={styles.title}>VERIFICATION</Text>
            
            <View style={styles.inputGroup}>
                <Text style={styles.label}>DRIVER LICENSE NUMBER</Text>
                <View style={[styles.inputContainer, { paddingHorizontal: 20 }]}>
                    <Ionicons name="card" size={20} color={colors.primary} />
                    <TextInput 
                        style={styles.field} 
                        placeholder="e.g. SLD-12345678" 
                        value={formData.driver_info.license_number}
                        onChangeText={(t) => handleInputChange('license_number', t)}
                        placeholderTextColor="#94A3B8"
                    />
                </View>
            </View>

            <View style={styles.grid}>
                <UploadBox label="Driver License" icon="id-card" field="license_photo" />
                <UploadBox label="Passport / ID" icon="person-circle" field="identity_photo" />
                <UploadBox label="Driver Selfie" icon="camera" field="selfie_photo" />
            </View>

            <View style={styles.warningBox}>
                <Ionicons name="shield-checkmark" size={22} color={colors.success} />
                <Text style={styles.warningNote}>Your documents are securely stored and verified by our team within 30 minutes.</Text>
            </View>
        </ScrollView>
    );
};

// Internal minimal TextInput to avoid import mess if possible, 
// though normally it's imported at top.
import { TextInput } from 'react-native';

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: spacing.md },
    title: { ...typography.textStyles.h3, color: '#000000', fontWeight: 'bold', marginBottom: 24, fontSize: 32 },
    inputGroup: { marginBottom: 24 },
    label: { ...typography.textStyles.labelSmall, color: '#333333', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: colors.gray100,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.gray200,
    },
    field: {
        flex: 1,
        paddingVertical: 20,
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
    },
    grid: { gap: 16 },
    uploadBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.white,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: colors.gray200,
        gap: 16,
        ...shadows.small,
    },
    uploadIconWrap: {
        width: 64,
        height: 64,
        backgroundColor: colors.primary + '10',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadLabel: { ...typography.textStyles.label, color: '#000000', fontWeight: 'bold', fontSize: 16 },
    uploadSub: { ...typography.textStyles.caption, color: '#333333', marginTop: 2, fontWeight: 'bold' },
    cameraBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.medium,
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 20,
        backgroundColor: colors.success + '10',
        borderRadius: 24,
        marginTop: 24,
        borderWidth: 1,
        borderColor: colors.success + '20',
        marginBottom: 40,
    },
    warningNote: { ...typography.textStyles.caption, color: colors.success, fontWeight: 'bold', flex: 1 },
});
