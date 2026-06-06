import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Circle } from 'react-native-svg';

type SoulOrbProps = {
  karmaBalance?: number;
  connected?: boolean;
  size?: number;
};

export function SoulOrb({ karmaBalance = 0, connected = true, size = 132 }: SoulOrbProps) {
  const pulse = useRef(new Animated.Value(0)).current;
  const ring = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const ringAnimation = Animated.loop(
      Animated.timing(ring, {
        toValue: 1,
        duration: 2600,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    pulseAnimation.start();
    ringAnimation.start();

    return () => {
      pulseAnimation.stop();
      ringAnimation.stop();
    };
  }, [pulse, ring]);

  const energized = connected && karmaBalance > 100;
  const advanced = connected && karmaBalance > 500;

  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, energized ? 1.05 : 1.02],
  });

  const glowOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.55, energized ? 0.95 : 0.7],
  });

  const ringRotation = ring.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const theme = connected
    ? {
        primary: '#5EEAD4',
        secondary: '#6C5DD3',
        core: '#0F1219',
        label: 'Ignited',
      }
    : {
        primary: '#64748B',
        secondary: '#334155',
        core: '#111827',
        label: 'Dormant',
      };

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      {advanced && (
        <Animated.View
          style={[
            styles.secondaryRing,
            {
              width: size + 28,
              height: size + 28,
              borderRadius: (size + 28) / 2,
              borderColor: theme.secondary,
              opacity: glowOpacity,
              transform: [{ rotate: ringRotation }],
            },
          ]}
        />
      )}

      <Animated.View
        style={[
          styles.orb,
          {
            width: size,
            height: size,
            transform: [{ scale }],
            shadowColor: theme.primary,
            shadowOpacity: energized ? 0.32 : 0.16,
          },
        ]}
      >
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Defs>
            <LinearGradient id="soul-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={theme.primary} stopOpacity={1} />
              <Stop offset="100%" stopColor={theme.secondary} stopOpacity={1} />
            </LinearGradient>
            <LinearGradient id="core-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={connected ? 0.24 : 0.08} />
              <Stop offset="100%" stopColor="#FFFFFF" stopOpacity={0.02} />
            </LinearGradient>
          </Defs>

          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 2}
            fill="url(#soul-gradient)"
            opacity={connected ? 0.95 : 0.5}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 14}
            fill={theme.core}
            opacity={0.88}
          />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 28}
            fill="url(#core-gradient)"
            opacity={connected ? 0.34 : 0.14}
          />
        </Svg>

        <View style={styles.centerLabel} pointerEvents="none">
          <Text style={[styles.label, { color: theme.primary }]}>{theme.label}</Text>
          <Text style={styles.balance}>{karmaBalance}</Text>
          <Text style={styles.caption}>KARMA</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 26,
    elevation: 12,
  },
  secondaryRing: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  balance: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 30,
  },
  caption: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginTop: 2,
  },
});
