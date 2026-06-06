import React from 'react';
import { View } from 'react-native';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Compass, User, Wallet, Settings } from 'lucide-react-native';
import { COLORS } from '../../constants/Theme';

function TabIcon({ Icon, color, focused, size }: { Icon: any, color: string, focused: boolean, size: number }) {
    return (
        <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: focused ? 'rgba(94, 234, 212, 0.08)' : 'transparent',
            paddingHorizontal: 16,
            paddingVertical: 4,
            borderRadius: 12,
            marginTop: 4,
        }}>
            <Icon color={color} size={size} strokeWidth={focused ? 2.5 : 2} />
        </View>
    );
}

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#05070A',
                    borderTopWidth: 1,
                    borderTopColor: 'rgba(255,255,255,0.05)',
                    height: 68 + insets.bottom,
                    paddingBottom: Math.max(12, insets.bottom),
                    paddingTop: 8,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarActiveTintColor: '#5EEAD4',
                tabBarInactiveTintColor: '#64748B',
                tabBarShowLabel: true,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 4,
                },
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused, size }) => (
                        <TabIcon Icon={Home} color={color} focused={focused} size={22} />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: 'Explore',
                    tabBarIcon: ({ color, focused, size }) => (
                        <TabIcon Icon={Compass} color={color} focused={focused} size={22} />
                    ),
                }}
            />
            <Tabs.Screen
                name="soul"
                options={{
                    title: 'Soul',
                    tabBarIcon: ({ color, focused, size }) => (
                        <TabIcon Icon={User} color={color} focused={focused} size={22} />
                    ),
                }}
            />
            <Tabs.Screen
                name="wallet"
                options={{
                    title: 'Wallet',
                    tabBarIcon: ({ color, focused, size }) => (
                        <TabIcon Icon={Wallet} color={color} focused={focused} size={22} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, focused, size }) => (
                        <TabIcon Icon={Settings} color={color} focused={focused} size={22} />
                    ),
                }}
            />
            {/* Messages is accessible via top-bar icon, not the tab bar */}
            <Tabs.Screen
                name="messages"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}
