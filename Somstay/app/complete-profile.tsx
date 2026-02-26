import { CompleteProfileScreen } from '@/src/screens/auth/CompleteProfileScreen/CompleteProfileScreen';
import { Stack } from 'expo-router';

export default function CompleteProfileRoute() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <CompleteProfileScreen />
        </>
    );
}
