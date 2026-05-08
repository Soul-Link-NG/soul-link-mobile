import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
    onFinish: () => void;
}

// Fallback components/hooks if Reanimated fails
let AnimatedView: any = View;
let useSharedValue: any = (val: any) => ({ value: val });
let useAnimatedStyle: any = () => ({});
let withRepeat: any = (anim: any) => anim;
let withTiming: any = (toValue: any) => toValue;
let withSequence: any = (...anims: any[]) => anims[0];
let FadeIn: any = { delay: () => ({}) };
let FadeOut: any = {};
let runOnJS: any = (fn: any) => fn;

let reanimatedLoaded = false;
try {
    const Reanimated = require('react-native-reanimated');
    AnimatedView = Reanimated.default.View;
    useSharedValue = Reanimated.useSharedValue;
    useAnimatedStyle = Reanimated.useAnimatedStyle;
    withRepeat = Reanimated.withRepeat;
    withTiming = Reanimated.withTiming;
    withSequence = Reanimated.withSequence;
    FadeIn = Reanimated.FadeIn;
    FadeOut = Reanimated.FadeOut;
    runOnJS = Reanimated.runOnJS;
    reanimatedLoaded = true;
} catch (e) {
    console.warn('Reanimated failed to load:', e);
}

export function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        // Absolute, unstoppable fail-safe: always finish after 3 seconds
        const timer = setTimeout(() => {
            onFinish();
            setIsFinished(true);
        }, 3000);

        if (reanimatedLoaded) {
            // Breathing animation for logo
            scale.value = withRepeat(
                withSequence(
                    withTiming(1.1, { duration: 1500 }),
                    withTiming(1, { duration: 1500 })
                ),
                -1,
                true
            );

            // Start fade out slightly before the fail-safe kicks in
            setTimeout(() => {
                opacity.value = withTiming(0, { duration: 800 });
            }, 2000);
        }

        return () => clearTimeout(timer);
    }, [onFinish, scale, opacity]);

    const animatedLogoStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const animatedContainerStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    if (isFinished) return null;

    return (
        <AnimatedView 
            style={[styles.container, animatedContainerStyle]}
            exiting={FadeOut}
        >
            <AnimatedView style={animatedLogoStyle}>
                <Image 
                    source={require('../assets/splash-icon.png')} 
                    style={styles.logo}
                    resizeMode="contain"
                />
            </AnimatedView>
            <AnimatedView entering={reanimatedLoaded ? FadeIn.delay(500) : undefined}>
                <Text style={styles.title}>Soul Link</Text>
            </AnimatedView>
        </AnimatedView>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#05070A',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
    logo: {
        width: width * 0.4,
        height: width * 0.4,
        marginBottom: 20,
    },
    title: {
        color: '#5EEAD4',
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
});
