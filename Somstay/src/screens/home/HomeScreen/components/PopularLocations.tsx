import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { styles } from './PopularLocations.styles';
import { colors } from '@/src/theme';

interface Location {
    id: string;
    name: string;
    image: string;
}

interface PopularLocationsProps {
    locations: Location[];
    loading: boolean;
    onLocationPress: (locationName: string) => void;
}

export const PopularLocations: React.FC<PopularLocationsProps> = ({
    locations,
    loading,
    onLocationPress,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Popular Locations</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={colors.primary} />
                </View>
            ) : (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {locations.map((location) => (
                        <TouchableOpacity
                            key={location.id}
                            style={styles.locationItem}
                            onPress={() => onLocationPress(location.name)}
                        >
                            <Image
                                source={{ uri: location.image }}
                                style={styles.locationImage}
                                resizeMode="cover"
                            />
                            <Text style={styles.locationName}>{location.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}
        </View>
    );
};
