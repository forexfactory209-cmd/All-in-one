import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/src/theme';

interface Category {
    id: string;
    label: string;
}

const CATEGORIES: Category[] = [
    { id: 'all', label: 'All' },
    { id: 'Standard', label: 'Standard Hotel' },
    { id: 'Deluxe', label: 'Deluxe Hotel' },
    { id: 'Luxury', label: 'Luxury Hotel' },
    { id: 'Boutique', label: 'Boutique Hotel' },
];

interface ExploreCategoryListProps {
    selectedId: string;
    onSelect: (id: string) => void;
}

export const ExploreCategoryList: React.FC<ExploreCategoryListProps> = ({
    selectedId,
    onSelect,
}) => {
    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {CATEGORIES.map((category) => (
                <TouchableOpacity
                    key={category.id}
                    style={[
                        styles.chip,
                        selectedId === category.id && styles.activeChip
                    ]}
                    onPress={() => onSelect(category.id)}
                >
                    <Text style={[
                        styles.chipText,
                        selectedId === category.id && styles.activeChipText
                    ]}>
                        {category.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        gap: spacing.sm,
    },
    chip: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: '#E8E8E8',
    },
    activeChip: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    activeChipText: {
        color: colors.white,
        fontWeight: '600',
    },
});
