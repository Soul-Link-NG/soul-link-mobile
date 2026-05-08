import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps, View } from 'react-native';
import { COLORS } from '../constants/Theme';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    className?: string;
    textClassName?: string;
    icon?: React.ReactNode;
}

export function Button({
    title,
    variant = 'primary',
    className = "",
    textClassName = "",
    icon,
    onPress,
    ...props
}: ButtonProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'primary':
                return `bg-[${COLORS.primary}] shadow-lg shadow-[${COLORS.primary}]/30`;
            case 'secondary':
                return `bg-[${COLORS.secondary}] shadow-lg shadow-[${COLORS.secondary}]/30`;
            case 'outline':
                return `bg-transparent border border-[${COLORS.primary}]`;
            case 'ghost':
                return 'bg-transparent';
            default:
                return `bg-[${COLORS.primary}]`;
        }
    };

    const getTextStyles = () => {
        switch (variant) {
            case 'outline':
            case 'ghost':
                return `text-[${COLORS.text}]`;
            default:
                return 'text-white font-bold';
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
            className={`rounded-xl py-4 px-6 flex-row justify-center items-center ${getVariantStyles()} ${className}`}
            {...props}
        >
            {icon && <View className="mr-2">{icon}</View>}
            <Text className={`text-center text-lg ${getTextStyles()} ${textClassName}`}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}
