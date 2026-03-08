import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { styles } from './SearchBar.styles';
import { useApp } from '@/src/context/AppContext';

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
    return (
        <View style={styles.container}>
            {/* Search Input Container */}
            <View style={styles.searchRow}>
                <TouchableOpacity
                    style={styles.searchInputContainer}
                    activeOpacity={0.9}
                    onPress={onSearchBarPress}
                >
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t('search_cities')}
                        placeholderTextColor="#999"
                        value={value}
                        editable={false}
                        pointerEvents="none"
                    />
                    <Icon name="search" size={24} color="#0288AC" style={styles.searchIcon} />
                </TouchableOpacity>

                {/* Filter Button */}
                <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
                    <Icon name="options" size={24} color="#0288AC" />
                </TouchableOpacity>
            </View>
        </View>
    );
};
