import { Stack } from 'expo-router';
import { SearchResultsScreen } from '@/src/screens/home/SearchResultsScreen/SearchResultsScreen';

export default function SearchResultsRoute() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SearchResultsScreen />
        </>
    );
}
