import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/src/theme';
import { styles } from '../styles/CarRentalDetailScreen.styles';

interface CarSpecsProps {
    seats: number;
    doors: number;
    transmission: string;
    rating?: number;
}

export const CarSpecs: React.FC<CarSpecsProps> = ({ seats, doors, transmission, rating }) => {
    return (
        <View style={styles.featuresGrid}>
            <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                    <Ionicons name="people" size={20} color={colors.primary} />
                </View>
                <Text style={styles.featureValue}>{seats || 4}</Text>
                <Text style={styles.featureLabel}>Seats</Text>
            </View>
            <View style={styles.featureCard}>
               <View style={styles.featureIconContainer}>
                    <Ionicons name="settings" size={20} color={colors.primary} />
                </View>
                <Text style={styles.featureValue}>{transmission?.split(' ')[0] || 'Auto'}</Text>
                <Text style={styles.featureLabel}>Gear</Text>
            </View>
            <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                    <Ionicons name="car-sport" size={20} color={colors.primary} />
                </View>
                <Text style={styles.featureValue}>{doors || 4}</Text>
                <Text style={styles.featureLabel}>Doors</Text>
            </View>
            <View style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                    <Ionicons name="star" size={18} color="#D97706" />
                </View>
                <Text style={[styles.featureValue, { color: '#D97706' }]}>{rating || '4.8'}</Text>
                <Text style={styles.featureLabel}>Rating</Text>
            </View>
        </View>
    );
};
