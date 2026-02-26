import { Stack } from 'expo-router';
import { PaymentSuccessScreen } from '@/src/screens/booking/PaymentSuccessScreen/PaymentSuccessScreen';

export default function PaymentSuccessRoute() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <PaymentSuccessScreen />
        </>
    );
}
