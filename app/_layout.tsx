import "../global.css";
import "@walletconnect/react-native-compat";
import "react-native-get-random-values";
import { Buffer } from "buffer";
if (typeof global.Buffer === "undefined") {
  global.Buffer = Buffer;
}

import "react-native-gesture-handler";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import Toast from "react-native-toast-message";
import { AppKit, AppKitProvider } from "@reown/appkit-react-native";
import { appKit } from "../src/config/appkit.config";

import { AuthProvider, useAuth } from "../src/context/AuthContext";
import { Web3Provider } from "../src/context/Web3Context";
import { AnimatedSplashScreen } from "../components/AnimatedSplashScreen";

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

// 1. New Inner Component to handle Auth State Redirects
function NavigationNavigator({ isAppUiReady }: { isAppUiReady: boolean }) {
  const { token, user, isLoading: isAuthLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    console.log("[NAV] Effect fired:", {
      isAuthLoading,
      isAppUiReady,
      segments,
      token: !!token,
    });
    if (isAuthLoading || !isAppUiReady) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "onboarding";
    console.log("[NAV] Deciding route:", {
      inAuthGroup,
      inOnboardingGroup,
      hasToken: !!token,
      profileCompleted: user?.profileCompleted,
    });

    if (!token) {
      // 1. If not logged in, force them to the landing screen
      if (!inAuthGroup) {
        console.log("[NAV] → Redirecting to /(auth)/landing");
        router.replace("/(auth)/landing");
      }
    } else if (!user?.profileCompleted) {
      // 2. If logged in but onboarding is incomplete, force them to setup
      if (!inOnboardingGroup) {
        console.log("[NAV] → Redirecting to /onboarding/setup");
        router.replace("/onboarding/setup");
      }
    } else {
      // 3. If logged in and onboarding is complete, keep them in tabs
      if (inAuthGroup || inOnboardingGroup || !segments[0]) {
        console.log("[NAV] → Redirecting to /(tabs)");
        router.replace("/(tabs)");
      }
    }
  }, [token, user?.profileCompleted, isAuthLoading, segments, isAppUiReady]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
    </Stack>
  );
}

// 2. Outer Wrapper (Keeps all global context providers)
export default function AppLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  useEffect(() => {
    console.log("[LAYOUT] appReady changed:", appReady);
    async function prepare() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        console.log("[LAYOUT] Setting appReady = true");
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  // Stable reference — prevents AnimatedSplashScreen's effect from
  // restarting its timers on every parent re-render (inline arrow = new ref each render)
  const handleSplashFinish = useCallback(() => {
    console.log(
      "[LAYOUT] Splash finished → setting splashAnimationFinished = true",
    );
    setSplashAnimationFinished(true);
  }, []);

  // UI is ready only when assets are loaded and custom splash finishes fading
  const isAppUiReady = appReady && splashAnimationFinished;

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Web3Provider>
          <AuthProvider>
            <View style={styles.rootContainer}>
              {/* Call the newly isolated inner navigator component here */}
              <NavigationNavigator isAppUiReady={isAppUiReady} />

              {(!appReady || !splashAnimationFinished) && (
                <AnimatedSplashScreen onFinish={handleSplashFinish} />
              )}
            </View>
            <Toast />
            {/* Required: AppKitProvider puts the singleton in React context;
                AppKit renders the modal UI that reads from that context */}
            {appKit && (
              <AppKitProvider instance={appKit}>
                <AppKit />
              </AppKitProvider>
            )}
          </AuthProvider>
        </Web3Provider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#05070A",
  },
});
