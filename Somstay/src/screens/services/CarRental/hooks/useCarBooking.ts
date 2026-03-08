import { useState, useMemo } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { carService } from '@/src/services/api/carService';

export const useCarBooking = (car_id: string) => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    // Initial state matching user requirements
    const [formData, setFormData] = useState({
        pickup_date: new Date().toISOString().split('T')[0],
        return_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        pickup_location: 'Hargeisa Airport',
        dropoff_location: 'Hargeisa Airport',
        delivery_type: 'airport', // 'airport' or 'hotel'
        hotel_room: '',
        driver_info: {
            full_name: '',
            phone_number: '',
            email: '',
            dob: '2000-01-01',
            nationality: '',
            city: '',
            country: '',
            license_number: '',
            license_country: '',
            license_expiry: '2030-01-01',
            license_photo: null as string | null,
            passport_photo: null as string | null,
            selfie_photo: null as string | null,
            emergency_name: '',
            emergency_phone: '',
            emergency_relation: '',
        },
        insurance_plan: 'Basic',
        per_day_price: 40, // Base price should come from car details
        total_price: 120,
        deposit: 200,
    });

    const daysCount = useMemo(() => {
        const start = new Date(formData.pickup_date);
        const end = new Date(formData.return_date);
        const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
        return Math.max(diff, 1);
    }, [formData.pickup_date, formData.return_date]);

    const calculateTotal = useMemo(() => {
        const base = daysCount * formData.per_day_price;
        const insurance = formData.insurance_plan === 'Premium' ? 25 * daysCount : 0;
        return base + insurance;
    }, [daysCount, formData.per_day_price, formData.insurance_plan]);

    const handleNext = () => {
        if (currentStep === 0) {
            if (!formData.pickup_date || !formData.return_date) {
                Alert.alert('Missing Info', 'Please select pickup and return dates.');
                return;
            }
        }
        if (currentStep === 1) {
            const { full_name, phone_number, email } = formData.driver_info;
            if (!full_name || !phone_number || !email) {
                Alert.alert('Missing Info', 'Please fill in all driver details.');
                return;
            }
        }
        if (currentStep === 2) {
            if (!formData.driver_info.license_number) {
                 Alert.alert('Missing Info', 'Please provide a valid driver license number.');
                 return;
            }
        }

        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            submitBooking();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        } else {
            router.back();
        }
    };

    const submitBooking = async () => {
        setLoading(true);
        try {
            const payload = {
                ...formData,
                total_price: calculateTotal,
                car_id: parseInt(car_id),
                user_id: 1, // Get from Auth Context ideally
            };
            const response = await carService.createBooking(payload);
            if (response.success) {
                Alert.alert('Success', 'Your booking has been placed successfully!', [
                    { text: 'View Bookings', onPress: () => router.push('/(tabs)/booking') },
                    { text: 'OK', onPress: () => router.push('/') }
                ]);
            }
        } catch (error: any) {
             Alert.alert('Booking Failed', error.response?.data?.message || 'Something went wrong. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return { 
        currentStep, 
        formData, 
        setFormData, 
        handleNext, 
        handleBack, 
        loading, 
        daysCount, 
        totalPrice: calculateTotal 
    };
};
