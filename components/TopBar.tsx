import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { Bell, MessageCircle, X, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { api } from '../src/services/api';
import { getDisplayName } from '../src/utils/userIdentity';
import { COLORS } from '../constants/Theme';

interface TopBarProps {
    title: string;
    rightContent?: React.ReactNode;
}

export function TopBar({ title, rightContent }: TopBarProps) {
    const router = useRouter();
    const [notificationsVisible, setNotificationsVisible] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const [notificationRes, summaryRes] = await Promise.all([
                api.get('/notifications'),
                api.get('/notifications/summary'),
            ]);
            setNotifications(notificationRes.data.notifications || []);
            setUnreadNotifications(notificationRes.data.unreadCount || 0);
            setUnreadMessages(summaryRes.data.messages || 0);
        } catch (error) {
            console.warn('TopBar notifications load failed', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();
    }, []);

    const openNotifications = async () => {
        setNotificationsVisible(true);
        try {
            await api.patch('/notifications/read-all');
            setUnreadNotifications(0);
        } catch (error) {
            console.warn('Failed to mark notifications read', error);
        }
    };

    return (
        <>
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
                        {unreadMessages > 0 && (
                            <View style={{
                                position: 'absolute',
                                top: -2,
                                right: -2,
                                minWidth: 16,
                                height: 16,
                                borderRadius: 8,
                                backgroundColor: '#5EEAD4',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: 4,
                            }}>
                                <Text style={{ color: '#05070A', fontSize: 10, fontWeight: '800' }}>
                                    {unreadMessages > 9 ? '9+' : unreadMessages}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={openNotifications}
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
                        {unreadNotifications > 0 && (
                            <View style={{
                                position: 'absolute',
                                top: -2,
                                right: -2,
                                minWidth: 16,
                                height: 16,
                                borderRadius: 8,
                                backgroundColor: '#F59E0B',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingHorizontal: 4,
                            }}>
                                <Text style={{ color: '#05070A', fontSize: 10, fontWeight: '800' }}>
                                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            <Modal
                visible={notificationsVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setNotificationsVisible(false)}
            >
                <Pressable
                    onPress={() => setNotificationsVisible(false)}
                    style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' }}
                >
                    <Pressable
                        onPress={() => {}}
                        style={{
                            marginTop: 72,
                            marginHorizontal: 16,
                            borderRadius: 24,
                            backgroundColor: COLORS.surface,
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.08)',
                            overflow: 'hidden',
                            maxHeight: '55%',
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' }}>
                            <Text style={{ color: 'white', fontSize: 16, fontWeight: '700' }}>Notifications</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                <TouchableOpacity
                                    onPress={async () => {
                                        await api.patch('/notifications/read-all');
                                        setUnreadNotifications(0);
                                        await loadNotifications();
                                    }}
                                >
                                    <Text style={{ color: '#5EEAD4', fontSize: 12, fontWeight: '700' }}>Mark all read</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => setNotificationsVisible(false)}>
                                    <X color={COLORS.textSecondary} size={18} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {loading ? (
                            <View style={{ paddingVertical: 40 }}>
                                <ActivityIndicator color="#5EEAD4" />
                            </View>
                        ) : (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {notifications.map((notification) => (
                                    <TouchableOpacity
                                        key={notification.id}
                                        onPress={() => {
                                            setNotificationsVisible(false);
                                            if (notification.link) {
                                                router.push(notification.link as any);
                                            }
                                        }}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: 18,
                                            paddingVertical: 14,
                                            borderBottomWidth: 1,
                                            borderBottomColor: 'rgba(255,255,255,0.05)',
                                            backgroundColor: notification.isRead ? 'transparent' : 'rgba(94,234,212,0.04)',
                                        }}
                                    >
                                        <View style={{ flex: 1, paddingRight: 12 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                                                <Text style={{ color: 'white', fontWeight: '600' }}>{notification.title}</Text>
                                                {!notification.isRead && <View style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: '#5EEAD4' }} />}
                                            </View>
                                            <Text style={{ color: COLORS.textSecondary, fontSize: 13, lineHeight: 18 }}>{notification.body}</Text>
                                            {notification.actor && (
                                                <Text style={{ color: '#94A3B8', fontSize: 11, marginTop: 4 }}>
                                                    from @{getDisplayName(notification.actor)}
                                                </Text>
                                            )}
                                        </View>
                                        <ChevronRight color={COLORS.textSecondary} size={16} />
                                    </TouchableOpacity>
                                ))}
                                {notifications.length === 0 && (
                                    <View style={{ paddingVertical: 36, alignItems: 'center' }}>
                                        <Text style={{ color: COLORS.textSecondary }}>No notifications yet</Text>
                                    </View>
                                )}
                            </ScrollView>
                        )}
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}
