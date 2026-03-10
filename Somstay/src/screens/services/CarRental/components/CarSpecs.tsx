import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/src/context/AppContext';
import { styles } from '../styles/CarRentalDetailScreen.styles';

interface CarSpecsProps {
    seats: number;
    doors: number;
    transmission: string;
    rating?: number;
}

export const CarSpecs: React.FC<CarSpecsProps> = ({ seats, doors, transmission, rating }) => {
    const theme = useTheme();

    return (
        <View style={styles.featuresGrid}>
            <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={[styles.featureIconContainer, { backgroundColor: theme.surfaceSecondary }]}>
                    <Ionicons name="people" size={16} color={theme.primary} />
                </View>
                <Text style={[styles.featureValue, { color: theme.text }]}>{seats || 4}</Text>
                <Text style={[styles.featureLabel, { color: theme.textSecondary }]}>Seats</Text>
            </View>

            <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={[styles.featureIconContainer, { backgroundColor: theme.surfaceSecondary }]}>
                    <Ionicons name="settings" size={16} color={theme.primary} />
                </View>
                <Text style={[styles.featureValue, { color: theme.text }]}>{transmission?.split(' ')[0] || 'Auto'}</Text>
                <Text style={[styles.featureLabel, { color: theme.textSecondary }]}>Gear</Text>
            </View>

            <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={[styles.featureIconContainer, { backgroundColor: theme.surfaceSecondary }]}>
                    <Ionicons name="car-sport" size={16} color={theme.primary} />
                </View>
                <Text style={[styles.featureValue, { color: theme.text }]}>{doors || 4}</Text>
                <Text style={[styles.featureLabel, { color: theme.textSecondary }]}>Doors</Text>
            </View>

            <View style={[styles.featureCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={[styles.featureIconContainer, { backgroundColor: 'rgba(217, 119, 6, 0.1)' }]}>
                    <Ionicons name="star" size={14} color="#D97706" />
                </View>
                <Text style={[styles.featureValue, { color: '#D97706' }]}>{rating || '4.8'}</Text>
                <Text style={[styles.featureLabel, { color: theme.textSecondary }]}>Rating</Text>
            </View>
        </View>
    );
};
