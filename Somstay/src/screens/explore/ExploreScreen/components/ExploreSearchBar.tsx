import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '@/src/theme';

interface ExploreSearchBarProps {
    location: string;
    details: string;
    onFilterPress: () => void;
    onSearchPress?: () => void;
}

export const ExploreSearchBar: React.FC<ExploreSearchBarProps> = ({
    location,
    details,
    onFilterPress,
    onSearchPress,
}) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
                <Ionicons name="search" size={20} color={colors.primary} style={styles.searchIcon} />
                <View style={styles.textContainer}>
                    <Text style={styles.locationText}>{location.toUpperCase()}</Text>
                    <Text style={styles.detailsText} numberOfLines={1}>{details}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
                <Ionicons name="filter" size={20} color={colors.primary} />
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
    },
    searchButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F8F9',
        borderRadius: borderRadius.large,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        height: 56,
    },
    searchIcon: {
        marginRight: spacing.sm,
    },
    textContainer: {
        flex: 1,
    },
    locationText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.primary,
        letterSpacing: 0.5,
    },
    detailsText: {
        fontSize: 13,
        color: '#7C7C7C',
        marginTop: 2,
    },
    filterButton: {
        width: 48,
        height: 48,
        backgroundColor: '#F7F8F9',
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
