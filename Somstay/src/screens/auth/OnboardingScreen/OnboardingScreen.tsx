import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Dimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { styles } from './OnboardingScreen.styles';
import { colors } from '@/src/theme';

const { width } = Dimensions.get('window');

interface OnboardingData {
    id: string;
    title: string;
    highlightedText: string;
    description: string;
    image: string;
}

const ONBOARDING_DATA: OnboardingData[] = [
    {
        id: '1',
        title: 'Find Your Perfect Stay \nin ',
        highlightedText: 'Somaliland',
        description: 'Browse verified homes and hotels across Hargeisa, Berbera, Borama and more.',
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '2',
        title: 'Book Securely in \nMinutes',
        highlightedText: '',
        description: 'Pay safely using ZAAD, eDahab, Visa or Mastercard.',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    },
    {
        id: '3',
        title: 'Manage Your Trips \nEasily',
        highlightedText: '',
        description: 'View bookings, get notifications, and enjoy your stay stress-free.',
        image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
    },
];

export const OnboardingScreen: React.FC = () => {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = () => {
        if (currentIndex < ONBOARDING_DATA.length - 1) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex + 1,
                animated: true,
            });
        } else {
            handleSkip();
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            flatListRef.current?.scrollToIndex({
                index: currentIndex - 1,
                animated: true,
            });
        }
    };

    const handleSkip = () => {
        router.replace('/login');
    };

    const onScroll = (event: any) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setCurrentIndex(index);
    };

    const renderItem = ({ item }: { item: OnboardingData }) => (
        <View style={styles.page}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.onboardingImage}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>
                    {item.title}
                    <Text style={styles.highlight}>{item.highlightedText}</Text>
                </Text>
                <Text style={styles.subtext}>{item.description}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Header Actions */}
                <View style={styles.header}>
                    <View style={styles.backButton}>
                        {currentIndex > 0 && (
                            <TouchableOpacity onPress={handleBack}>
                                <Ionicons name="arrow-back" size={24} color={colors.primary} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                        <Text style={styles.skipText}>Skip</Text>
                    </TouchableOpacity>
                </View>

                {/* Pager */}
                <FlatList
                    ref={flatListRef}
                    data={ONBOARDING_DATA}
                    renderItem={renderItem}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                    keyExtractor={(item) => item.id}
                    style={styles.pager}
                />

                {/* Footer */}
                <View style={styles.footer}>
                    {/* Pagination Dots */}
                    <View style={styles.paginationContainer}>
                        {ONBOARDING_DATA.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    currentIndex === index ? styles.activeDot : styles.inactiveDot
                                ]}
                            />
                        ))}
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
                        <Text style={styles.buttonText}>
                            {currentIndex === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next:'}
                        </Text>
                        <Ionicons
                            name="arrow-forward"
                            size={20}
                            color="#FFFFFF"
                            style={{ marginLeft: 8 }}
                        />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};
