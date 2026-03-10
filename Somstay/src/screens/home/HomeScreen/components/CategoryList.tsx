import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/src/screens/home/HomeScreen/components/CategoryList.styles';
import { colors } from '@/src/theme';

import { useApp, useTheme } from '@/src/context/AppContext';

interface CategoryListProps {
    onCategoryPress: (categoryId: string) => void;
    activeCategory?: string;
}

export const CategoryList: React.FC<CategoryListProps> = ({ onCategoryPress, activeCategory = 'stay' }) => {
    const { t } = useApp();
    const theme = useTheme();

    const categories = [
        { id: 'stay', name: t('home'), icon: 'bed-outline', type: 'ionicon' },
        { id: 'wishlist', name: t('my_favorites'), icon: 'heart-outline', type: 'ionicon' },
        { id: 'services', name: 'Services', icon: 'apps-outline', type: 'ionicon' },
        { id: 'map', name: 'Map', icon: 'map-outline', type: 'ionicon' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.listContainer}>
                {categories.map((item) => {
                    const isActive = activeCategory === item.id;
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.categoryItem}
                            onPress={() => onCategoryPress(item.id)}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                styles.iconContainer,
                                { backgroundColor: isActive ? colors.primary : theme.surfaceSecondary },
                            ]}>
                                <Ionicons
                                    name={item.icon as any}
                                    size={28}
                                    color={isActive ? colors.white : theme.primary}
                                />
                            </View>
                            <Text style={[
                                styles.categoryName,
                                { color: isActive ? theme.primary : theme.textSecondary, fontWeight: isActive ? '700' : '600' },
                            ]}>
                                {item.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};
