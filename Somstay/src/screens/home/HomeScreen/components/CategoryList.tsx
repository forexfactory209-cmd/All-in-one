import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { styles } from './CategoryList.styles';

interface Category {
    id: string;
    name: string;
    icon: string;
}

const CATEGORIES: Category[] = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'Hotel', name: 'Hotels', icon: 'office-building' },
    { id: 'Apartment', name: 'Apartments', icon: 'home-variant' },
    { id: 'Villa', name: 'Villas', icon: 'home-modern' },
    { id: 'Cabin', name: 'Cabins', icon: 'home-outline' },
];

interface CategoryListProps {
    onCategoryPress: (category: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
    onCategoryPress,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.scrollContent}>
                {CATEGORIES.map((category) => (
                    <TouchableOpacity
                        key={category.id}
                        style={styles.categoryItem}
                        onPress={() => onCategoryPress(category.id)}
                    >
                        <View style={styles.iconContainer}>
                            <Icon name={category.icon as any} size={32} color="#FFFFFF" />
                        </View>
                        <Text style={styles.categoryName}>{category.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};
