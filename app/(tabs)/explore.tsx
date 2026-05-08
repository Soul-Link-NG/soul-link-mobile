import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Heart, MessageCircle, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { TopBar } from '../../components/TopBar';

// ── Mock data ─────────────────────────────────────────────────────────────────

const POPULAR_TOPICS = [
    'Mindfulness',
    'Web3',
    'Spirituality',
    'Community',
    'DeFi',
    'Wellness',
    'Philosophy',
    'Gratitude',
];

const TRENDING_REFLECTIONS = [
    {
        id: 'tr1',
        content:
            'The future of decentralized social networks is rooted in human connection, not technology. Tech is just the vessel.',
        author: { username: 'nura_v', displayName: 'Nura V', isVerified: true },
        createdAt: '2026-05-04T09:00:00Z',
        topicTags: ['Web3', 'Community'],
        _count: { likes: 312, comments: 48 },
    },
    {
        id: 'tr2',
        content: "Mindfulness isn't the absence of thought — it's the awareness that you are not your thoughts.",
        author: { username: 'solpath', displayName: 'Sol Path', isVerified: false },
        createdAt: '2026-05-05T14:30:00Z',
        topicTags: ['Mindfulness', 'Wellness'],
        _count: { likes: 189, comments: 31 },
    },
    {
        id: 'tr3',
        content:
            'Every soul carries a frequency. SoulLink is about finding those who vibrate on yours. 🌐✨',
        author: { username: 'axiom99', displayName: 'Axiom', isVerified: true },
        createdAt: '2026-05-06T07:15:00Z',
        topicTags: ['SoulLink', 'Spirituality'],
        _count: { likes: 521, comments: 76 },
    },
];

