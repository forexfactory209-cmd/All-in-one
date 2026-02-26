import { Stack } from 'expo-router';
import { PropertyDetailsScreen } from '@/src/screens/property/PropertyDetailsScreen/PropertyDetailsScreen';

export default function PropertyDetails() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <PropertyDetailsScreen />
        </>
    );
}
