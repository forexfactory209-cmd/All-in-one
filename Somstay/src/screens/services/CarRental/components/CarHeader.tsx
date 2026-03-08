import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/src/theme';
import { styles } from '../styles/CarRentalDetailScreen.styles';

interface CarHeaderProps {
    image: string;
    onShare?: () => void;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
}

export const CarHeader: React.FC<CarHeaderProps> = ({ image, onShare, isFavorite, onToggleFavorite }) => {
    const router = useRouter();

    return (
        <View style={styles.imageContainer}>
            <Image 
                source={{ uri: image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2' }} 
                style={styles.mainImage} 
            />
            
            <LinearGradient
                colors={['rgba(0,0,0,0.4)', 'transparent']}
                style={styles.linearGradient}
            />

            <LinearGradient
                colors={['transparent', 'rgba(255,255,255,1)']}
                style={styles.overlayBottom}
            />

            <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => router.back()}
                activeOpacity={0.8}
            >
                <Ionicons name="chevron-back" size={26} color={colors.dark} />
            </TouchableOpacity>

            <View style={styles.headerActions}>
                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={onShare}
                    activeOpacity={0.8}
                >
                    <Ionicons name="share-social-outline" size={22} color={colors.dark} />
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.actionButton} 
                    onPress={onToggleFavorite}
                    activeOpacity={0.8}
                >
                    <Ionicons 
                        name={isFavorite ? "heart" : "heart-outline"} 
                        size={24} 
                        color={isFavorite ? colors.error : colors.dark} 
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};
