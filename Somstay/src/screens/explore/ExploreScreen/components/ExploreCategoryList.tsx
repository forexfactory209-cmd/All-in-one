import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '@/src/theme';
import { useTheme } from '@/src/context/AppContext';

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
    const theme = useTheme();

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {CATEGORIES.map((category) => {
                const isActive = selectedId === category.id;
                return (
                    <TouchableOpacity
                        key={category.id}
                        style={[
                            styles.chip,
                            {
                                backgroundColor: isActive ? theme.primary : theme.surfaceSecondary,
                                borderColor: isActive ? theme.primary : theme.border
                            }
                        ]}
                        onPress={() => onSelect(category.id)}
                    >
                        <Text style={[
                            styles.chipText,
                            { color: isActive ? colors.white : theme.textSecondary }
                        ]}>
                            {category.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
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
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 1,
    },
    chipText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
