import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme';
import { styles } from '../styles/CarRentalDetailScreen.styles';

export const RentalTerms: React.FC = () => {
    const terms = [
        { icon: 'time', text: 'Minimum 1 day rental', color: '#6366F1' },
        { icon: 'card', text: 'Valid driving license required', color: '#10B981' },
        { icon: 'person', text: 'Driver age must be 21+', color: '#F59E0B' },
        { icon: 'shield-checkmark', text: 'Refundable security deposit', color: '#EC4899' },
        { icon: 'beaker', text: 'Clean fuel level on return', color: '#0EA5E9' },
    ];

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rental Terms & Conditions</Text>
            <View style={{ marginTop: 16 }}>
                {terms.map((term, index) => (
                    <View key={index} style={styles.termItem}>
                        <View style={[styles.termIconBox, { backgroundColor: term.color + '15' }]}>
                             <Ionicons name={term.icon as any} size={22} color={term.color} />
                        </View>
                        <Text style={styles.termText}>{term.text}</Text>
                        <Ionicons name="information-circle-outline" size={20} color={colors.secondaryText} />
                    </View>
                ))}
            </View>
        </View>
    );
};
