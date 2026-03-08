import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, SafeAreaView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '@/src/theme';

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
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={{ padding: 8 }}>
                    <Ionicons name="arrow-back" size={24} color={colors.dark} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Car Reservation</Text>
                <View style={{ width: 44 }} />
            </View>

            {/* Progress Bar Component */}
            <View style={styles.progressWrapper}>
                <View style={styles.progressContainer}>
                    {STEPS.map((step, index) => {
                        const isActive = index === currentStep;
                        const isCompleted = index < currentStep;
                        return (
                            <View key={index} style={styles.progressItem}>
                                <View style={[
                                    styles.progressCircle,
                                    isActive && styles.activeCircle,
                                    isCompleted && styles.completedCircle
                                ]}>
                                    {isCompleted ? (
                                        <Ionicons name="checkmark" size={16} color={colors.white} />
                                    ) : (
                                        <Text style={[styles.progressNumber, isActive && styles.activeNumber]}>{index + 1}</Text>
                                    )}
                                </View>
                                <Text style={[styles.progressText, isActive && styles.activeText]}>{step}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {renderStepContent()}
            </ScrollView>

            <View style={styles.footer}>
                {currentStep > 0 && (
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={handleBack}
                        disabled={loading}
                    >
                        <Text style={styles.backButtonText}>Previous</Text>
                    </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                    style={[
                        styles.nextButton, 
                        currentStep === 3 && styles.confirmButton,
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
        </SafeAreaView>
    );
};

export default CarBookingFlowScreen;
