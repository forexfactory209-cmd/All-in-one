import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, borderRadius } from '@/src/theme';

import { useTheme } from '@/src/context/AppContext';

export const ProfileStats: React.FC = () => {
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={[styles.statCard, { backgroundColor: theme.surfaceSecondary }]}>
                <Text style={[styles.statValue, { color: theme.primary }]}>12</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>REVIEWS</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.surfaceSecondary }]}>
                <Text style={[styles.statValue, { color: theme.primary }]}>45</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>FAVORITES</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: theme.surfaceSecondary }]}>
                <Text style={[styles.statValue, { color: theme.primary }]}>8</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>BOOKINGS</Text>
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
    },
    statCard: {
        width: '30%',
        paddingVertical: spacing.md,
        borderRadius: borderRadius.large,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 4,
    },
});
