import React from 'react';
import { SignupScreen } from '@/src/screens/auth/SignupScreen/SignupScreen';
import { Stack } from 'expo-router';

export default function SignupRoute() {
    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <SignupScreen />
        </>
    );
}
