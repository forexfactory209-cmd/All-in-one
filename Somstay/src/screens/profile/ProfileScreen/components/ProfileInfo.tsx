import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/src/theme';

import { useTheme } from '@/src/context/AppContext';

export const ProfileInfo: React.FC = () => {
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.avatarContainer}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?bg=white&auto=format&fit=crop&w=200&q=80' }}
                    style={[styles.avatar, { borderColor: theme.border }]}
                />
                <View style={[styles.verifiedBadge, { backgroundColor: theme.success, borderColor: theme.card }]}>
                    <Ionicons name="checkmark" size={12} color="#ffffff" />
                </View>
            </View>

            <Text style={[styles.name, { color: theme.text }]}>Hassan Ali</Text>

            <View style={styles.verifiedRow}>
                <Ionicons name="shield-checkmark-outline" size={14} color={theme.primary} />
                <Text style={[styles.verifiedText, { color: theme.primary }]}>Verified Guest</Text>
            </View>

            <TouchableOpacity style={[styles.editButton, { borderColor: theme.primary, backgroundColor: theme.primary + '10' }]}>
                <Text style={[styles.editButtonText, { color: theme.primary }]}>Edit Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
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
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    name: {
        fontSize: 22,
        fontWeight: '700',
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
        fontWeight: '600',
    },
    editButton: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 2,
    },
    editButtonText: {
        fontSize: 16,
        fontWeight: '700',
    },
});
