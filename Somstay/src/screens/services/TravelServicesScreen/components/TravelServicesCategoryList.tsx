import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { colors, spacing, borderRadius } from '@/src/theme';

const CATEGORIES = [
    { id: '1', name: 'Car Rental' },
    { id: '2', name: 'City Tours' },
    { id: '3', name: 'Airport Services' },
];

interface TravelServicesCategoryListProps {
    selectedId: string;
    onSelect: (id: string) => void;
}

export const TravelServicesCategoryList: React.FC<TravelServicesCategoryListProps> = ({
    selectedId,
    onSelect,
}) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {CATEGORIES.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[
                            styles.categoryItem,
                            selectedId === cat.id && styles.activeCategoryItem,
                        ]}
                        onPress={() => onSelect(cat.id)}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                selectedId === cat.id && styles.activeCategoryText,
                            ]}
                        >
                            {cat.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        paddingBottom: spacing.sm,
    },
    scrollContent: {
        paddingHorizontal: spacing.md,
        gap: spacing.sm,
    },
    categoryItem: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: '#F3F4F6',
    },
    activeCategoryItem: {
        backgroundColor: colors.primary,
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#7C7C7C',
    },
    activeCategoryText: {
        color: colors.white,
    },
});
