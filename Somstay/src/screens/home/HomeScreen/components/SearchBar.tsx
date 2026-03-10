import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { styles } from './SearchBar.styles';
import { useApp, useTheme } from '@/src/context/AppContext';

interface SearchBarProps {
    value: string;
    location: string | null;
    onSearch: (query: string) => void;
    onSearchPress: () => void;
    onLocationPress: () => void;
    onFilterPress: () => void;
    onSearchBarPress?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    location,
    onSearch,
    onSearchPress,
    onLocationPress,
    onFilterPress,
    onSearchBarPress,
}) => {
    const { t } = useApp();
    const theme = useTheme();

    return (
        <View style={styles.container}>
            {/* Search Input Container */}
            <View style={styles.searchRow}>
                <TouchableOpacity
                    style={[styles.searchInputContainer, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}
                    activeOpacity={0.9}
                    onPress={onSearchBarPress}
                >
                    <Icon name="search" size={24} color={theme.primary} style={styles.searchIcon} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholder={t('search_cities')}
                        placeholderTextColor={theme.textSecondary + '80'}
                        value={value}
                        editable={false}
                        pointerEvents="none"
                    />
                </TouchableOpacity>

                {/* Filter Button */}
                <TouchableOpacity
                    style={[styles.filterButton, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}
                    onPress={onFilterPress}
                >
                    <Icon name="options" size={24} color={theme.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};
