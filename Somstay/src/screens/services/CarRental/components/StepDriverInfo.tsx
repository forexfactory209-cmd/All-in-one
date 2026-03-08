import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/src/theme';

interface StepDriverInfoProps {
    formData: any;
    setFormData: (data: any) => void;
}

export const StepDriverInfo: React.FC<StepDriverInfoProps> = ({ formData, setFormData }) => {
    const handleInputChange = (field: string, value: string) => {
        setFormData({
            ...formData,
            driver_info: {
                ...formData.driver_info,
                [field]: value
            }
        });
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
            <Text style={styles.title}>DRIVER INFO</Text>
            
            <View style={styles.inputGroup}>
                <Text style={styles.label}>FULL LEGAL NAME</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="Enter full name" 
                    value={formData.driver_info.full_name}
                    onChangeText={(t) => handleInputChange('full_name', t)}
                    placeholderTextColor="#94A3B8"
                />
            </View>

            <View style={styles.row}>
                <View style={[styles.inputGroup, { flex: 1.2 }]}>
                    <Text style={styles.label}>MOBILE PHONE</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="+252..." 
                        keyboardType="phone-pad"
                        value={formData.driver_info.phone_number}
                        onChangeText={(t) => handleInputChange('phone_number', t)}
                        placeholderTextColor="#94A3B8"
                    />
                </View>
                <View style={[styles.inputGroup, { flex: 0.8 }]}>
                    <Text style={styles.label}>BIRTH DATE</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="DD/MM/YYYY" 
                        value={formData.driver_info.dob}
                        onChangeText={(t) => handleInputChange('dob', t)}
                        placeholderTextColor="#94A3B8"
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>EMAIL ADDRESS</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="driver@example.com" 
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={formData.driver_info.email}
                    onChangeText={(t) => handleInputChange('email', t)}
                    placeholderTextColor="#94A3B8"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>NATIONALITY</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder="e.g. Somaliland" 
                    value={formData.driver_info.nationality}
                    onChangeText={(t) => handleInputChange('nationality', t)}
                    placeholderTextColor="#94A3B8"
                />
            </View>

            <View style={styles.infoBox}>
                <Ionicons name="information-circle" size={20} color={colors.primary} />
                <Text style={styles.note}>All data is encrypted and handled per international safety standards.</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: spacing.md },
    title: { ...typography.textStyles.h3, color: '#000000', fontWeight: 'bold', marginBottom: 24, fontSize: 32 },
    inputGroup: { marginBottom: 24 },
    label: { ...typography.textStyles.labelSmall, color: '#333333', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8 },
    input: {
        backgroundColor: colors.gray100,
        padding: 20,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.gray200,
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
    },
    row: { flexDirection: 'row', gap: 16 },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        backgroundColor: colors.primary + '10',
        borderRadius: 16,
        marginTop: 8,
    },
    note: { ...typography.textStyles.caption, color: colors.primary, fontWeight: 'bold', flex: 1 },
});
