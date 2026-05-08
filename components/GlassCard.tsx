import React from 'react';
import { View, ViewProps } from 'react-native';
import { COLORS } from '../constants/Theme';

interface GlassCardProps extends ViewProps {
    children: React.ReactNode;
    className?: string;
}

export function GlassCard({ children, className = "", ...props }: GlassCardProps) {
    return (
        <View
            className={`rounded-2xl p-4 border border-[${COLORS.border}]/50 bg-[${COLORS.surface}] overflow-hidden shadow-lg ${className}`}
            style={{
                shadowColor: COLORS.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 5,
            }}
            {...props}
        >
            {/* Optional: Add a subtle gradient overlay or blur effect here if using expo-blur in future */}
            {children}
        </View>
    );
}
