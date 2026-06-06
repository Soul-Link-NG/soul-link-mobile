import React, { useState, useCallback } from 'react';
import {
    View, Text, ScrollView, FlatList, TouchableOpacity,
    Modal, TextInput, ActivityIndicator, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import {
    Grid, Bookmark, MessageSquare, CheckCircle2, X, Search, Users,
} from 'lucide-react-native';
import { ReflectionCard } from '../../src/components/ReflectionCard';
import { TopBar } from '../../components/TopBar';
import { useAuth } from '../../src/context/AuthContext';
import { api } from '../../src/services/api';
import { SoulOrb } from '../../components/SoulOrb';
import { getAvatarInitial, getDisplayName, getSoulId } from '../../src/utils/userIdentity';
import Toast from 'react-native-toast-message';

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
    return (
        <View style={{
            width: size, height: size, borderRadius: size / 2,
            backgroundColor: 'rgba(94,234,212,0.15)',
            borderWidth: 1.5, borderColor: 'rgba(94,234,212,0.3)',
            alignItems: 'center', justifyContent: 'center',
        }}>
            <Text style={{ color: '#5EEAD4', fontWeight: 'bold', fontSize: size * 0.38 }}>
                {(name || '?')[0].toUpperCase()}
            </Text>
        </View>
    );
}

