import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { HotelCard } from './HotelCard';
import { PropertyResponse } from '@/src/services/property/propertyService.types';
import { styles } from './FeaturedHotels.styles';

interface FeaturedHotelsProps {
    hotels: PropertyResponse[];
    loading: boolean;
    onHotelPress: (hotelId: string) => void;
}

export const FeaturedHotels: React.FC<FeaturedHotelsProps> = ({
    hotels,
    loading,
    onHotelPress,
}) => {
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading Hotels...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Featured Hotels</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={hotels}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <HotelCard
                        hotel={item}
                        onPress={() => onHotelPress(item.id)}
                    />
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};
