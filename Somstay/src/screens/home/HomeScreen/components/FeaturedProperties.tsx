import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { PropertyCard } from './PropertyCard';
import { PropertyResponse } from '@/src/services/property/propertyService.types';
import { styles } from './FeaturedProperties.styles';

interface FeaturedPropertiesProps {
    properties: PropertyResponse[];
    loading: boolean;
    onPropertyPress: (propertyId: string) => void;
}

export const FeaturedProperties: React.FC<FeaturedPropertiesProps> = ({
    properties,
    loading,
    onPropertyPress,
}) => {
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Featured Properties</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={properties}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PropertyCard
                        property={item}
                        onPress={() => onPropertyPress(item.id)}
                    />
                )}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};
