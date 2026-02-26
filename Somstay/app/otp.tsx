import { OTPScreen } from '@/src/screens/auth/OTPScreen/OTPScreen';
import { Stack } from 'expo-router';

export default function OTPRoute() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <OTPScreen />
        </>
    );
}
