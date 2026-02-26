import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/src/theme';

export const ProfileStats: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.statCard}>
                <Text style={styles.statValue}>12</Text>
                <Text style={styles.statLabel}>REVIEWS</Text>
            </View>

            <View style={styles.statCard}>
                <Text style={styles.statValue}>45</Text>
                <Text style={styles.statLabel}>FAVORITES</Text>
            </View>

            <View style={styles.statCard}>
                <Text style={styles.statValue}>8</Text>
                <Text style={styles.statLabel}>BOOKINGS</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.lg,
        backgroundColor: colors.white,
    },
    statCard: {
        width: '30%',
        backgroundColor: '#F0F9FB',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.large,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.primary,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#999',
        marginTop: 4,
    },
});
