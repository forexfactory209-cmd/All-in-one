import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/src/theme';

interface ExploreHeaderProps {
    onMapPress?: () => void;
}

export const ExploreHeader: React.FC<ExploreHeaderProps> = ({ onMapPress }) => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                <Ionicons name="arrow-back" size={24} color={colors.dark} />
            </TouchableOpacity>

            <Text style={styles.title}>Explore</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={onMapPress} style={[styles.iconButton, { backgroundColor: colors.primary + '10', borderRadius: 12 }]}>
                    <Ionicons name="map-outline" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.white,
    },
    iconButton: {
        padding: spacing.xs,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.dark,
        fontFamily: typography.fontFamily.bold,
    },
});
