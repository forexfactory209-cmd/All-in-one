import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { spacing, typography, colors } from '@/src/theme';
import { useTheme } from '@/src/context/AppContext';

interface ExploreHeaderProps {
    onMapPress?: () => void;
}

export const ExploreHeader: React.FC<ExploreHeaderProps> = ({ onMapPress }) => {
    const router = useRouter();
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>

            <Text style={[styles.title, { color: theme.text }]}>Explore</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={onMapPress} style={[styles.iconButton, { backgroundColor: theme.surfaceSecondary, borderRadius: 12 }]}>
                    <Ionicons name="map-outline" size={24} color={theme.primary} />
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
    },
    iconButton: {
        padding: spacing.xs,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        fontFamily: typography.fontFamily.bold,
    },
});
