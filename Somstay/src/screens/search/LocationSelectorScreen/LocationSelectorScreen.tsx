import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles } from './styles/LocationSelectorScreen.styles';
import { colors, spacing } from '@/src/theme';

export const LocationSelectorScreen: React.FC = () => {
    const router = useRouter();
    const { from } = useLocalSearchParams<{ from?: string }>();
    const [searchQuery, setSearchQuery] = useState('');

    const recentSearches = [
        { id: '1', title: 'Laas Geel', time: '2 days ago' },
        { id: '2', title: 'Hargeisa hotels', time: '' },
    ];

    const suggestedCities = [
        {
            id: '1',
            name: 'Hargeisa',
            description: 'Capital City & Cultural Hub',
            icon: 'office-building',
            iconType: 'material-community'
        },
        {
            id: '2',
            name: 'Berbera',
            description: 'Port City & Red Sea Coast',
            icon: 'sail-boat',
            iconType: 'material-community'
        },
        {
            id: '3',
            name: 'Borama',
            description: 'Education Hub & Green Highlands',
            icon: 'school-outline',
            iconType: 'material-community'
        },
        {
            id: '4',
            name: 'Burco',
            description: 'Second Largest City & Trade Center',
            icon: 'store',
            iconType: 'material-community'
        },
        {
            id: '5',
            name: 'Erigavo',
            description: 'Daallo Mountains & High Altitude',
            icon: 'image-filter-hdr',
            iconType: 'material-community'
        },
    ];

    const handleLocationSelect = (city: string) => {
        if (from === 'map') {
            router.replace({
                pathname: '/map',
                params: { city }
            });
        } else {
            // Use replace to prevent stacking search results on top of each other
            // When combined with replace from SearchResults to Selector, this maintains a clean stack
            router.replace({
                pathname: '/search-results',
                params: { city }
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.dark} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { marginLeft: spacing.sm }]}>Location Selector</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color={colors.primary} style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search cities in Somaliland..."
                            placeholderTextColor="#9BA3A3"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={() => handleLocationSelect(searchQuery)}
                            returnKeyType="search"
                        />
                    </View>
                </View>

                {/* Current Location */}
                <TouchableOpacity style={styles.currentLocationContainer}>
                    <View style={styles.currentLocationIconBox}>
                        <MaterialCommunityIcons name="crosshairs-gps" size={24} color={colors.primary} />
                    </View>
                    <View style={styles.currentLocationTextContent}>
                        <Text style={styles.currentLocationTitle}>Use Current Location</Text>
                        <Text style={styles.currentLocationSubtitle}>Nearby: Hargeisa, Maroodi Jeex</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
                </TouchableOpacity>

                {/* Recent Searches */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>RECENT SEARCHES</Text>
                    <TouchableOpacity>
                        <Text style={styles.clearAllText}>Clear All</Text>
                    </TouchableOpacity>
                </View>

                {recentSearches.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.recentSearchItem}
                        onPress={() => handleLocationSelect(item.title)}
                    >
                        <Ionicons name="time-outline" size={22} color="#9BA3A3" style={styles.recentSearchIcon} />
                        <Text style={styles.recentSearchText}>{item.title}</Text>
                        {item.time ? <Text style={styles.recentSearchTime}>{item.time}</Text> : null}
                    </TouchableOpacity>
                ))}

                <View style={{ height: spacing.xl }} />

                {/* Suggested Cities */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>SUGGESTED CITIES</Text>
                </View>

                {suggestedCities.map((city, index) => (
                    <React.Fragment key={city.id}>
                        <TouchableOpacity
                            style={styles.suggestedCityItem}
                            onPress={() => handleLocationSelect(city.name)}
                        >
                            <View style={styles.suggestedCityIconBox}>
                                <MaterialCommunityIcons name={city.icon as any} size={28} color={colors.primary} />
                            </View>
                            <View style={styles.suggestedCityTextContent}>
                                <Text style={styles.suggestedCityName}>{city.name}</Text>
                                <Text style={styles.suggestedCityDescription}>{city.description}</Text>
                            </View>
                            <MaterialCommunityIcons name="arrow-top-right" size={24} color="#D1D5DB" />
                        </TouchableOpacity>
                        {index < suggestedCities.length - 1 && <View style={styles.divider} />}
                    </React.Fragment>
                ))}

                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        Can't find your city? We're constantly adding new destinations across Somaliland.
                    </Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
};
