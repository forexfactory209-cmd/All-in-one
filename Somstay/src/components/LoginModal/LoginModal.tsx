import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/src/theme';
import { useRouter } from 'expo-router';
import { useApp } from '@/src/context/AppContext';
import apiClient from '@/src/services/api/client';
import { BrandPopup } from '../BrandPopup/BrandPopup';

interface LoginModalProps {
    visible: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose, onLoginSuccess }) => {
    const router = useRouter();
    const { setUser, returnUrl, setReturnUrl } = useApp();
    const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Popup state
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupConfig, setPopupConfig] = useState<{
        type: 'success' | 'error';
        title: string;
        message: string;
    }>({ type: 'success', title: '', message: '' });

    const handleLogin = async () => {
        if (activeTab === 'email' && (!email || !password)) {
            setPopupConfig({
                type: 'error',
                title: 'Missing Fields',
                message: 'Please enter both email and password to continue.'
            });
            setPopupVisible(true);
            return;
        }
        if (activeTab === 'phone' && (!phone || !password)) {
            setPopupConfig({
                type: 'error',
                title: 'Missing Fields',
                message: 'Please enter both phone number and password to continue.'
            });
            setPopupVisible(true);
            return;
        }

        setLoading(true);
        try {
            const payload = activeTab === 'email' 
                ? { email, password } 
                : { phone, password };

            const response = await apiClient.post('/auth/login', payload);

            if (response.data && response.data.success) {
                const userData = response.data.data;
                setUser(userData);
                
                setPopupConfig({
                    type: 'success',
                    title: 'Welcome Back!',
                    message: `You have successfully logged in as ${userData.full_name}.`
                });
                setPopupVisible(true);
            } else {
                throw new Error(response.data?.message || 'Login failed');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Invalid credentials. Please try again.';
            setPopupConfig({
                type: 'error',
                title: 'Login Failed',
                message: errorMsg
            });
            setPopupVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handlePopupClose = () => {
        setPopupVisible(false);
        if (popupConfig.type === 'success') {
            onLoginSuccess();
            if (returnUrl) {
                const url = returnUrl;
                setReturnUrl(null);
                router.replace(url as any);
            }
        }
    };

    const handleSignupPress = () => {
        onClose();
        router.push('/signup');
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color={colors.dark} />
                    </TouchableOpacity>

                    <Text style={styles.title}>Welcome to Somstay</Text>
                    <Text style={styles.subtitle}>Log in or sign up to book this property</Text>

                    {/* Tabs */}
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'phone' && styles.activeTab]}
                            onPress={() => setActiveTab('phone')}
                        >
                            <Text style={[styles.tabText, activeTab === 'phone' && styles.activeTabText]}>Phone Number</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'email' && styles.activeTab]}
                            onPress={() => setActiveTab('email')}
                        >
                            <Text style={[styles.tabText, activeTab === 'email' && styles.activeTabText]}>Email</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Forms */}
                    {activeTab === 'phone' ? (
                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Phone number"
                                    keyboardType="phone-pad"
                                    placeholderTextColor="#999"
                                    value={phone}
                                    onChangeText={setPhone}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    secureTextEntry
                                    placeholderTextColor="#999"
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>
                        </View>
                    ) : (
                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Email address"
                                    keyboardType="email-address"
                                    placeholderTextColor="#999"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Password"
                                    secureTextEntry
                                    placeholderTextColor="#999"
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>
                        </View>
                    )}

                    <TouchableOpacity 
                        style={[styles.primaryButton, loading && { opacity: 0.7 }]} 
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={colors.white} />
                        ) : (
                            <Text style={styles.primaryButtonText}>Continue</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.dividerContainer}>
                        <View style={styles.divider} />
                        <Text style={styles.dividerText}>or continue with</Text>
                        <View style={styles.divider} />
                    </View>

                    <View style={styles.socialButtonsContainer}>
                        <TouchableOpacity style={styles.socialCircle}>
                            <Ionicons name="logo-google" size={24} color="#DB4437" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialCircle}>
                            <Ionicons name="logo-apple" size={24} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialCircle}>
                            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={handleSignupPress}>
                            <Text style={styles.footerLink}>Sign up</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                <BrandPopup
                    visible={popupVisible}
                    type={popupConfig.type}
                    title={popupConfig.title}
                    message={popupConfig.message}
                    onClose={handlePopupClose}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: spacing.xl,
        paddingBottom: 40,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.dark,
        marginBottom: 8,
        marginTop: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#F0F4F5',
        borderRadius: 12,
        padding: 4,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 8,
    },
    activeTab: {
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    activeTabText: {
        color: colors.dark,
    },
    formContainer: {
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        height: 56,
        backgroundColor: colors.white,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: colors.dark,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
    },
    primaryButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    dividerText: {
        color: '#666',
        paddingHorizontal: 16,
        fontSize: 14,
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 30,
    },
    socialCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.white,
    },
    footerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerText: {
        color: '#666',
        fontSize: 14,
    },
    footerLink: {
        color: colors.primary,
        fontSize: 14,
        fontWeight: 'bold',
    },
});
