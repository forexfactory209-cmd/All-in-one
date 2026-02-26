import { LoginScreen } from '@/src/screens/auth/LoginScreen/LoginScreen';
import { Stack } from 'expo-router';

export default function LoginRoute() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <LoginScreen />
        </>
    );
}
