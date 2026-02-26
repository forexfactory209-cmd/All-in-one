import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { styles } from './LoginScreen.styles';
import { colors } from '@/src/theme';

export const LoginScreen: React.FC = () => {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleContinue = () => {
        // Navigate to OTP screen
        router.push('/otp');
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
                                    Enter your phone number to continue your journey
                                </Text>
                            </View>

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

                            <TouchableOpacity
                                style={styles.continueButton}
                                onPress={handleContinue}
                            >
                                <Text style={styles.continueButtonText}>Continue</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.passwordLoginLink}>
                                <Text style={styles.passwordLoginText}>Login with password instead</Text>
                            </TouchableOpacity>
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
        </View>
    );
};
