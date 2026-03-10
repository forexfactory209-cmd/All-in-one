import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { styles } from '@/src/screens/home/HomeScreen/components/PopularLocations.styles';
import { Location } from '../hooks/usePopularLocations';

import { useApp, useTheme } from '@/src/context/AppContext';

interface PopularLocationsProps {
    locations: Location[];
    loading: boolean;
    onLocationPress: (locationName: string) => void;
}

export const PopularLocations: React.FC<PopularLocationsProps> = ({
    locations,
    loading,
    onLocationPress
}) => {
    const { t } = useApp();
    const theme = useTheme();
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>{t('popular_locations')}</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={theme.primary} />
                </View>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {locations.map((loc) => (
                        <TouchableOpacity
                            key={loc.id}
                            style={styles.locationCard}
                            onPress={() => onLocationPress(loc.name)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.imageContainer, { borderColor: theme.border }]}>
                                <Image
                                    source={{ uri: loc.image || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=150&q=80' }}
                                    style={styles.image}
                                />
                            </View>
                            <Text style={[styles.locationName, { color: theme.textSecondary }]}>{loc.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};
