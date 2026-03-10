import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/context/AppContext';
import { styles } from '../styles/CarRentalDetailScreen.styles';

export const RentalTerms: React.FC = () => {
    const theme = useTheme();
    const terms = [
        { icon: 'time-outline', text: 'Minimum 1 day rental', color: '#6366F1' },
        { icon: 'card-outline', text: 'Valid driving license required', color: '#10B981' },
        { icon: 'person-outline', text: 'Driver age must be 21+', color: '#F59E0B' },
        { icon: 'shield-checkmark-outline', text: 'Refundable security deposit', color: '#EC4899' },
        { icon: 'flash-outline', text: 'Clean fuel level on return', color: '#0EA5E9' },
    ];

    return (
        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Rental Terms & Conditions</Text>
            <View style={{ marginTop: 16 }}>
                {terms.map((term, index) => (
                    <View key={index} style={[styles.termItem, { backgroundColor: theme.card, borderColor: theme.border }]}>
                        <View style={[styles.termIconBox, { backgroundColor: term.color + '15' }]}>
                            <Ionicons name={term.icon as any} size={20} color={term.color} />
                        </View>
                        <Text style={[styles.termText, { color: theme.text }]}>{term.text}</Text>
                        <Ionicons name="information-circle-outline" size={18} color={theme.textSecondary} />
                    </View>
                ))}
            </View>
        </View>
    );
};
