import { Stack } from 'expo-router';
import { MapScreen } from '@/src/screens/map/MapScreen/MapScreen';

export default function MapRoute() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <MapScreen />
        </>
    );
}
