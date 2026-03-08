import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
                {categories.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.categoryItem}
                        onPress={() => onCategoryPress(item.id)}
                        activeOpacity={0.7}
                    >
                        <View style={[
                            styles.iconContainer,
                            activeCategory === item.id && styles.activeIconContainer
                        ]}>
                            <Ionicons
                                name={item.icon as any}
                                size={28}
                                color={activeCategory === item.id ? colors.white : colors.primary}
                            />
                        </View>
                        <Text style={[
                            styles.categoryName,
                            { color: theme.textSecondary },
                            activeCategory === item.id && styles.activeCategoryName
                        ]}>
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};
