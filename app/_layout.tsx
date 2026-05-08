import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import Toast from 'react-native-toast-message';

import { AuthProvider } from '../src/context/AuthContext';
import { AnimatedSplashScreen } from '../components/AnimatedSplashScreen';
import '../global.css';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync().catch(() => {
    /* ignore */
});

const queryClient = new QueryClient();

export default function AppLayout() {
    const [appReady, setAppReady] = useState(false);
    const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                // Simulate some loading (e.g. font loading, auth check)
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (e) {
                console.warn('Error during app preparation:', e);
            } finally {
                setAppReady(true);
                try {
                    await SplashScreen.hideAsync();
                } catch (e) {
                    // Ignore errors if splash screen already hidden
                }
            }
        }

        prepare();
    }, []);

    if (!appReady) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <View style={styles.rootContainer}>
                        <Slot />
                        {!splashAnimationFinished && (
                            <AnimatedSplashScreen onFinish={() => setSplashAnimationFinished(true)} />
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
    },
});
