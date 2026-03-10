import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography, shadows } from '@/src/theme';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/src/context/AppContext';

interface StepDocumentsProps {
    formData: any;
    setFormData: (data: any) => void;
}

export const StepDocuments: React.FC<StepDocumentsProps> = ({ formData, setFormData }) => {
    const theme = useTheme();
    const handleInputChange = (field: string, value: string) => {
        setFormData({
            ...formData,
            driver_info: {
                ...formData.driver_info,
                [field]: value
            }
        });
    };

    const pickImage = async (field: string) => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.7,
            });

            if (!result.canceled) {
                handleInputChange(field, result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const takePhoto = async (field: string) => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Camera permission is required');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 0.7,
            });

            if (!result.canceled) {
                handleInputChange(field, result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to take photo');
        }
    };

    const UploadBox = ({ label, icon, field }: { label: string, icon: string, field: string }) => {
        const imageUri = formData.driver_info[field];

        return (
            <TouchableOpacity
                style={[
                    styles.uploadBox,
                    { backgroundColor: theme.card, borderColor: theme.border },
                    imageUri && { borderColor: theme.primary, backgroundColor: theme.primary + '05' }
                ]}
                onPress={() => pickImage(field)}
                activeOpacity={0.8}
            >
                <View style={[styles.uploadIconWrap, { backgroundColor: theme.surfaceSecondary }]}>
                    {imageUri ? (
                        <Image source={{ uri: imageUri }} style={styles.previewImage} />
                    ) : (
                        <Ionicons name={icon as any} size={32} color={theme.primary} />
                    )}
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.uploadLabel, { color: theme.text }]}>{label}</Text>
                    <Text style={[styles.uploadSub, { color: theme.textSecondary }]}>{imageUri ? 'Image selected' : 'Tap to select from gallery'}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.cameraBtn, { backgroundColor: theme.primary }]}
                    onPress={() => takePhoto(field)}
                >
                    <Ionicons name="camera" size={20} color={colors.white} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={[styles.container, { backgroundColor: theme.background }]}>
            <Text style={[styles.title, { color: theme.text }]}>VERIFICATION</Text>

            <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>DRIVER LICENSE NUMBER</Text>
                <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border, paddingHorizontal: 16 }]}>
                    <Ionicons name="card" size={20} color={theme.primary} />
                    <TextInput
                        style={[styles.field, { color: theme.text }]}
                        placeholder="e.g. SLD-12345678"
                        value={formData.driver_info.license_number}
                        onChangeText={(t) => handleInputChange('license_number', t)}
                        placeholderTextColor={theme.textSecondary + '80'}
                    />
                </View>
            </View>

            <View style={styles.grid}>
                <UploadBox label="Driver License" icon="id-card" field="license_photo" />
                <UploadBox label="Passport / ID" icon="person-circle" field="passport_photo" />
                <UploadBox label="Driver Selfie" icon="camera" field="selfie_photo" />
            </View>

            <View style={[styles.warningBox, { backgroundColor: theme.success + '10', borderColor: theme.success + '20' }]}>
                <Ionicons name="shield-checkmark" size={22} color={theme.success} />
                <Text style={[styles.warningNote, { color: theme.success }]}>Your documents are securely stored and verified by our team within 30 minutes.</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingVertical: spacing.md },
    title: {
        ...typography.textStyles.h1,
        marginBottom: spacing.lg,
        fontSize: 28,
    },
    inputGroup: { marginBottom: spacing.xl },
    label: {
        ...typography.textStyles.labelSmall,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: 12
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderRadius: borderRadius.base,
        borderWidth: 1,
        paddingHorizontal: 16,
        ...shadows.small,
    },
    field: {
        flex: 1,
        paddingVertical: 18,
        fontSize: 16,
        fontWeight: '600',
    },
    grid: { gap: 16 },
    uploadBox: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        gap: 16,
        ...shadows.small,
    },
    uploadIconWrap: {
        width: 56,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
    },
    uploadLabel: {
        ...typography.textStyles.body,
        fontWeight: '700',
    },
    uploadSub: {
        ...typography.textStyles.caption,
        marginTop: 2,
        fontWeight: '500'
    },
    cameraBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.medium,
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 18,
        borderRadius: 20,
        marginTop: 24,
        borderWidth: 1,
        marginBottom: 40,
    },
    warningNote: {
        ...typography.textStyles.caption,
        fontWeight: '600',
        flex: 1
    },
});
