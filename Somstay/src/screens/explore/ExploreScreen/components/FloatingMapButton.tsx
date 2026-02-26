import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '@/src/theme';
import { useRouter } from 'expo-router';

export const FloatingMapButton: React.FC = () => {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => router.push('/map')}
        >
            <Ionicons name="map" size={24} color={colors.white} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.large,
        elevation: 5,
    },
});