const SUGGESTED_USERS = [
    {
        id: 'u1',
        displayName: 'Mira Koda',
        username: 'mira_koda',
        isVerified: true,
        bio: 'Mindfulness · Web3 · Soul',
    },
    {
        id: 'u2',
        displayName: 'Levi Stone',
        username: 'levi_stone',
        isVerified: false,
        bio: 'DeFi · Philosophy · Community',
    },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

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
        <View
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: 'rgba(94,234,212,0.15)',
                borderWidth: 1,
                borderColor: 'rgba(94,234,212,0.3)',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Text style={{ color: '#5EEAD4', fontWeight: 'bold', fontSize: size * 0.38 }}>
                {name[0].toUpperCase()}
            </Text>
        </View>
    );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ExploreScreen() {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [following, setFollowing] = useState<Record<string, boolean>>({});

    const toggleFollow = (id: string) =>
        setFollowing((prev) => ({ ...prev, [id]: !prev[id] }));

    return (
        <View style={{ flex: 1, backgroundColor: '#05070A' }}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                <TopBar title="Explore" />

                {/* Search bar */}
                <View style={{ paddingHorizontal: 24, paddingBottom: 12 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: 16,
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            gap: 10,
                        }}
                    >
                        <Search color="#94A3B8" size={18} strokeWidth={1.5} />
                        <TextInput
                            value={query}
                            onChangeText={setQuery}
                            placeholder="Search reflections, people, topics…"
                            placeholderTextColor="#475569"
                            style={{ flex: 1, color: 'white', fontSize: 15 }}
                        />
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* ── Popular Topics ───────────────────────────────── */}
                    <View style={{ marginTop: 8 }}>
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 17,
                                fontWeight: '700',
                                paddingHorizontal: 24,
                                marginBottom: 12,
                            }}
                        >
                            Popular Topics
                        </Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 24, gap: 10, paddingRight: 40 }}
                        >
                            {POPULAR_TOPICS.map((topic) => (
                                <TouchableOpacity
                                    key={topic}
                                    activeOpacity={0.75}
                                    style={{
                                        backgroundColor: 'rgba(255,255,255,0.05)',
                                        borderWidth: 1,
                                        borderColor: 'rgba(255,255,255,0.1)',
                                        paddingHorizontal: 16,
                                        paddingVertical: 10,
                                        borderRadius: 14,
                                    }}
                                >
                                    <Text style={{ color: '#5EEAD4', fontWeight: '600', fontSize: 13 }}>
                                        #{topic}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* ── Trending Reflections ─────────────────────────── */}
                    <View style={{ marginTop: 32, paddingHorizontal: 24 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 16,
                            }}
                        >
                            <Text style={{ color: 'white', fontSize: 17, fontWeight: '700' }}>
                                Trending Reflections
                            </Text>
                            <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                                <Text style={{ color: '#5EEAD4', fontSize: 13 }}>See All</Text>
                                <ChevronRight color="#5EEAD4" size={14} strokeWidth={2} />
                            </TouchableOpacity>
                        </View>

                        {TRENDING_REFLECTIONS.map((reflection) => (
                            <TouchableOpacity
                                key={reflection.id}
                                activeOpacity={0.8}
                                onPress={() => router.push(`/reflection/${reflection.id}`)}
                                style={{
                                    backgroundColor: '#0F1219',
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.05)',
                                    borderRadius: 24,
                                    padding: 18,
                                    marginBottom: 12,
                                }}
                            >
                                {/* Author row */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 10,
                                        marginBottom: 12,
                                    }}
                                >
                                    <Avatar name={reflection.author.displayName} size={36} />
                                    <View style={{ flex: 1 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                            <Text style={{ color: 'white', fontWeight: '700', fontSize: 14 }}>
                                                {reflection.author.displayName}
                                            </Text>
                                            {reflection.author.isVerified && (
                                                <CheckCircle2
                                                    color="#5EEAD4"
                                                    size={13}
                                                    fill="#5EEAD4"
                                                    stroke="#05070A"
                                                />
                                            )}
                                        </View>
                                        <Text style={{ color: '#64748B', fontSize: 12 }}>
                                            @{reflection.author.username}
                                        </Text>
                                    </View>
                                    <Text style={{ color: '#475569', fontSize: 11 }}>
                                        {relativeTime(reflection.createdAt)}
                                    </Text>
                                </View>

                                {/* Content */}
                                <Text
                                    numberOfLines={2}
                                    style={{
                                        color: '#CBD5E1',
                                        fontSize: 14,
                                        lineHeight: 21,
                                        marginBottom: 12,
                                    }}
                                >
                                    {reflection.content}
                                </Text>

                                {/* Tags */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        gap: 6,
                                        marginBottom: 12,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    {reflection.topicTags.map((tag) => (
                                        <View
                                            key={tag}
                                            style={{
                                                backgroundColor: 'rgba(94,234,212,0.08)',
                                                borderWidth: 1,
                                                borderColor: 'rgba(94,234,212,0.2)',
                                                paddingHorizontal: 10,
                                                paddingVertical: 3,
                                                borderRadius: 999,
                                            }}
                                        >
                                            <Text style={{ color: '#5EEAD4', fontSize: 11 }}>
                                                #{tag}
                                            </Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Counts */}
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        gap: 16,
                                        paddingTop: 10,
                                        borderTopWidth: 1,
                                        borderTopColor: 'rgba(255,255,255,0.05)',
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <Heart color="#94A3B8" size={15} strokeWidth={1.5} />
                                        <Text style={{ color: '#64748B', fontSize: 12 }}>
                                            {reflection._count.likes}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                        <MessageCircle color="#94A3B8" size={15} strokeWidth={1.5} />
                                        <Text style={{ color: '#64748B', fontSize: 12 }}>
                                            {reflection._count.comments}
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* ── Suggested Users ──────────────────────────────── */}
                    <View style={{ marginTop: 8, paddingHorizontal: 24, paddingBottom: 100 }}>
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 17,
                                fontWeight: '700',
                                marginBottom: 16,
                            }}
                        >
                            Suggested for You
                        </Text>

                        {SUGGESTED_USERS.map((user) => {
                            const isFollowing = following[user.id];
                            return (
                                <View
                                    key={user.id}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: 16,
                                        backgroundColor: '#0F1219',
                                        borderWidth: 1,
                                        borderColor: 'rgba(255,255,255,0.05)',
                                        borderRadius: 20,
                                        padding: 14,
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                        <Avatar name={user.displayName} size={44} />
                                        <View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>
                                                    {user.displayName}
                                                </Text>
                                                {user.isVerified && (
                                                    <CheckCircle2
                                                        color="#5EEAD4"
                                                        size={13}
                                                        fill="#5EEAD4"
                                                        stroke="#05070A"
                                                    />
                                                )}
                                            </View>
                                            <Text style={{ color: '#64748B', fontSize: 12 }}>
                                                @{user.username}
                                            </Text>
                                            <Text style={{ color: '#475569', fontSize: 11, marginTop: 2 }}>
                                                {user.bio}
                                            </Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        onPress={() => toggleFollow(user.id)}
                                        style={{
                                            backgroundColor: isFollowing
                                                ? 'transparent'
                                                : '#5EEAD4',
                                            borderWidth: isFollowing ? 1 : 0,
                                            borderColor: 'rgba(94,234,212,0.4)',
                                            paddingHorizontal: 18,
                                            paddingVertical: 8,
                                            borderRadius: 999,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: isFollowing ? '#5EEAD4' : '#05070A',
                                                fontWeight: '700',
                                                fontSize: 13,
                                            }}
                                        >
                                            {isFollowing ? 'Following' : 'Follow'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}