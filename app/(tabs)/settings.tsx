import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    User, Shield, Wallet, Bell, Eye, ChevronRight,
    CheckCircle2, Lock, HelpCircle, LogOut, Link, ArrowRight,
} from 'lucide-react-native';
import { COLORS } from '../../constants/Theme';
import { TopBar } from '../../components/TopBar';
import { useAuth } from '../../src/context/AuthContext';

interface SettingItem {
    icon: any;
    label: string;
    sublabel?: string;
    badge?: string;
    badgeColor?: string;
    onPress: () => void;
    toggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (val: boolean) => void;
}

interface SettingGroup {
    title: string;
    items: SettingItem[];
}

export default function SettingsScreen() {
    const { logout } = useAuth();
    const router = useRouter();
    const [discoveryEnabled, setDiscoveryEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const groups: SettingGroup[] = [
        {
            title: 'Account',
            items: [
                {
                    icon: User,
                    label: 'Edit Profile',
                    sublabel: 'Name, photo, bio',
                    onPress: () => {},
                },
                {
                    icon: CheckCircle2,
                    label: 'Identity Verification',
                    sublabel: 'Verify your identity for trust badges',
                    badge: 'Optional',
                    badgeColor: '#F59E0B',
                    onPress: () => {},
                },
                {
                    icon: Wallet,
                    label: 'Connect Wallet',
                    sublabel: 'Own your identity on-chain',
                    badge: 'Optional',
                    badgeColor: '#6C5DD3',
                    onPress: () => {},
                },
            ],
        },
        {
            title: 'Privacy & Safety',
            items: [
                {
                    icon: Eye,
                    label: 'Discovery',
                    sublabel: 'Be found by like-minded people',
                    toggle: true,
                    toggleValue: discoveryEnabled,
                    onToggle: setDiscoveryEnabled,
                    onPress: () => {},
                },
                {
                    icon: Lock,
                    label: 'Privacy Tone',
                    sublabel: 'Quiet · Balanced · Open',
                    onPress: () => {},
                },
                {
                    icon: Shield,
                    label: 'Blocked Users',
                    onPress: () => {},
                },
            ],
        },
        {
            title: 'Notifications',
            items: [
                {
                    icon: Bell,
                    label: 'Push Notifications',
                    sublabel: 'Activity alerts and updates',
                    toggle: true,
                    toggleValue: notificationsEnabled,
                    onToggle: setNotificationsEnabled,
                    onPress: () => {},
                },
            ],
        },
        {
            title: 'Connections',
            items: [
                {
                    icon: Link,
                    label: 'Social Accounts',
                    sublabel: 'Twitter/X, Instagram, LinkedIn',
                    onPress: () => {},
                },
            ],
        },
        {
            title: 'Support',
            items: [
                {
                    icon: HelpCircle,
                    label: 'Help & FAQ',
                    onPress: () => {},
                },
            ],
        },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                <TopBar title="Settings" />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                    {/* Profile Card */}
                    <View style={{
                        marginHorizontal: 20,
                        marginBottom: 24,
                        marginTop: 8,
                        backgroundColor: '#0F1219',
                        borderRadius: 20,
                        padding: 20,
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.07)',
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <View style={{
                            width: 56,
                            height: 56,
                            borderRadius: 9999,
                            backgroundColor: `${COLORS.primary}22`,
                            borderWidth: 2,
                            borderColor: COLORS.primary,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 16,
                        }}>
                            <Text style={{ color: COLORS.primary, fontSize: 22, fontWeight: '700' }}>A</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>Abulex</Text>
                            <Text style={{ color: COLORS.textSecondary, fontSize: 14 }}>@abulex</Text>
                        </View>
                        <TouchableOpacity style={{
                            backgroundColor: `${COLORS.primary}20`,
                            borderRadius: 9999,
                            paddingHorizontal: 14,
                            paddingVertical: 8,
                        }}>
                            <Text style={{ color: COLORS.primary, fontWeight: '600', fontSize: 13 }}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Setting groups */}
                    {groups.map((group) => (
                        <View key={group.title} style={{ marginBottom: 8 }}>
                            <Text style={{
                                color: COLORS.textSecondary,
                                fontSize: 12,
                                fontWeight: '600',
                                letterSpacing: 0.8,
                                textTransform: 'uppercase',
                                marginHorizontal: 28,
                                marginBottom: 8,
                            }}>
                                {group.title}
                            </Text>
                            <View style={{
                                marginHorizontal: 20,
                                backgroundColor: '#0F1219',
                                borderRadius: 18,
                                borderWidth: 1,
                                borderColor: 'rgba(255,255,255,0.07)',
                                overflow: 'hidden',
                            }}>
                                {group.items.map((item, idx) => (
                                    <TouchableOpacity
                                        key={item.label}
                                        onPress={item.onPress}
                                        activeOpacity={item.toggle ? 1 : 0.7}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            paddingHorizontal: 18,
                                            paddingVertical: 15,
                                            borderBottomWidth: idx < group.items.length - 1 ? 1 : 0,
                                            borderBottomColor: 'rgba(255,255,255,0.05)',
                                        }}
                                    >
                                        <View style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 10,
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: 14,
                                        }}>
                                            <item.icon color={COLORS.textSecondary} size={18} />
                                        </View>

                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                                                    {item.label}
                                                </Text>
                                                {item.badge && (
                                                    <View style={{
                                                        backgroundColor: `${item.badgeColor}22`,
                                                        borderRadius: 9999,
                                                        paddingHorizontal: 8,
                                                        paddingVertical: 2,
                                                    }}>
                                                        <Text style={{ color: item.badgeColor, fontSize: 11, fontWeight: '600' }}>
                                                            {item.badge}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                            {item.sublabel && (
                                                <Text style={{ color: COLORS.textSecondary, fontSize: 13, marginTop: 2 }}>
                                                    {item.sublabel}
                                                </Text>
                                            )}
                                        </View>

                                        {item.toggle ? (
                                            <Switch
                                                value={item.toggleValue}
                                                onValueChange={item.onToggle}
                                                trackColor={{ false: '#1F2433', true: `${COLORS.primary}66` }}
                                                thumbColor={item.toggleValue ? COLORS.primary : '#64748B'}
                                            />
                                        ) : (
                                            <ChevronRight color="#3F4A5A" size={18} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}

                    {/* Logout */}
                    <TouchableOpacity
                        onPress={() => { logout?.(); router.replace('/(auth)/landing'); }}
                        activeOpacity={0.7}
                        style={{
                            marginHorizontal: 20,
                            marginTop: 16,
                            backgroundColor: 'rgba(239,68,68,0.08)',
                            borderRadius: 18,
                            borderWidth: 1,
                            borderColor: 'rgba(239,68,68,0.2)',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingVertical: 16,
                            gap: 8,
                        }}
                    >
                        <LogOut color="#EF4444" size={18} />
                        <Text style={{ color: '#EF4444', fontWeight: '700', fontSize: 15 }}>Sign Out</Text>
                    </TouchableOpacity>

                    <Text style={{
                        color: '#2A3444',
                        textAlign: 'center',
                        fontSize: 12,
                        marginTop: 24,
                    }}>
                        SoulLink v1.0.0
                    </Text>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
