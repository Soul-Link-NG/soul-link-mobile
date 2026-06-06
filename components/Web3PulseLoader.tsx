import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

export function Web3PulseLoader({ size = 68 }: { size?: number }) {
    const pulse = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 1,
                    duration: 900,
                    useNativeDriver: true,
                }),
                Animated.timing(pulse, {
                    toValue: 0,
                    duration: 900,
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();
        return () => animation.stop();
    }, [pulse]);

    const scale = pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.92, 1.08],
    });

    const opacity = pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.45, 1],
    });

    return (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Animated.View
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: 1.5,
                    borderColor: 'rgba(94,234,212,0.42)',
                    backgroundColor: 'rgba(94,234,212,0.08)',
                    transform: [{ scale }],
                    opacity,
                    shadowColor: '#5EEAD4',
                    shadowOpacity: 0.3,
                    shadowRadius: 18,
                }}
            />
            <Animated.View
                style={{
                    position: 'absolute',
                    width: size * 0.5,
                    height: size * 0.5,
                    borderRadius: size * 0.25,
                    backgroundColor: '#5EEAD4',
                    opacity: pulse.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.2, 0.55],
                    }),
                }}
            />
        </View>
    );
}
