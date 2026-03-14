import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, ScrollView, Platform, KeyboardAvoidingView, SafeAreaView, Alert, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { styles } from './styles/SignupScreen.styles';
import { colors } from '@/src/theme';
import { useApp } from '@/src/context/AppContext';
import apiClient from '@/src/services/api/client';

export const SignupScreen: React.FC = () => {
    const router = useRouter();

    // Form state
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Date of Birth state
    const [dob, setDob] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Handlers
    const handlePickImage = async () => {
        // Ask for permission first
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert('Permission required', 'You need to grant camera roll permissions to add an avatar.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || dob;
        setShowDatePicker(Platform.OS === 'ios'); // Keep picker open on iOS, close on Android
        if (currentDate) {
            setDob(currentDate);
        }
    };

    const [isSubmitting, setIsSubmitting] = useState(false);
    const { setUser, returnUrl, setReturnUrl } = useApp();

    const handleSignup = async () => {
        // Basic validation
        if (!firstName || !lastName || !email || !phone || !password || !dob) {
            Alert.alert('Incomplete Form', 'Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);

        try {
            let uploadedImageUrl: string | null = null;

            // 1. Upload profile image if selected
            if (imageUri) {
                const formData = new FormData();
                const filename = imageUri.split('/').pop() || 'profile.jpg';
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image/jpeg`;

                // @ts-ignore
                formData.append('image', {
                    uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
                    name: filename,
                    type,
                });

                try {
                    const uploadResponse = await apiClient.post('/upload/image', formData, {
                        headers: { 
                            'Content-Type': 'multipart/form-data',
                        },
                        transformRequest: (data) => data, // Don't let axios transform the FormData
                    });
                    
                    if (uploadResponse.data && uploadResponse.data.success && uploadResponse.data.data) {
                        uploadedImageUrl = uploadResponse.data.data.url;
                    }
                } catch (uploadError) {
                    console.error('Image upload failed:', uploadError);
                }
            }

            // 2. Create the user
            const fullName = `${firstName} ${middleName} ${lastName}`.replace(/\s+/g, ' ').trim();
            const formattedDob = dob.toISOString().split('T')[0];

            const createResponse = await apiClient.post('/users', {
                full_name: fullName,
                email,
                phone,
                password,
                dob: formattedDob,
                profile_image: uploadedImageUrl,
                status: 'Active'
            });

            // 3. Update global user state
            if (createResponse.data && createResponse.data.success) {
                const userData = createResponse.data.data;
                setUser({
                    id: userData.id.toString(),
                    full_name: fullName,
                    email,
                    phone,
                    profile_image: uploadedImageUrl
                });

                setIsSubmitting(false);

                Alert.alert('Success', 'Account created successfully!', [
                    { 
                        text: 'OK', 
                        onPress: () => {
                            if (returnUrl) {
                                const url = returnUrl;
                                setReturnUrl(null); // Clear after use
                                router.replace(url as any);
                            } else {
                                router.replace('/(tabs)');
                            }
                        } 
                    }
                ]);
            } else {
                throw new Error(createResponse.data?.message || 'Failed to create account');
            }

        } catch (error: any) {
            setIsSubmitting(false);
            console.error('Signup error:', error);
            const errorMsg = error.response?.data?.message || error.message || 'An error occurred during signup.';
            Alert.alert('Signup Failed', errorMsg);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color={colors.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Account</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Avatar Picker */}
                    <View style={styles.imagePickerContainer}>
                        <TouchableOpacity onPress={handlePickImage}>
                            {imageUri ? (
                                <View>
                                    <Image source={{ uri: imageUri }} style={styles.avatarImage} />
                                    <View style={styles.addPhotoBadge}>
                                        <Ionicons name="pencil" size={16} color={colors.white} />
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Ionicons name="person-outline" size={40} color={colors.primary} />
                                    <View style={styles.addPhotoBadge}>
                                        <Ionicons name="add" size={20} color={colors.white} />
                                    </View>
                                </View>
                            )}
                        </TouchableOpacity>
                        <Text style={styles.addPhotoLabel}>Profile Photo</Text>
                    </View>

                    {/* Name: 3 boxes */}
                    <View style={styles.nameRow}>
                        <View style={[styles.inputContainer, styles.nameInputWrapper, { marginRight: 8, paddingHorizontal: 12 }]}>
                            <TextInput
                                style={styles.input}
                                placeholder="First Name"
                                placeholderTextColor="#999"
                                value={firstName}
                                onChangeText={setFirstName}
                            />
                        </View>
                        <View style={[styles.inputContainer, styles.nameInputWrapper, { marginRight: 8, paddingHorizontal: 12 }]}>
                            <TextInput
                                style={styles.input}
                                placeholder="M N"
                                placeholderTextColor="#999"
                                value={middleName}
                                onChangeText={setMiddleName}
                            />
                        </View>
                        <View style={[styles.inputContainer, styles.nameInputWrapper, { paddingHorizontal: 12 }]}>
                            <TextInput
                                style={styles.input}
                                placeholder="Last Name"
                                placeholderTextColor="#999"
                                value={lastName}
                                onChangeText={setLastName}
                            />
                        </View>
                    </View>

                    {/* Email */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Email Address"
                            placeholderTextColor="#999"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    {/* Phone Number */}
                    <View style={styles.inputContainer}>
                        <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            placeholderTextColor="#999"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>

                    {/* Custom Popup Date for DOB */}
                    <TouchableOpacity
                        style={styles.inputContainer}
                        onPress={() => setShowDatePicker(true)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="calendar-outline" size={20} color="#999" style={styles.inputIcon} />
                        <View style={styles.dobButton}>
                            {dob ? (
                                <Text style={styles.dobText}>
                                    {dob.toLocaleDateString()}
                                </Text>
                            ) : (
                                <Text style={styles.dobPlaceholder}>Date of Birth</Text>
                            )}
                        </View>
                    </TouchableOpacity>

                    {Platform.OS === 'ios' ? (
                        <Modal visible={showDatePicker} transparent animationType="slide">
                            <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                                <View style={{ backgroundColor: 'white', paddingBottom: 30 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderColor: '#EEE' }}>
                                        <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                            <Text style={{ color: '#999', fontSize: 16 }}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                                            <Text style={{ color: colors.primary, fontSize: 16, fontWeight: 'bold' }}>Done</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <DateTimePicker
                                        value={dob || new Date()}
                                        mode="date"
                                        display="spinner"
                                        textColor="black"
                                        onChange={onDateChange}
                                        maximumDate={new Date()}
                                    />
                                </View>
                            </View>
                        </Modal>
                    ) : (
                        showDatePicker && (
                            <DateTimePicker
                                value={dob || new Date()}
                                mode="date"
                                display="default"
                                onChange={(event, date) => {
                                    setShowDatePicker(false);
                                    if (date) setDob(date);
                                }}
                                maximumDate={new Date()}
                            />
                        )
                    )}
                    {/* For iOS, add a done button if using spinner inline. In real apps, often shown in a modal for iOS. 
                        Let's just show it, standard behavior. */}

                    {/* Password */}
                    <View style={styles.passwordContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#999"
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#999" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={isSubmitting}>
                        {isSubmitting ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.signupButtonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text style={styles.loginLink}>Log In</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
