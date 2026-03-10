import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { styles } from './styles/LocationSelectorScreen.styles';
import { colors, spacing } from '@/src/theme';
import { useApp } from '@/src/context/AppContext';

const RECENT_SEARCHES_KEY = 'somstay_recent_searches';

export const LocationSelectorScreen: React.FC = () => {
    const router = useRouter();
    const { from } = useLocalSearchParams<{ from?: string }>();
    const { userLocation, setLocationEnabled } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState<{ id: string; title: string; time: string }[]>([]);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // Load recent searches on mount
    useEffect(() => {
        loadRecentSearches();
    }, []);

    const loadRecentSearches = async () => {
        try {
            const stored = await SecureStore.getItemAsync(RECENT_SEARCHES_KEY);
            if (stored) {
                setRecentSearches(JSON.parse(stored));
            }
        } catch (error) {
            console.error('Failed to load recent searches', error);
        }
    };

    const saveRecentSearch = async (city: string) => {
        try {
            if (!city.trim()) return;
            
            const newSearch = { 
                id: Date.now().toString(), 
                title: city, 
                time: 'Just now' 
            };

            // Filter out if already exists, add to top, limit to 3
            const filtered = recentSearches.filter(s => s.title.toLowerCase() !== city.toLowerCase());
            const updated = [newSearch, ...filtered].slice(0, 3);
            
            setRecentSearches(updated);
            await SecureStore.setItemAsync(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to save recent search', error);
        }
    };

    const clearRecentSearches = async () => {
        setRecentSearches([]);
        await SecureStore.deleteItemAsync(RECENT_SEARCHES_KEY);
    };

    const handleLocationSelect = (city: string) => {
        if (!city.trim()) return;
        
        console.log(`[Search] Selected location: ${city}`);
        saveRecentSearch(city);
        
        if (from === 'map') {
            router.replace({
                pathname: '/map',
                params: { city }
            });
        } else {
            router.replace({
                pathname: '/search-results',
                params: { city }
            });
        }
    };

    const handleCurrentLocation = async () => {
        setIsLoadingLocation(true);
        try {
            // If location is already available in context, use it immediately
            if (userLocation && userLocation.city) {
                console.log(`[Location] Using already available city: ${userLocation.city}`);
                handleLocationSelect(userLocation.city);
                return;
            }

            console.log('[Location] Requesting current location permissions and data...');
            // This triggers permission request and location fetch in AppContext
            await setLocationEnabled(true);
            
            // Give it a moment to update state (reverse geocoding takes time)
            // We'll wait a bit longer if needed, up to 2 seconds
            let attempts = 0;
            let foundCity = null;
            
            while (attempts < 4) {
                await new Promise(resolve => setTimeout(resolve, 500));
                if (userLocation && userLocation.city) {
                    foundCity = userLocation.city;
                    break;
                }
                attempts++;
            }

            if (foundCity) {
                console.log(`[Location] Current city identified: ${foundCity}`);
                handleLocationSelect(foundCity);
            } else {
                console.log('[Location] Location data not immediately available after 2s, defaulting to Hargeisa');
                handleLocationSelect('Hargeisa');
            }
        } catch (error) {
            console.error('[Location] Error getting current location', error);
            handleLocationSelect('Hargeisa');
        } finally {
            setIsLoadingLocation(false);
        }
    };

    /* Suggested cities data */
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
                <TouchableOpacity 
                    style={styles.currentLocationContainer}
                    onPress={handleCurrentLocation}
                    disabled={isLoadingLocation}
                >
                    <View style={styles.currentLocationIconBox}>
                        {isLoadingLocation ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <MaterialCommunityIcons name="crosshairs-gps" size={24} color={colors.primary} />
                        )}
                    </View>
                    <View style={styles.currentLocationTextContent}>
                        <Text style={styles.currentLocationTitle}>Use Current Location</Text>
                        <Text style={styles.currentLocationSubtitle}>
                            {userLocation?.city ? `Found: ${userLocation.city}` : 'Nearby: Hargeisa, Maroodi Jeex'}
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#BDBDBD" />
                </TouchableOpacity>

                {/* Recent Searches */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>RECENT SEARCHES</Text>
                    {recentSearches.length > 0 && (
                        <TouchableOpacity onPress={clearRecentSearches}>
                            <Text style={styles.clearAllText}>Clear All</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {recentSearches.length === 0 ? (
                    <Text style={{ paddingHorizontal: spacing.lg, color: '#9BA3A3', fontSize: 13, fontStyle: 'italic' }}>
                        No recent searches
                    </Text>
                ) : (
                    recentSearches.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.recentSearchItem}
                            onPress={() => handleLocationSelect(item.title)}
                        >
                            <Ionicons name="time-outline" size={22} color="#9BA3A3" style={styles.recentSearchIcon} />
                            <Text style={styles.recentSearchText}>{item.title}</Text>
                            {item.time ? <Text style={styles.recentSearchTime}>{item.time}</Text> : null}
                        </TouchableOpacity>
                    ))
                )}

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
