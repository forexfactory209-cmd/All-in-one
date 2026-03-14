import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { styles } from './LoginScreen.styles';
import { colors } from '@/src/theme';
import { useApp } from '@/src/context/AppContext';
import apiClient from '@/src/services/api/client';
import { BrandPopup } from '@/src/components/BrandPopup/BrandPopup';

export const LoginScreen: React.FC = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const { setUser, returnUrl, setReturnUrl } = useApp();

    // Popup state
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupConfig, setPopupConfig] = useState<{
        type: 'success' | 'error';
        title: string;
        message: string;
    }>({ type: 'success', title: '', message: '' });

    const handleContinue = async () => {
        if (activeTab === 'phone') {
            if (!phoneNumber || phoneNumber.length < 7) {
                setPopupConfig({
                    type: 'error',
                    title: 'Invalid Phone',
                    message: 'Please enter a valid phone number to continue.'
                });
                setPopupVisible(true);
                return;
            }
            // Navigate to OTP screen
            router.push('/otp');
        } else {
            if (!email || !password) {
                setPopupConfig({
                    type: 'error',
                    title: 'Missing Fields',
                    message: 'Please enter both email and password.'
                });
                setPopupVisible(true);
                return;
            }

            setLoading(true);
            try {
                const response = await apiClient.post('/auth/login', {
                    email,
                    password
                });

                if (response.data && response.data.success) {
                    const userData = response.data.data;
                    setUser(userData);
                    
                    setPopupConfig({
                        type: 'success',
                        title: 'Welcome Back!',
                        message: `Successfully logged in as ${userData.full_name}.`
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
        }
    };

    const handlePopupClose = () => {
        setPopupVisible(false);
        if (popupConfig.type === 'success') {
            if (returnUrl) {
                const url = returnUrl;
                setReturnUrl(null);
                router.replace(url as any);
            } else {
                router.replace('/(tabs)');
            }
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.content}>
                            <View style={styles.headerContainer}>
                                <Text style={styles.title}>Welcome Back</Text>
                                <Text style={styles.subtitle}>
                                    Log in to continue your journey
                                </Text>
                            </View>

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

                            {/* Dynamic Input based on tab */}
                            {activeTab === 'phone' ? (
                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Phone Number</Text>
                                    <View style={styles.phoneInputWrapper}>
                                        <View style={styles.countryCode}>
                                            <Text style={styles.countryCodeText}>+252</Text>
                                        </View>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="63XXXXXXX"
                                            placeholderTextColor="#9CA3AF"
                                            keyboardType="phone-pad"
                                            value={phoneNumber}
                                            onChangeText={setPhoneNumber}
                                        />
                                    </View>
                                </View>
                            ) : (
                                <View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Email Address</Text>
                                        <View style={styles.emailInputWrapper}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="name@example.com"
                                                placeholderTextColor="#9CA3AF"
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                                value={email}
                                                onChangeText={setEmail}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.label}>Password</Text>
                                        <View style={styles.emailInputWrapper}>
                                            <TextInput
                                                style={styles.input}
                                                placeholder="••••••••"
                                                placeholderTextColor="#9CA3AF"
                                                secureTextEntry
                                                value={password}
                                                onChangeText={setPassword}
                                            />
                                        </View>
                                    </View>
                                </View>
                            )}

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={handleContinue}
                            >
                                <Text style={styles.continueButtonText}>
                                    {activeTab === 'phone' ? 'Send OTP Code' : 'Log In'}
                                </Text>
                            </TouchableOpacity>

                            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                                <Text style={{ color: '#666' }}>Don't have an account? </Text>
                                <TouchableOpacity onPress={() => router.push('/signup')}>
                                    <Text style={{ fontWeight: 'bold', color: colors.primary }}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            By continuing, you agree to our{' '}
                            <Text style={styles.linkText}>Terms of Service</Text>
                            {'\n'}and <Text style={styles.linkText}>Privacy Policy</Text>
                        </Text>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>

            <BrandPopup
                visible={popupVisible}
                type={popupConfig.type}
                title={popupConfig.title}
                message={popupConfig.message}
                onClose={handlePopupClose}
            />
        </View>
    );
};
