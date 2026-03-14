import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows } from '@/src/theme';

const { width } = Dimensions.get('window');

interface BrandPopupProps {
    visible: boolean;
    type: 'success' | 'error';
    title: string;
    message: string;
    onClose: () => void;
}

export const BrandPopup: React.FC<BrandPopupProps> = ({ visible, type, title, message, onClose }) => {
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            scaleAnim.setValue(0.8);
            opacityAnim.setValue(0);
        }
    }, [visible]);

    if (!visible) return null;

    const iconName = type === 'success' ? 'checkmark-circle' : 'alert-circle';
    const iconColor = type === 'success' ? colors.success : colors.error;

    return (
        <Modal transparent visible={visible} animationType="none">
            <View style={styles.overlay}>
                <Animated.View style={[
                    styles.container,
                    {
                        transform: [{ scale: scaleAnim }],
                        opacity: opacityAnim,
                    }
                ]}>
                    <View style={[styles.iconWrapper, { backgroundColor: iconColor + '15' }]}>
                        <Ionicons name={iconName} size={60} color={iconColor} />
                    </View>
                    
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    
                    <TouchableOpacity 
                        style={[styles.button, { backgroundColor: type === 'success' ? colors.primary : colors.dark }]} 
                        onPress={onClose}
                    >
                        <Text style={styles.buttonText}>{type === 'success' ? 'Great' : 'Try Again'}</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: width * 0.85,
        backgroundColor: colors.white,
        borderRadius: 30,
        padding: spacing.xl,
        alignItems: 'center',
        ...shadows.large,
    },
    iconWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: colors.dark,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    message: {
        fontSize: 15,
        color: colors.secondaryText,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.xl,
    },
    button: {
        width: '100%',
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.small,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '700',
    }
});
