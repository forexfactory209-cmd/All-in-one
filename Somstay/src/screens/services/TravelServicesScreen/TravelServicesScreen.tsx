import React, { useState } from 'react';
import { View, FlatList, ActivityIndicator, StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/src/theme';

// Components
import { TravelServicesHeader } from './components/TravelServicesHeader';
import { TravelServicesSearchBar } from './components/TravelServicesSearchBar';
import { TravelServicesCategoryList } from './components/TravelServicesCategoryList';
import { TravelServicesCard } from './components/TravelServicesCard';

// Hooks
import { useTravelServices } from './hooks/useTravelServices';

// Popups
import { FilterModal } from '../../home/HomeScreen/popups/FilterModal';

export const TravelServicesScreen: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('1');
    const [filterVisible, setFilterVisible] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState<any>(null);
    const { services, loading } = useTravelServices(selectedCategory, appliedFilters);

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <TravelServicesSearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                onFilterPress={() => setFilterVisible(true)}
            />
            <TravelServicesCategoryList
                selectedId={selectedCategory}
                onSelect={setSelectedCategory}
            />
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar barStyle="dark-content" />
            <TravelServicesHeader />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={services}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={renderHeader}
                    renderItem={({ item }) => <TravelServicesCard service={item} />}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <FilterModal
                visible={filterVisible}
                onClose={() => setFilterVisible(false)}
                onApply={(filters) => {
                    console.log('Applied Travel Filters:', filters);
                    setAppliedFilters(filters);
                    setFilterVisible(false);
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    headerContainer: {
        paddingBottom: spacing.sm,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 40,
    },
});
