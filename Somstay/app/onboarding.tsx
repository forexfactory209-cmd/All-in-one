import { OnboardingScreen } from '@/src/screens/auth/OnboardingScreen/OnboardingScreen';
import { Stack } from 'expo-router';

export default function OnboardingRoute() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <OnboardingScreen />
        </>
    );
}