export default function ProfileScreen() {
    const { user: authUser } = useAuth();
    const router = useRouter();

    const [profile, setProfile] = useState<any>(null);
    const [reflections, setReflections] = useState<any[]>([]);
    const [bookmarks, setBookmarks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState<'reflections' | 'bookmarks' | 'messages'>('reflections');

    // Followers/Following modal
    const [userListVisible, setUserListVisible] = useState(false);
    const [userListType, setUserListType] = useState<'Followers' | 'Following'>('Followers');
    const [userList, setUserList] = useState<any[]>([]);
    const [userListLoading, setUserListLoading] = useState(false);
    const [userListSearch, setUserListSearch] = useState('');

    const fetchData = async () => {
        if (!authUser?.id) return;
        try {
            const [profileRes, reflRes, bookRes] = await Promise.all([
                api.get('/profile/me'),
                api.get(`/reflections/user/${authUser.id}`),
                api.get('/reflections/bookmarks'),
            ]);
            setProfile(profileRes.data);
            setReflections(reflRes.data);
            setBookmarks(bookRes.data);
        } catch (e) {
            console.error('Soul fetch error', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchData();
        }, [authUser?.id])
    );

    const openUserList = async (type: 'Followers' | 'Following') => {
        setUserListType(type);
        setUserListSearch('');
        setUserListVisible(true);
        setUserListLoading(true);
        try {
            const endpoint = type === 'Followers'
                ? `/social/followers/${authUser!.id}`
                : `/social/following/${authUser!.id}`;
            const res = await api.get(endpoint);
            setUserList(res.data);
        } catch (e) {
            console.error('User list error', e);
            Toast.show({ type: 'error', text1: 'Failed to load list' });
        } finally {
            setUserListLoading(false);
        }
    };

    const filteredUserList = userList.filter(u => {
        const name = getDisplayName(u).toLowerCase();
        const usernameMatch = u.username?.toLowerCase().includes(userListSearch.toLowerCase()) ?? false;
        return name.includes(userListSearch.toLowerCase()) || usernameMatch;
    });

    const identity = profile || authUser;
    const displayName = getDisplayName(identity);
    const username = profile?.username || authUser?.username || '';
    const bio = profile?.bio || authUser?.bio || '';
    const stats = profile?._count || { reflections: 0, followers: 0, following: 0 };
    const karmaBalance = profile?.karmaBalance ?? authUser?.karmaBalance ?? 0;
    const referralCount = profile?.referralCount ?? authUser?.referralCount ?? 0;
    const soulId = getSoulId(identity);

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#05070A', alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#5EEAD4" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#05070A' }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                <TopBar title="Soul" />

                <FlatList
                    data={activeTab === 'reflections' ? reflections : activeTab === 'bookmarks' ? bookmarks : []}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor="#5EEAD4" />
                    }
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                    ListHeaderComponent={
                        <View>
                            {/* Avatar + Name */}
                            <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 20 }}>
                                <SoulOrb size={150} connected={Boolean(authUser?.walletAddress)} karmaBalance={karmaBalance} />
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 18, marginBottom: 4 }}>
                                    <Text style={{ color: 'white', fontSize: 22, fontWeight: '800', textTransform: 'lowercase' }}>{displayName}</Text>
                                    {profile?.isVerified && <CheckCircle2 color="#5EEAD4" size={20} fill="#5EEAD4" stroke="#05070A" />}
                                </View>
                                <Text style={{ color: '#64748B', fontSize: 15, marginBottom: 6 }}>@{username}</Text>
                                {soulId ? (
                                    <Text style={{ color: '#5EEAD4', fontSize: 13, fontWeight: '700', marginBottom: 10, textTransform: 'lowercase' }}>{soulId}</Text>
                                ) : null}
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                    <View style={{ backgroundColor: 'rgba(94,234,212,0.08)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 }}>
                                        <Text style={{ color: '#5EEAD4', fontSize: 11, fontWeight: '700' }}>{karmaBalance} KARMA</Text>
                                    </View>
                                    <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 }}>
                                        <Text style={{ color: '#CBD5E1', fontSize: 11, fontWeight: '700' }}>{referralCount} referrals</Text>
                                    </View>
                                </View>
                                {bio ? (
                                    <Text style={{ color: '#94A3B8', textAlign: 'center', fontSize: 14, lineHeight: 21, paddingHorizontal: 20 }}>{bio}</Text>
                                ) : null}
                            </View>

                            {/* Stats */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#0F1219', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', marginBottom: 20 }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: '800' }}>{stats.reflections}</Text>
                                    <Text style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>Reflections</Text>
                                </View>
                                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => openUserList('Followers')}>
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: '800' }}>{stats.followers}</Text>
                                    <Text style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>Followers</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => openUserList('Following')}>
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: '800' }}>{stats.following}</Text>
                                    <Text style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>Following</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Content Tabs */}
                            <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)', marginBottom: 16 }}>
                                {([
                                    { key: 'reflections', Icon: Grid },
                                    { key: 'bookmarks', Icon: Bookmark },
                                    { key: 'messages', Icon: MessageSquare },
                                ] as const).map(({ key, Icon }) => (
                                    <TouchableOpacity
                                        key={key}
                                        onPress={() => setActiveTab(key)}
                                        style={{
                                            flex: 1, alignItems: 'center', paddingVertical: 14,
                                            borderBottomWidth: 2,
                                            borderBottomColor: activeTab === key ? '#5EEAD4' : 'transparent',
                                        }}
                                    >
                                        <Icon color={activeTab === key ? '#5EEAD4' : '#475569'} size={20} />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Empty states for bookmarks / messages */}
                            {activeTab === 'bookmarks' && bookmarks.length === 0 && (
                                <View style={{ alignItems: 'center', paddingVertical: 60 }}>
                                    <Bookmark color="#1F2937" size={48} />
                                    <Text style={{ color: '#64748B', marginTop: 12, fontSize: 14 }}>Your saved reflections will appear here.</Text>
                                </View>
                            )}
                            {activeTab === 'messages' && (
                                <View style={{ alignItems: 'center', paddingVertical: 60 }}>
                                    <Users color="#1F2937" size={48} />
                                    <Text style={{ color: '#64748B', marginTop: 12, fontSize: 14 }}>Messages coming soon.</Text>
                                </View>
                            )}
                            {activeTab === 'reflections' && reflections.length === 0 && (
                                <View style={{ alignItems: 'center', paddingVertical: 60 }}>
                                    <Grid color="#1F2937" size={48} />
                                    <Text style={{ color: '#64748B', marginTop: 12, fontSize: 14 }}>No reflections posted yet.</Text>
                                </View>
                            )}
                        </View>
                    }
                    renderItem={({ item }) =>
                        activeTab !== 'messages' ? (
                            <ReflectionCard
                                reflection={item}
                                onCommentPress={() => router.push(`/reflection/${item.id}`)}
                            />
                        ) : null
                    }
                />
            </SafeAreaView>

            {/* Followers / Following Modal */}
            <Modal visible={userListVisible} animationType="slide" transparent onRequestClose={() => setUserListVisible(false)}>
                <View style={{ flex: 1, backgroundColor: '#05070A' }}>
                    <SafeAreaView style={{ flex: 1 }}>
                        {/* Header */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' }}>
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>{userListType}</Text>
                            <TouchableOpacity onPress={() => setUserListVisible(false)}>
                                <X color="white" size={22} />
                            </TouchableOpacity>
                        </View>

                        {/* Search */}
                        <View style={{ paddingHorizontal: 24, paddingVertical: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, gap: 10 }}>
                                <Search color="#64748B" size={16} />
                                <TextInput
                                    value={userListSearch}
                                    onChangeText={setUserListSearch}
                                    placeholder={`Search ${userListType.toLowerCase()}…`}
                                    placeholderTextColor="#475569"
                                    style={{ flex: 1, color: 'white', fontSize: 15 }}
                                />
                            </View>
                        </View>

                        {userListLoading ? (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <ActivityIndicator size="large" color="#5EEAD4" />
                            </View>
                        ) : (
                            <FlatList
                                data={filteredUserList}
                                keyExtractor={(item) => item.id}
                                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                                ListEmptyComponent={
                                    <View style={{ alignItems: 'center', paddingTop: 40 }}>
                                        <Text style={{ color: '#64748B' }}>No results found</Text>
                                    </View>
                                }
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setUserListVisible(false);
                                            router.push(`/profile/${item.username}`);
                                        }}
                                        style={{
                                            flexDirection: 'row', alignItems: 'center',
                                            paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
                                            gap: 14,
                                        }}
                                    >
                                        <Avatar name={getDisplayName(item)} size={44} />
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                <Text style={{ color: 'white', fontWeight: '700', fontSize: 15, textTransform: 'lowercase' }}>
                                                    {getDisplayName(item)}
                                                </Text>
                                                {item.isVerified && <CheckCircle2 color="#5EEAD4" size={13} fill="#5EEAD4" stroke="#05070A" />}
                                            </View>
                                            <Text style={{ color: '#64748B', fontSize: 13 }}>@{item.username}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                    </SafeAreaView>
                </View>
            </Modal>
        </View>
    );
}
