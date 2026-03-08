import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './OTPScreen.styles';
import { colors } from '@/src/theme';

export const OTPScreen: React.FC = () => {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    const handleChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text.length !== 0 && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        router.replace('/complete-profile');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.dark} />
                    </TouchableOpacity>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
                        <View style={styles.content}>
                            <Text style={styles.title}>Enter Verification Code</Text>
                            <Text style={styles.subtitle}>
                                We sent a 6-digit code to <Text style={styles.phoneNumber}>+252 63XXXXXXX</Text>
                            </Text>

                            <View style={styles.otpContainer}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={(ref) => { inputRefs.current[index] = ref; }}
                                        style={[
                                            styles.otpInput,
                                            digit !== '' && styles.activeOtpInput,
                                            index === 0 && otp[0] === '' && styles.activeOtpInput
                                        ]}
                                        value={digit}
                                        onChangeText={(text) => handleChange(text, index)}
                                        onKeyPress={(e) => handleKeyPress(e, index)}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </View>

                            <View style={styles.resendContainer}>
                                <TouchableOpacity style={styles.resendButton}>
                                    <Text style={styles.resendText}>Resend code</Text>
                                </TouchableOpacity>
                                <View style={styles.timerContainer}>
                                    <Ionicons name="time-outline" size={16} color={colors.dark} />
                                    <Text style={styles.timerText}>00:30</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.verifyButton}
                                onPress={handleVerify}
                            >
                                <Text style={styles.verifyButtonText}>Verify</Text>
                                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
                            </TouchableOpacity>

                            <Text style={styles.footerText}>
                                By clicking Verify, you agree to our Terms of Service and Privacy Policy.
                            </Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};
