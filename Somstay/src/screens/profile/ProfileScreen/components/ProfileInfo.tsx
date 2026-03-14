import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/src/theme';

import { useTheme, useApp } from '@/src/context/AppContext';

import { useRouter } from 'expo-router';

export const ProfileInfo: React.FC = () => {
    const { user } = useApp();
    const theme = useTheme();
    const router = useRouter();

    if (!user) {
        return null; // Don't render anything if no user, overlay handles it
    }

    const avatarUri = user?.profile_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?bg=white&auto=format&fit=crop&w=200&q=80';

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.avatarContainer}>
                <Image
                    source={{ uri: avatarUri }}
                    style={[styles.avatar, { borderColor: theme.border }]}
                />
                <View style={[styles.verifiedBadge, { backgroundColor: theme.success, borderColor: theme.card }]}>
                    <Ionicons name="checkmark" size={12} color="#ffffff" />
                </View>
            </View>

            <Text style={[styles.name, { color: theme.text }]}>{user.full_name}</Text>

            <View style={styles.verifiedRow}>
                <Ionicons name="mail-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.verifiedText, { color: theme.textSecondary, fontWeight: 'normal' }]}>{user.email}</Text>
            </View>
            <View style={styles.verifiedRow}>
                <Ionicons name="call-outline" size={14} color={theme.textSecondary} />
                <Text style={[styles.verifiedText, { color: theme.textSecondary, fontWeight: 'normal' }]}>{user.phone}</Text>
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
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subtext: {
        fontSize: 14,
        marginTop: 4,
        marginBottom: 16,
        textAlign: 'center',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    authButton: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        borderRadius: borderRadius.full,
    },
    authButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        textAlign: 'center',
    },
});
