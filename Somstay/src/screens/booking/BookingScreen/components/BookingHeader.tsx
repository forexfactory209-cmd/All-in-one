import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { spacing } from '@/src/theme';
import { useApp, useTheme } from '@/src/context/AppContext';

export const BookingHeader: React.FC = () => {
    const router = useRouter();
    const { t } = useApp();
    const theme = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
                <Ionicons name="chevron-back" size={24} color={theme.text} />
            </TouchableOpacity>

            <View style={styles.titleContainer}>
                <Text style={[styles.title, { color: theme.text }]}>{t('bookings_title')}</Text>
            </View>

            <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
    },
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontSize: 19,
        fontWeight: '700',
    },
});
