import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors } from '@/src/theme';
import * as SecureStore from 'expo-secure-store';
import reviewService, { ReviewPrompt as PromptType } from '@/src/services/review/reviewService';

export const ReviewPrompt: React.FC = () => {
    const router = useRouter();
    const [prompts, setPrompts] = useState<PromptType[]>([]);
    const [visible, setVisible] = useState(false);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                // Only fetch if we are potentially logged in (handled by service in dev)
                const data = await reviewService.getPendingPrompts();
                if (data && data.length > 0) {
                    setPrompts(data);
                    setVisible(true);
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 600,
                        useNativeDriver: true,
                    }).start();
                }
            } catch (error) {
                console.log('Error fetching review prompts:', error);
            }
        };

        // Small delay to let home screen load first
        const timer = setTimeout(fetchPrompts, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (!visible || prompts.length === 0) return null;

    const prompt = prompts[0]; // Just show the most recent one

    const handleWriteReview = () => {
        router.push({
            pathname: '/write-review' as any,
            params: {
                entityType: prompt.entity_type,
                entityId:   prompt.entity_id,
                bookingId:  prompt.booking_id,
                entityName: prompt.entity_name
            }
        });
        setVisible(false);
    };

    const handleDismiss = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
        }).start(() => setVisible(false));
    };

    const imageUri = (prompt.entity_image && prompt.entity_image.startsWith('http'))
        ? prompt.entity_image
        : `http://206.183.129.220:5000/uploads/${prompt.entity_image || 'placeholder.jpg'}`;

    return (
        <Animated.View style={[s.container, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
            <View style={s.card}>
                <Image source={{ uri: imageUri }} style={s.image} />
                <View style={s.content}>
                    <Text style={s.title}>How was your stay?</Text>
                    <Text style={s.subtitle} numberOfLines={1}>Your feedback helps others choose {prompt.entity_name}</Text>
                    <View style={s.actions}>
                        <TouchableOpacity style={s.primaryBtn} onPress={handleWriteReview}>
                            <Text style={s.primaryBtnText}>Review Now</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={s.secondaryBtn} onPress={handleDismiss}>
                            <Text style={s.secondaryBtnText}>Later</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={s.closeBtn} onPress={handleDismiss}>
                    <Ionicons name="close" size={20} color="#94A3B8" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const s = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: colors.white,
        borderRadius: 20,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 6,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        position: 'relative',
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 14,
    },
    content: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '800',
        color: colors.dark,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 10,
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    primaryBtn: {
        backgroundColor: colors.primary,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    primaryBtnText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '700',
    },
    secondaryBtn: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
    },
    secondaryBtnText: {
        color: '#475569',
        fontSize: 12,
        fontWeight: '600',
    },
    closeBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
});
