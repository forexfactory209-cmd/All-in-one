import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/src/theme';

export const ProfileInfo: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?bg=white&auto=format&fit=crop&w=200&q=80' }}
                    style={styles.avatar}
                />
                <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark" size={12} color={colors.white} />
                </View>
            </View>

            <Text style={styles.name}>Hassan Ali</Text>

            <View style={styles.verifiedRow}>
                <Ionicons name="shield-checkmark-outline" size={14} color={colors.primary} />
                <Text style={styles.verifiedText}>Verified Guest</Text>
            </View>

            <TouchableOpacity style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
        backgroundColor: colors.white,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#F0F0F0',
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#4CAF50',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.white,
    },
    name: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.dark,
        marginBottom: 4,
    },
    verifiedRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: spacing.md,
    },
    verifiedText: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '600',
    },
    editButton: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 2,
        borderColor: colors.primary,
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.primary,
    },
});
