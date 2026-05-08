import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Bell, MessageCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS } from '../constants/Theme';

interface TopBarProps {
    title: string;
    rightContent?: React.ReactNode;
}

export function TopBar({ title, rightContent }: TopBarProps) {
    const router = useRouter();

    return (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 24,
            paddingVertical: 14,
        }}>
            <Text style={{
                color: '#FFFFFF',
                fontSize: 22,
                fontWeight: '700',
                letterSpacing: -0.5,
            }}>
                {title}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {rightContent}
                <TouchableOpacity
                    onPress={() => router.push('/(tabs)/messages')}
                    activeOpacity={0.7}
                    style={{
                        padding: 9,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: 9999,
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.08)',
                    }}
                >
                    <MessageCircle color={COLORS.textSecondary} size={19} />
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                        padding: 9,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderRadius: 9999,
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.08)',
                    }}
                >
                    <Bell color={COLORS.textSecondary} size={19} />
                </TouchableOpacity>
            </View>
        </View>
    );
}
