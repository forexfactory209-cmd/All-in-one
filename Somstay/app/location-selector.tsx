import { Stack } from 'expo-router';
import { LocationSelectorScreen } from '@/src/screens/search/LocationSelectorScreen/LocationSelectorScreen';

export default function LocationSelectorRoute() {
    return (
        <>
            <Stack.Screen options={{
                headerShown: false
            }} />
            <LocationSelectorScreen />
        </>
    );
}
