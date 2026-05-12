import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Animated, Easing } from 'react-native';

const { width } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
    onFinish: () => void;
}

export function AnimatedSplashScreen({ onFinish }: AnimatedSplashScreenProps) {
    const [isFinished, setIsFinished] = useState(false);
    
    // Animation values
    const scale = useRef(new Animated.Value(1)).current;
    const opacity = useRef(new Animated.Value(1)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // 1. Breathing animation for logo (looping)
        const breathing = Animated.loop(
            Animated.sequence([
                Animated.timing(scale, {
                    toValue: 1.1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scale, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        // Start breathing
        breathing.start();

        // 2. Fade in text after 500ms
        Animated.timing(textOpacity, {
            toValue: 1,
            duration: 800,
            delay: 500,
            useNativeDriver: true,
        }).start();

        // 3. Overall fade out transition
        const fadeOutTimer = setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }).start();
        }, 2200);

        // 4. Cleanup and finish
        const finishTimer = setTimeout(() => {
            onFinish();
            setIsFinished(true);
        }, 3000);

        return () => {
            breathing.stop();
            clearTimeout(fadeOutTimer);
            clearTimeout(finishTimer);
        };
    }, [onFinish, scale, opacity, textOpacity]);

    if (isFinished) return null;

    return (
        <Animated.View 
            style={[
                styles.container, 
                { opacity: opacity }
            ]}
        >
            <Animated.View style={{ transform: [{ scale: scale }] }}>
                <Image 
                    source={require('../assets/splash-icon.png')} 
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>
            <Animated.View style={{ opacity: textOpacity }}>
                <Text style={styles.title}>Soul Link</Text>
            </Animated.View>
        </Animated.View>
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
