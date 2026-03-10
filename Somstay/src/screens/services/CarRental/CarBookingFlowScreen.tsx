import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing } from '@/src/theme';
import { useApp, useTheme } from '@/src/context/AppContext';

// Hooks & Styles
import { useCarBooking } from './hooks/useCarBooking';
import { styles } from './styles/CarBookingFlowScreen.styles';

// Components
import { StepDates } from './components/StepDates';
import { StepDriverInfo } from './components/StepDriverInfo';
import { StepDocuments } from './components/StepDocuments';
import { StepPayment } from './components/StepPayment';

const STEPS = ['Rental', 'Driver', 'Legal', 'Review'];

export const CarBookingFlowScreen: React.FC = () => {
    const { car_id } = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const { settings } = useApp();
    const theme = useTheme();
    const {
        currentStep,
        formData,
        setFormData,
        handleNext,
        handleBack,
        loading,
        daysCount,
        totalPrice
    } = useCarBooking(car_id as string);

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: return <StepDates formData={formData} setFormData={setFormData} />;
            case 1: return <StepDriverInfo formData={formData} setFormData={setFormData} />;
            case 2: return <StepDocuments formData={formData} setFormData={setFormData} />;
            case 3: return <StepPayment formData={formData} daysCount={daysCount} totalPrice={totalPrice} />;
            default: return null;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
            <StatusBar barStyle={settings.darkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

            <View style={[styles.header, { backgroundColor: theme.background }]}>
                <TouchableOpacity onPress={handleBack} style={{ padding: 8 }}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Car Reservation</Text>
                <View style={{ width: 44 }} />
            </View>

            {/* Progress Bar Component */}
            <View style={[styles.progressWrapper, { borderBottomColor: theme.border }]}>
                <View style={styles.progressContainer}>
                    {STEPS.map((step, index) => {
                        const isActive = index === currentStep;
                        const isCompleted = index < currentStep;
                        return (
                            <View key={index} style={styles.progressItem}>
                                <View style={[
                                    styles.progressCircle,
                                    { borderColor: isCompleted ? theme.success : (isActive ? theme.primary : theme.border) },
                                    (isActive || isCompleted) && { backgroundColor: isCompleted ? theme.success : theme.primary }
                                ]}>
                                    {isCompleted ? (
                                        <Ionicons name="checkmark" size={16} color={colors.white} />
                                    ) : (
                                        <Text style={[
                                            styles.progressNumber,
                                            { color: isActive ? colors.white : theme.textSecondary }
                                        ]}>{index + 1}</Text>
                                    )}
                                </View>
                                <Text style={[
                                    styles.progressText,
                                    { color: isActive ? theme.primary : theme.textSecondary }
                                ]}>{step}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            <ScrollView
                contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.background }]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {renderStepContent()}
            </ScrollView>

            <View style={[styles.footer, {
                backgroundColor: theme.card,
                borderTopColor: theme.border,
                paddingBottom: Math.max(insets.bottom, 16)
            }]}>
                {currentStep > 0 && (
                    <TouchableOpacity
                        style={[styles.backButton, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}
                        onPress={handleBack}
                        disabled={loading}
                    >
                        <Text style={[styles.backButtonText, { color: theme.text }]}>Previous</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        { backgroundColor: currentStep === 3 ? theme.success : theme.primary },
                        loading && styles.disabledButton
                    ]}
                    onPress={handleNext}
                    disabled={loading}
                    activeOpacity={0.8}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.white} />
                    ) : (
                        <Text style={styles.nextButtonText}>
                            {currentStep === 3 ? 'Confirm & Book' : 'Continue'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default CarBookingFlowScreen;
