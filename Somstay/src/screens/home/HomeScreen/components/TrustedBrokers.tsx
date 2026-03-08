import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons as Icon } from '@expo/vector-icons';
import { styles } from './TrustedBrokers.styles';

interface Broker {
    id: string;
    name: string;
    rating: number;
    image: string;
    verified: boolean;
}

const BROKERS: Broker[] = [
    { id: '1', name: 'Ahmed Abdi', rating: 4.9, image: 'https://via.placeholder.com/60', verified: true },
    { id: '2', name: 'Filsan Noor', rating: 5.0, image: 'https://via.placeholder.com/60', verified: true },
];

interface TrustedBrokersProps {
    onBrokerPress: (brokerId: string) => void;
}

export const TrustedBrokers: React.FC<TrustedBrokersProps> = ({
    onBrokerPress,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Trusted Brokers</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {BROKERS.map((broker) => (
                    <TouchableOpacity
                        key={broker.id}
                        style={styles.brokerCard}
                        onPress={() => onBrokerPress(broker.id)}
                    >
                        <Image
                            source={{ uri: broker.image }}
                            style={styles.brokerImage}
                            resizeMode="cover"
                        />
                        {broker.verified && (
                            <View style={styles.verifiedBadge}>
                                <Icon name="checkmark-circle" size={16} color="#06A649" />
                            </View>
                        )}
                        <Text style={styles.brokerName}>{broker.name}</Text>
                        <View style={styles.ratingRow}>
                            <Icon name="star" size={14} color="#FFD700" />
                            <Text style={styles.rating}>{Number(broker.rating || 4.5).toFixed(1)}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};
