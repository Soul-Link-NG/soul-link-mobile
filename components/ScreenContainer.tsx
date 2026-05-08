import React from 'react';
import { View } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { COLORS } from '../constants/Theme';

interface ScreenContainerProps {
    children: React.ReactNode;
    className?: string;
    useSafeArea?: boolean;
    edges?: Edge[];
}

export function ScreenContainer({
    children,
    className = "",
    useSafeArea = true,
    edges = ['top', 'bottom', 'left', 'right']
}: ScreenContainerProps) {
    if (useSafeArea) {
        return (
            <SafeAreaView 
                edges={edges} 
                style={{ flex: 1, backgroundColor: COLORS.background }} 
                className={className}
            >
                {children}
            </SafeAreaView>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }} className={className}>
            {children}
        </View>
    );
}
