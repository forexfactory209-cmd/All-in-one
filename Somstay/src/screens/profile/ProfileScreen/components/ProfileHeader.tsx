import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/src/theme';

export const ProfileHeader: React.FC = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                <Ionicons name="arrow-back" size={24} color={colors.dark} />
            </TouchableOpacity>

            <Text style={styles.title}>Profile</Text>

            <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="share-outline" size={24} color={colors.dark} />
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
