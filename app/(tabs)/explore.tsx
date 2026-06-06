import React, { useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    FlatList,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Heart, MessageCircle, CheckCircle2, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { TopBar } from '../../components/TopBar';
import { api } from '../../src/services/api';
import { useAuth } from '../../src/context/AuthContext';
import Toast from 'react-native-toast-message';

// ── Helpers ────────────────────────────────────────────────────────────────────

function relativeTime(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
    return (
        <View style={{
            width: size, height: size, borderRadius: size / 2,
            backgroundColor: 'rgba(94,234,212,0.15)',
            borderWidth: 1, borderColor: 'rgba(94,234,212,0.3)',
            alignItems: 'center', justifyContent: 'center',
        }}>
            <Text style={{ color: '#5EEAD4', fontWeight: 'bold', fontSize: size * 0.38 }}>
                {(name || '?')[0].toUpperCase()}
            </Text>
        </View>
    );
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function ExploreScreen() {
    const router = useRouter();
    const { user: me } = useAuth();

    const [query, setQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [reflectionResults, setReflectionResults] = useState<any[]>([]);
    const [userResults, setUserResults] = useState<any[]>([]);
    const [popularTags, setPopularTags] = useState<string[]>([]);
    const [trendingReflections, setTrendingReflections] = useState<any[]>([]);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [followState, setFollowState] = useState<Record<string, boolean>>({});

    const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Load initial data
    React.useEffect(() => {
        const load = async () => {
            try {
                const [tagsRes, trendingRes] = await Promise.all([
                    api.get('/reflections/popular-tags'),
                    api.get('/reflections/trending'),
                ]);
                setPopularTags(tagsRes.data);
                setTrendingReflections(trendingRes.data);
            } catch (e) {
                console.error('Explore load error', e);
            } finally {
                setLoadingInitial(false);
            }
        };
        load();
    }, []);

    const handleSearch = (text: string) => {
        setQuery(text);
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        if (!text.trim()) {
            setReflectionResults([]);
            setUserResults([]);
            return;
        }
        debounceTimer.current = setTimeout(async () => {
            setSearching(true);
            try {
                const [reflRes, userRes] = await Promise.all([
                    api.get(`/reflections/search?q=${encodeURIComponent(text)}`),
                    api.get(`/social/search/users?q=${encodeURIComponent(text)}`),
                ]);
                setReflectionResults(reflRes.data);
                setUserResults(userRes.data);
            } catch (e) {
                console.error('Search error', e);
            } finally {
                setSearching(false);
            }
        }, 400);
    };

    const toggleFollow = async (userId: string) => {
        const isFollowing = followState[userId];
        setFollowState(prev => ({ ...prev, [userId]: !isFollowing }));
        try {
            if (isFollowing) {
                await api.delete(`/social/unfollow/${userId}`);
            } else {
                await api.post(`/social/follow/${userId}`);
            }
        } catch (e) {
            // Revert
            setFollowState(prev => ({ ...prev, [userId]: isFollowing }));
            Toast.show({ type: 'error', text1: 'Action failed' });
        }
    };

    const isSearching = query.trim().length > 0;

    return (
        <View style={{ flex: 1, backgroundColor: '#05070A' }}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                <TopBar title="Explore" />

                {/* Search bar */}
                <View style={{ paddingHorizontal: 24, paddingBottom: 12 }}>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, gap: 10,
                    }}>
                        {searching ? (
                            <ActivityIndicator size="small" color="#5EEAD4" />
                        ) : (
                            <Search color="#94A3B8" size={18} strokeWidth={1.5} />
                        )}
                        <TextInput
                            value={query}
                            onChangeText={handleSearch}
                            placeholder="Search reflections, people, topics…"
                            placeholderTextColor="#475569"
                            style={{ flex: 1, color: 'white', fontSize: 15 }}
                            returnKeyType="search"
                        />
                        {query.length > 0 && (
                            <TouchableOpacity onPress={() => { setQuery(''); setReflectionResults([]); setUserResults([]); }}>
                                <X color="#64748B" size={16} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                {loadingInitial && !isSearching ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#5EEAD4" />
                    </View>
                ) : isSearching ? (
                    /* ── Search Results ── */
                    <FlatList
                        data={[]}
                        ListHeaderComponent={
                            <View style={{ paddingHorizontal: 24 }}>
                                {/* User Results */}
                                {userResults.length > 0 && (
                                    <View style={{ marginBottom: 24 }}>
                                        <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 }}>
                                            People
                                        </Text>
                                        {userResults.filter(u => u.id !== me?.id).map(u => (
                                            <TouchableOpacity
                                                key={u.id}
                                                onPress={() => router.push(`/profile/${u.username}`)}
                                                style={{
                                                    flexDirection: 'row', alignItems: 'center',
                                                    backgroundColor: '#0F1219', borderRadius: 18,
                                                    borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)',
                                                    padding: 14, marginBottom: 10,
                                                }}
                                            >
                                                <Avatar name={u.displayName} size={44} />
                                                <View style={{ flex: 1, marginLeft: 12 }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                        <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>{u.displayName}</Text>
                                                        {u.isVerified && <CheckCircle2 color="#5EEAD4" size={13} fill="#5EEAD4" stroke="#05070A" />}
                                                    </View>
                                                    <Text style={{ color: '#64748B', fontSize: 12 }}>@{u.username}</Text>
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => toggleFollow(u.id)}
                                                    style={{
                                                        backgroundColor: followState[u.id] ? 'transparent' : '#5EEAD4',
                                                        borderWidth: followState[u.id] ? 1 : 0,
                                                        borderColor: 'rgba(94,234,212,0.4)',
                                                        paddingHorizontal: 16, paddingVertical: 7, borderRadius: 999,
                                                    }}
                                                >
                                                    <Text style={{ color: followState[u.id] ? '#5EEAD4' : '#05070A', fontWeight: '700', fontSize: 13 }}>
                                                        {followState[u.id] ? 'Following' : 'Follow'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}

                                {/* Reflection Results */}
                                {reflectionResults.length > 0 && (
                                    <View>
                                        <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 12 }}>
                                            Reflections
                                        </Text>
                                        {reflectionResults.map(r => (
                                            <TouchableOpacity
                                                key={r.id}
                                                onPress={() => router.push(`/reflection/${r.id}`)}
                                                style={{
                                                    backgroundColor: '#0F1219', borderWidth: 1,
                                                    borderColor: 'rgba(255,255,255,0.05)', borderRadius: 20,
                                                    padding: 16, marginBottom: 10,
                                                }}
                                            >
                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                                    <Avatar name={r.author?.displayName || 'U'} size={32} />
                                                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>{r.author?.displayName}</Text>
                                                    {r.author?.isVerified && <CheckCircle2 color="#5EEAD4" size={12} fill="#5EEAD4" stroke="#05070A" />}
                                                    <Text style={{ color: '#475569', fontSize: 11, marginLeft: 'auto' }}>{relativeTime(r.createdAt)}</Text>
                                                </View>
                                                <Text numberOfLines={2} style={{ color: '#CBD5E1', fontSize: 14, lineHeight: 21, marginBottom: 10 }}>
                                                    {r.content}
                                                </Text>
                                                <View style={{ flexDirection: 'row', gap: 14 }}>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                        <Heart color="#94A3B8" size={13} strokeWidth={1.5} />
                                                        <Text style={{ color: '#64748B', fontSize: 12 }}>{r._count?.likes ?? 0}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                        <MessageCircle color="#94A3B8" size={13} strokeWidth={1.5} />
                                                        <Text style={{ color: '#64748B', fontSize: 12 }}>{r._count?.comments ?? 0}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                )}

                                {!searching && reflectionResults.length === 0 && userResults.length === 0 && (
                                    <View style={{ alignItems: 'center', paddingTop: 60 }}>
                                        <Text style={{ color: '#64748B', fontSize: 15 }}>No results for "{query}"</Text>
                                    </View>
                                )}
                            </View>
                        }
                        renderItem={() => null}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={() => 'header'}
                    />
                ) : (
                    /* ── Discovery Feed ── */
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Popular Topics */}
                        <View style={{ marginTop: 8 }}>
                            <Text style={{ color: 'white', fontSize: 17, fontWeight: '700', paddingHorizontal: 24, marginBottom: 12 }}>
                                Popular Topics
                            </Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}>
                                {popularTags.map(topic => (
                                    <TouchableOpacity
                                        key={topic}
                                        onPress={() => handleSearch(topic)}
                                        activeOpacity={0.75}
                                        style={{
                                            backgroundColor: 'rgba(255,255,255,0.05)',
                                            borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
                                            paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14,
                                        }}
                                    >
                                        <Text style={{ color: '#5EEAD4', fontWeight: '600', fontSize: 13 }}>#{topic}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>

                        {/* Trending Reflections */}
                        <View style={{ marginTop: 32, paddingHorizontal: 24, paddingBottom: 100 }}>
                            <Text style={{ color: 'white', fontSize: 17, fontWeight: '700', marginBottom: 16 }}>
                                Trending
                            </Text>
                            {trendingReflections.map(r => (
                                <TouchableOpacity
                                    key={r.id}
                                    onPress={() => router.push(`/reflection/${r.id}`)}
                                    activeOpacity={0.8}
                                    style={{
                                        backgroundColor: '#0F1219', borderWidth: 1,
                                        borderColor: 'rgba(255,255,255,0.05)', borderRadius: 24,
                                        padding: 18, marginBottom: 12,
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                        <TouchableOpacity onPress={() => router.push(`/profile/${r.author?.username}`)}>
                                            <Avatar name={r.author?.displayName || 'U'} size={36} />
                                        </TouchableOpacity>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>{r.author?.displayName}</Text>
                                                {r.author?.isVerified && <CheckCircle2 color="#5EEAD4" size={13} fill="#5EEAD4" stroke="#05070A" />}
                                            </View>
                                            <Text style={{ color: '#64748B', fontSize: 12 }}>@{r.author?.username}</Text>
                                        </View>
                                        <Text style={{ color: '#475569', fontSize: 11 }}>{relativeTime(r.createdAt)}</Text>
                                    </View>
                                    <Text numberOfLines={2} style={{ color: '#CBD5E1', fontSize: 14, lineHeight: 21, marginBottom: 10 }}>
                                        {r.content}
                                    </Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                                        {(r.topicTags || []).map((tag: string) => (
                                            <View key={tag} style={{ backgroundColor: 'rgba(94,234,212,0.08)', borderWidth: 1, borderColor: 'rgba(94,234,212,0.2)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 999 }}>
                                                <Text style={{ color: '#5EEAD4', fontSize: 11 }}>#{tag}</Text>
                                            </View>
                                        ))}
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <Heart color="#94A3B8" size={15} strokeWidth={1.5} />
                                            <Text style={{ color: '#64748B', fontSize: 12 }}>{r._count?.likes ?? 0}</Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                            <MessageCircle color="#94A3B8" size={15} strokeWidth={1.5} />
                                            <Text style={{ color: '#64748B', fontSize: 12 }}>{r._count?.comments ?? 0}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                )}
            </SafeAreaView>
        </View>
    );
}