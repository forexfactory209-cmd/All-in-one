import { Stack } from 'expo-router';
import { TravelServicesScreen } from '@/src/screens/services/TravelServicesScreen/TravelServicesScreen';

export default function TravelServices() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <TravelServicesScreen />
        </>
    );
}
