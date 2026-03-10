import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { spacing, typography } from '@/src/theme';

import { useTheme } from '@/src/context/AppContext';

export const ProfileHeader: React.FC = () => {
    const router = useRouter();
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                <Ionicons name="arrow-back" size={24} color={theme.text} />
            </TouchableOpacity>

            <Text style={[styles.title, { color: theme.text }]}>Profile</Text>

            <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="share-outline" size={24} color={theme.text} />
            </TouchableOpacity>
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
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        fontFamily: typography.fontFamily.bold,
    },
});
