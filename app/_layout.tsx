import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack } from 'expo-router'; // Changed Slot to Stack
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import Toast from 'react-native-toast-message';

import { AuthProvider } from '../src/context/AuthContext';
import { AnimatedSplashScreen } from '../components/AnimatedSplashScreen';
import '../global.css';

SplashScreen.preventAutoHideAsync().catch(() => { });

const queryClient = new QueryClient();

export default function AppLayout() {
    const [appReady, setAppReady] = useState(false);
    const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Simulate loading
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (e) {
                console.warn(e);
            } finally {
                setAppReady(true);
                await SplashScreen.hideAsync();
            }
        }
        prepare();
    }, []);

    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <View style={styles.rootContainer}>
                        {/* Using Stack instead of Slot establishes the LinkingContext more reliably */}
                        <Stack screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        </Stack>

                        {(!appReady || !splashAnimationFinished) && (
                            <AnimatedSplashScreen
                                onFinish={() => setSplashAnimationFinished(true)}
                            />
                        )}
                    </View>
                    <Toast />
                </AuthProvider>
            </QueryClientProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: '#05070A', // Ensure no white flash
    },
});