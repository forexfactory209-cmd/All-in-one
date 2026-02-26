import { Stack } from 'expo-router';
import { ConfirmPayScreen } from '@/src/screens/booking/ConfirmPayScreen/ConfirmPayScreen';

export default function ConfirmPay() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ConfirmPayScreen />
        </>
    );
}
