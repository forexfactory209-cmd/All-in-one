import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styles } from './CompleteProfileScreen.styles';
import { colors } from '@/src/theme';

export const CompleteProfileScreen: React.FC = () => {
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleFinish = () => {
        router.replace('/(tabs)');
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={colors.dark} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Complete Your Profile</Text>
                </View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        <View style={styles.content}>
                            <Text style={styles.subtitle}>Just a few more details to get you started.</Text>

                            {/* Photo Picker */}
                            <TouchableOpacity style={styles.photoContainer}>
                                <View style={styles.photoWrapper}>
                                    <Image
                                        source={{ uri: 'https://via.placeholder.com/150' }}
                                        style={styles.avatarImage}
                                    />
                                    <View style={styles.editPhotoButton}>
                                        <MaterialCommunityIcons name="pencil" size={16} color="#FFFFFF" />
                                    </View>
                                </View>
                                <Text style={styles.changePhotoText}>Change Photo</Text>
                            </TouchableOpacity>

                            {/* Form Fields */}
                            <View style={styles.formContainer}>
                                <View style={styles.fieldGroup}>
                                    <Text style={styles.fieldLabel}>Full Name</Text>
                                    <View style={styles.inputWrapper}>
                                        <Ionicons name="person-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="Enter your full name"
                                            placeholderTextColor="#9CA3AF"
                                            value={fullName}
                                            onChangeText={setFullName}
                                        />
                                    </View>
                                </View>

                                <View style={styles.fieldGroup}>
                                    <Text style={styles.fieldLabel}>Email (Optional)</Text>
                                    <View style={styles.inputWrapper}>
                                        <Ionicons name="mail-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="yourname@example.com"
                                            placeholderTextColor="#9CA3AF"
                                            value={email}
                                            onChangeText={setEmail}
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    </View>
                                </View>

                                <View style={styles.fieldGroup}>
                                    <Text style={styles.fieldLabel}>Date of Birth</Text>
                                    <View style={styles.inputWrapper}>
                                        <Ionicons name="calendar-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="Select your birth date"
                                            placeholderTextColor="#9CA3AF"
                                            value={dob}
                                            onChangeText={setDob}
                                        />
                                    </View>
                                </View>

                                <View style={styles.fieldGroup}>
                                    <Text style={styles.fieldLabel}>Set Password</Text>
                                    <View style={styles.inputWrapper}>
                                        <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.textInput}
                                            placeholder="Create a strong password"
                                            placeholderTextColor="#9CA3AF"
                                            secureTextEntry={!showPassword}
                                            value={password}
                                            onChangeText={setPassword}
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                            <Ionicons
                                                name={showPassword ? "eye-off-outline" : "eye-outline"}
                                                size={20}
                                                color="#9CA3AF"
                                            />
                                        </TouchableOpacity>
                                    </View>

                                    {/* Password Strength Indicator */}
                                    <View style={styles.passwordStrengthContainer}>
                                        <View style={[styles.strengthBar, styles.activeStrengthBar]} />
                                        <View style={[styles.strengthBar, styles.activeStrengthBar]} />
                                        <View style={styles.strengthBar} />
                                        <View style={styles.strengthBar} />
                                    </View>
                                    <Text style={styles.validationText}>Password must be at least 8 characters long.</Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.finishButton}
                                    onPress={handleFinish}
                                >
                                    <Text style={styles.finishButtonText}>Finish Setup</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                                </TouchableOpacity>

                                <Text style={styles.footerText}>
                                    By finishing setup, you agree to our{' '}
                                    <Text style={styles.footerLink}>Terms of Service</Text> and{' '}
                                    <Text style={styles.footerLink}>Privacy Policy.</Text>
                                </Text>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
};
