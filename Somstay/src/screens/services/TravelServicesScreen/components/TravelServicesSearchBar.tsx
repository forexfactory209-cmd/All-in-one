import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/src/theme';

interface TravelServicesSearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    onFilterPress: () => void;
}

export const TravelServicesSearchBar: React.FC<TravelServicesSearchBarProps> = ({
    value,
    onChangeText,
    onFilterPress,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#999" />
                <TextInput
                    style={styles.input}
                    placeholder="Explore travel services..."
                    value={value}
                    onChangeText={onChangeText}
                    placeholderTextColor="#999"
                />
            </View>
            <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
                <Ionicons name="options-outline" size={24} color={colors.primary} />
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
        gap: spacing.sm,
        backgroundColor: colors.white,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: borderRadius.md,
        paddingHorizontal: spacing.sm,
        height: 48,
        gap: spacing.xs,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: colors.dark,
    },
    filterButton: {
        width: 48,
        height: 48,
        backgroundColor: '#F3F4F6',
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
