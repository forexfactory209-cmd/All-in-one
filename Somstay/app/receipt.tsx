import { Stack } from 'expo-router';
import { ReceiptScreen } from '@/src/screens/booking/ReceiptScreen/ReceiptScreen';

export default function Receipt() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <ReceiptScreen />
        </>
    );
}
