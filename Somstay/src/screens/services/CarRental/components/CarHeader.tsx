import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/src/theme';
import { useTheme } from '@/src/context/AppContext';
import { styles } from '../styles/CarRentalDetailScreen.styles';

interface CarHeaderProps {
    image: string;
    onShare?: () => void;
    isFavorite?: boolean;
    onToggleFavorite?: () => void;
}

export const CarHeader: React.FC<CarHeaderProps> = ({ image, onShare, isFavorite, onToggleFavorite }) => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const theme = useTheme();
    const headerTop = Math.max(insets.top, 20) + 10;

    return (
        <View style={[styles.imageContainer, { backgroundColor: theme.surfaceSecondary }]}>
            <Image
                source={{ uri: image || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2' }}
                style={styles.mainImage}
            />

            <LinearGradient
                colors={['rgba(0,0,0,0.4)', 'transparent']}
                style={styles.linearGradient}
            />

            <LinearGradient
                colors={['transparent', theme.background]}
                style={styles.overlayBottom}
            />

            <TouchableOpacity
                style={[styles.backButton, { top: headerTop, backgroundColor: theme.card }]}
                onPress={() => router.back()}
                activeOpacity={0.8}
            >
                <Ionicons name="chevron-back" size={24} color={theme.text} />
            </TouchableOpacity>

            <View style={[styles.headerActions, { top: headerTop }]}>
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.card }]}
                    onPress={onShare}
                    activeOpacity={0.8}
                >
                    <Ionicons name="share-social-outline" size={20} color={theme.text} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.card }]}
                    onPress={onToggleFavorite}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={22}
                        color={isFavorite ? colors.error : theme.text}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};
