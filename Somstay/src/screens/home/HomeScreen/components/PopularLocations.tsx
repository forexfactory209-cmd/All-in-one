import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { styles } from './PopularLocations.styles';

interface Location {
    id: string;
    name: string;
    image: string;
}

const LOCATIONS: Location[] = [
    { id: '1', name: 'Mogadishu', image: 'https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=200&q=80' },
    { id: '2', name: 'Hargeisa', image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=200&q=80' },
    { id: '3', name: 'Bosaso', image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80' },
    { id: '4', name: 'Kismayo', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80' },
];

interface PopularLocationsProps {
    onLocationPress: (locationId: string) => void;
}

export const PopularLocations: React.FC<PopularLocationsProps> = ({
    onLocationPress,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Popular Locations</Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {LOCATIONS.map((location) => (
                    <TouchableOpacity
                        key={location.id}
                        style={styles.locationItem}
                        onPress={() => onLocationPress(location.id)}
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
        </View>
    );
};
