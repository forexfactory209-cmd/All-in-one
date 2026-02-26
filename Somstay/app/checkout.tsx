import { Stack } from 'expo-router';
import { CheckoutScreen } from '@/src/screens/booking/CheckoutScreen/CheckoutScreen';

export default function Checkout() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <CheckoutScreen />
        </>
    );
}
