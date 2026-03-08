import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StatusBar, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Components
import { ExploreHeader } from './components/ExploreHeader';
import { ExploreSearchBar } from './components/ExploreSearchBar';
import { ExploreCategoryList } from './components/ExploreCategoryList';
import { ExplorePropertyCard } from './components/ExplorePropertyCard';
import { FloatingMapButton } from './components/FloatingMapButton';

// Hooks
import { useExploreProperties } from './hooks/useExploreProperties';
import { useRouter } from 'expo-router';

// Popups
import { ExploreFilterModal } from './popups/ExploreFilterModal';
import { SortBottomSheet, SortOption } from '../../home/SearchResultsScreen/popups/SortBottomSheet';

// Styles
import { styles } from './styles';
import { colors } from '@/src/theme';
import { useApp, useTheme } from '@/src/context/AppContext';

export const ExploreScreen: React.FC = () => {
    const { t, settings } = useApp();
    const theme = useTheme();
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [filterVisible, setFilterVisible] = useState(false);
    const [sortVisible, setSortVisible] = useState(false);
    const [currentSort, setCurrentSort] = useState<SortOption>('newest');
    const [appliedFilters, setAppliedFilters] = useState<any>({
        city: 'Hargeisa',
        details: 'Oct 12-15 • 2 Guests'
    });
    const { properties, loading } = useExploreProperties({
        ...appliedFilters,
        type: selectedCategory !== 'all' ? selectedCategory : undefined,
        sort: currentSort,
    });

    const renderHeader = () => {
        const destinationName = appliedFilters.city || appliedFilters.destination || "Hargeisa";
        return (
            <View style={styles.listHeader}>
                <ExploreSearchBar
                    location={destinationName}
                    details={appliedFilters.details || "Oct 12-15 • 2 Guests"}
                    onFilterPress={() => setFilterVisible(true)}
                />
                <ExploreCategoryList
                    selectedId={selectedCategory}
                    onSelect={setSelectedCategory}
                />
                <View style={[styles.resultsInfo, { backgroundColor: theme.background }]}>
                    <Text style={[styles.resultsCount, { color: theme.textSecondary }]}>
                        {properties.length} {t('hotels_in')} {destinationName}
                    </Text>
                    <TouchableOpacity
                        style={styles.sortContainer}
                        onPress={() => setSortVisible(true)}
                    >
                        <Text style={[styles.sortLabel, { color: theme.textSecondary }]}>{t('sort_by')}</Text>
                        <Text style={[styles.sortText, { color: theme.text }]}>
                            {currentSort === 'newest' ? t('newest') :
                                currentSort === 'price_low' ? t('price_low') :
                                    currentSort === 'price_high' ? t('price_high') : t('top_rated_sort')}
                        </Text>
                        <Ionicons name="chevron-down" size={14} color={theme.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]} edges={['top']}>
            <StatusBar barStyle={settings.darkMode ? 'light-content' : 'dark-content'} />
            <ExploreHeader 
                onMapPress={() => router.push({ 
                    pathname: '/map', 
                    params: { city: appliedFilters.city || 'Hargeisa' } 
                })} 
            />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={properties}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={renderHeader}
                    renderItem={({ item }) => (
                        <ExplorePropertyCard
                            property={item}
                            onPress={() => router.push({ pathname: '/hotel/[id]', params: { id: item.id } })}
                            onFavoritePress={() => { }}
                            onActionPress={() => router.push({ pathname: '/hotel/[id]', params: { id: item.id } })}
                        />
                    )}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <FloatingMapButton />

            <ExploreFilterModal
                visible={filterVisible}
                initialFilters={appliedFilters}
                onClose={() => setFilterVisible(false)}
                onApply={(filters) => {
                    console.log('Applied explore filters:', filters);
                    setAppliedFilters(filters);
                    setFilterVisible(false);
                }}
            />

            <SortBottomSheet
                visible={sortVisible}
                currentOption={currentSort}
                onClose={() => setSortVisible(false)}
                onApply={(option) => {
                    setCurrentSort(option);
                    console.log('Applied sort:', option);
                }}
            />
        </SafeAreaView>
    );
};
