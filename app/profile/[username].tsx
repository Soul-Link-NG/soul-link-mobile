import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity,
    ActivityIndicator, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import { ReflectionCard } from '../../src/components/ReflectionCard';
import { api } from '../../src/services/api';
import { useAuth } from '../../src/context/AuthContext';
import { getDisplayName, getSoulId } from '../../src/utils/userIdentity';
import Toast from 'react-native-toast-message';

function Avatar({ name, size = 80 }: { name: string; size?: number }) {
    return (
        <View style={{
            width: size, height: size, borderRadius: size / 2,
            backgroundColor: 'rgba(94,234,212,0.15)',
            borderWidth: 2, borderColor: 'rgba(94,234,212,0.4)',
            alignItems: 'center', justifyContent: 'center',
        }}>
            <Text style={{ color: '#5EEAD4', fontWeight: '800', fontSize: size * 0.38 }}>
                {(name || '?')[0].toUpperCase()}
            </Text>
        </View>
    );
}

export default function PublicProfileScreen() {
    const { username } = useLocalSearchParams<{ username: string }>();
    const router = useRouter();
    const { user: me } = useAuth();

    const [profile, setProfile] = useState<any>(null);
    const [reflections, setReflections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [following, setFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);

    useEffect(() => {
        if (!username) return;
        const load = async () => {
            try {
                const profileRes = await api.get(`/profile/user/${username}`);
                const profileData = profileRes.data;
                setProfile(profileData);

                // Check if I follow this person
                if (me?.id) {
                    const myFollowingRes = await api.get(`/social/following/${me.id}`);
                    const isFollowing = myFollowingRes.data.some((u: any) => u.id === profileData.id);
                    setFollowing(isFollowing);
                }

                // Load their reflections
                const reflRes = await api.get(`/reflections/user/${profileData.id}`);
                // Add author info to each reflection
                const withAuthor = reflRes.data.map((r: any) => ({
                    ...r,
                    author: {
                        username: profileData.username,
                        displayName: getDisplayName(profileData),
                        isVerified: profileData.isVerified,
                    },
                }));
                setReflections(withAuthor);
            } catch (e) {
                console.error('Profile load error', e);
                Toast.show({ type: 'error', text1: 'Could not load profile' });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [username]);

    const handleFollowToggle = async () => {
        if (!profile) return;
        setFollowLoading(true);
        const wasFollowing = following;
        setFollowing(!wasFollowing);
        try {
            if (wasFollowing) {
                await api.delete(`/social/unfollow/${profile.id}`);
                Toast.show({ type: 'success', text1: `Unfollowed @${profile.username}` });
            } else {
                await api.post(`/social/follow/${profile.id}`);
                Toast.show({ type: 'success', text1: `Following @${profile.username}` });
            }
        } catch (e) {
            setFollowing(wasFollowing);
            Toast.show({ type: 'error', text1: 'Action failed' });
        } finally {
            setFollowLoading(false);
        }
    };

    const displayName = getDisplayName(profile);
    const soulId = getSoulId(profile);

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#05070A', alignItems: 'center', justifyContent: 'center' }}>
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" color="#5EEAD4" />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={{ flex: 1, backgroundColor: '#05070A', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#64748B', fontSize: 16 }}>User not found.</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
                    <Text style={{ color: '#5EEAD4', fontWeight: '700' }}>← Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isMe = me?.id === profile.id;

    return (
        <View style={{ flex: 1, backgroundColor: '#05070A' }}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                {/* Top bar */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' }}>
                    <TouchableOpacity onPress={() => router.back()} style={{ padding: 6, marginRight: 12 }}>
                        <ArrowLeft color="white" size={22} strokeWidth={1.8} />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontWeight: '700', fontSize: 17, flex: 1 }} numberOfLines={1}>
                        @{profile.username}
                    </Text>
                </View>

                <FlatList
                    data={reflections}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View>
                            {/* Profile info */}
                            <View style={{ alignItems: 'center', paddingVertical: 28 }}>
                                <Avatar name={displayName} size={88} />
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 16, marginBottom: 4 }}>
                                    <Text style={{ color: 'white', fontSize: 22, fontWeight: '800', textTransform: 'lowercase' }}>
                                        {displayName}
                                    </Text>
                                    {profile.isVerified && <CheckCircle2 color="#5EEAD4" size={20} fill="#5EEAD4" stroke="#05070A" />}
                                </View>
                                <Text style={{ color: '#64748B', fontSize: 15, marginBottom: 12 }}>@{profile.username}</Text>
                                {soulId ? (
                                    <Text style={{ color: '#5EEAD4', fontSize: 13, fontWeight: '700', marginBottom: 8, textTransform: 'lowercase' }}>
                                        {soulId}
                                    </Text>
                                ) : null}
                                {profile.bio ? (
                                    <Text style={{ color: '#94A3B8', textAlign: 'center', fontSize: 14, lineHeight: 21, paddingHorizontal: 20, marginBottom: 4 }}>
                                        {profile.bio}
                                    </Text>
                                ) : null}
                            </View>

                            {/* Stats */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#0F1219', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', padding: 20, marginBottom: 20 }}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: '800' }}>{profile._count?.reflections ?? 0}</Text>
                                    <Text style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>Reflections</Text>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: '800' }}>{profile._count?.followers ?? 0}</Text>
                                    <Text style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>Followers</Text>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: '800' }}>{profile._count?.following ?? 0}</Text>
                                    <Text style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>Following</Text>
                                </View>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 20, fontWeight: '800' }}>{profile.karmaBalance ?? 0}</Text>
                                    <Text style={{ color: '#64748B', fontSize: 12, marginTop: 2 }}>KARMA</Text>
                                </View>
                            </View>

                            {/* Interests */}
                            {profile.interests?.length > 0 && (
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                                    {profile.interests.map((interest: string) => (
                                        <View key={interest} style={{ backgroundColor: 'rgba(94,234,212,0.08)', borderWidth: 1, borderColor: 'rgba(94,234,212,0.2)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 999 }}>
                                            <Text style={{ color: '#5EEAD4', fontSize: 12 }}>{interest}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            {/* Follow / Unfollow (only for others) */}
                            {!isMe && (
                                <TouchableOpacity
                                    onPress={handleFollowToggle}
                                    disabled={followLoading}
                                    style={{
                                        backgroundColor: following ? 'transparent' : '#5EEAD4',
                                        borderWidth: following ? 1 : 0,
                                        borderColor: 'rgba(94,234,212,0.5)',
                                        borderRadius: 20,
                                        paddingVertical: 14,
                                        alignItems: 'center',
                                        marginBottom: 24,
                                    }}
                                >
                                    {followLoading ? (
                                        <ActivityIndicator color={following ? '#5EEAD4' : '#05070A'} />
                                    ) : (
                                        <Text style={{ color: following ? '#5EEAD4' : '#05070A', fontWeight: '800', fontSize: 15 }}>
                                            {following ? 'Following' : 'Follow'}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            )}

                            {/* Reflections header */}
                            <Text style={{ color: 'white', fontSize: 17, fontWeight: '700', marginBottom: 12 }}>
                                Reflections
                            </Text>
                        </View>
                    }
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
                            <Text style={{ color: '#64748B', fontSize: 14 }}>No reflections yet.</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <ReflectionCard
                            reflection={item}
                            onCommentPress={() => router.push(`/reflection/${item.id}`)}
                        />
                    )}
                />
            </SafeAreaView>
        </View>
    );
}
