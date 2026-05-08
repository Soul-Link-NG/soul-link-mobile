import React, { useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Heart,
    Bookmark,
    CheckCircle2,
    ArrowLeft,
    Send,
    MessageCircle,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Types ────────────────────────────────────────────────────────────────────

type Author = {
    username: string;
    displayName: string;
    isVerified: boolean;
    avatarUrl?: string;
};

type Comment = {
    id: string;
    content: string;
    createdAt: string;
    author: Author;
    _count: { likes: number };
};

type Reflection = {
    id: string;
    content: string;
    imageUrl?: string;
    topicTags: string[];
    createdAt: string;
    author: Author;
    _count: { likes: number; comments: number };
};

type PostDetailProps = {
    reflection: Reflection;
    comments?: Comment[];
    onBack?: () => void;
};

// ── Mock comments (remove when you have real data) ───────────────────────────

const MOCK_COMMENTS: Comment[] = [
    {
        id: 'c1',
        content: 'This really resonated with me. Thank you for sharing 🙏',
        createdAt: '2026-04-10T12:00:00Z',
        author: { username: 'luna_wren', displayName: 'Luna Wren', isVerified: false },
        _count: { likes: 7 },
    },
    {
        id: 'c2',
        content: 'Profound words. Saving this to revisit on hard days.',
        createdAt: '2026-04-10T13:00:00Z',
        author: { username: 'axiom99', displayName: 'Axiom', isVerified: true },
        _count: { likes: 14 },
    },
    {
        id: 'c3',
        content: 'I needed to hear this today more than I can say.',
        createdAt: '2026-04-10T14:30:00Z',
        author: { username: 'mira_k', displayName: 'Mira K', isVerified: false },
        _count: { likes: 3 },
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

function Avatar({ name, size = 40 }: { name: string; size?: number }) {
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
            <Text style={{ color: '#5EEAD4', fontWeight: 'bold', fontSize: size * 0.4 }}>
                {name[0].toUpperCase()}
            </Text>
        </View>
    );
}

// ── Comment Row ───────────────────────────────────────────────────────────────

function CommentRow({ comment }: { comment: Comment }) {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(comment._count.likes);
    const router = useRouter();

    return (
        <View
            style={{
                flexDirection: 'row',
                gap: 12,
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(255,255,255,0.05)',
            }}
        >
            <TouchableOpacity onPress={() => {
                if (comment.author.username === 'abulex') {
                    router.push('/(tabs)/soul');
                } else {
                    router.push(`/profile/${comment.author.username}`);
                }
            }}>
                <Avatar name={comment.author.displayName} size={36} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
                {/* Author */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <TouchableOpacity onPress={() => {
                        if (comment.author.username === 'abulex') {
                            router.push('/(tabs)/soul');
                        } else {
                            router.push(`/profile/${comment.author.username}`);
                        }
                    }}>
                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
                            {comment.author.displayName}
                        </Text>
                    </TouchableOpacity>
                    {comment.author.isVerified && (
                        <CheckCircle2 color="#5EEAD4" size={13} fill="#5EEAD4" stroke="#05070A" />
                    )}
                    <Text style={{ color: '#64748B', fontSize: 12, marginLeft: 'auto' }}>
                        {relativeTime(comment.createdAt)}
                    </Text>
                </View>

                {/* Body */}
                <Text style={{ color: '#CBD5E1', fontSize: 14, lineHeight: 20, marginBottom: 8 }}>
                    {comment.content}
                </Text>

                {/* Like */}
                <TouchableOpacity
                    onPress={() => {
                        setLiked((p) => {
                            setCount((c) => (p ? c - 1 : c + 1));
                            return !p;
                        });
                    }}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start' }}
                    activeOpacity={0.7}
                >
                    <Heart
                        color={liked ? '#F43F5E' : '#64748B'}
                        fill={liked ? '#F43F5E' : 'transparent'}
                        size={15}
                        strokeWidth={1.5}
                    />
                    <Text style={{ color: liked ? '#F43F5E' : '#64748B', fontSize: 12 }}>{count}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────


export function PostDetail({ reflection, comments = MOCK_COMMENTS, onBack }: PostDetailProps) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(reflection._count.likes);
    const [bookmarked, setBookmarked] = useState(false);
    const [replyText, setReplyText] = useState('');
    const router = useRouter();

    const handleLike = () => {
        setLiked((p) => {
            setLikeCount((c) => (p ? c - 1 : c + 1));
            return !p;
        });
    };

    const handleBookmark = async () => {
        const next = !bookmarked;
        setBookmarked(next);
        try {
            const raw = await AsyncStorage.getItem('bookmarks');
            const list: string[] = raw ? JSON.parse(raw) : [];
            if (next) {
                if (!list.includes(reflection.id)) {
                    await AsyncStorage.setItem('bookmarks', JSON.stringify([...list, reflection.id]));
                }
            } else {
                await AsyncStorage.setItem(
                    'bookmarks',
                    JSON.stringify(list.filter((id) => id !== reflection.id))
                );
            }
        } catch (e) {
            console.warn('Bookmark error', e);
        }
    };

    const ListHeader = () => (
        <View>
            <View
                style={{
                    backgroundColor: '#0F1219',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.05)',
                    borderRadius: 24,
                    padding: 20,
                    marginBottom: 8,
                }}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <TouchableOpacity onPress={() => router.push(`/profile/${reflection.author.username}`)}>
                        <Avatar name={reflection.author.displayName} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>
                                {reflection.author.displayName}
                            </Text>
                            {reflection.author.isVerified && (
                                <CheckCircle2 color="#5EEAD4" size={14} fill="#5EEAD4" stroke="#05070A" />
                            )}
                        </View>
                        <Text style={{ color: '#64748B', fontSize: 13 }}>@{reflection.author.username}</Text>
                    </View>
                    <Text style={{ color: '#64748B', fontSize: 12 }}>{relativeTime(reflection.createdAt)}</Text>
                </View>

                <Text style={{ color: 'white', fontSize: 18, lineHeight: 28, marginBottom: 16 }}>
                    {reflection.content}
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                    {reflection.topicTags.map((tag) => (
                        <View key={tag} style={{ backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
                            <Text style={{ color: '#5EEAD4', fontSize: 12 }}>#{tag}</Text>
                        </View>
                    ))}
                </View>

                <View style={{ flexDirection: 'row', gap: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', marginBottom: 14 }}>
                    <Text style={{ color: '#64748B', fontSize: 13 }}><Text style={{ color: 'white', fontWeight: '600' }}>{likeCount}</Text> likes</Text>
                    <Text style={{ color: '#64748B', fontSize: 13 }}><Text style={{ color: 'white', fontWeight: '600' }}>{reflection._count.comments}</Text> comments</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 28 }}>
                    <TouchableOpacity onPress={handleLike} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Heart color={liked ? '#F43F5E' : '#94A3B8'} fill={liked ? '#F43F5E' : 'transparent'} size={22} strokeWidth={1.5} />
                        <Text style={{ color: liked ? '#F43F5E' : '#94A3B8', fontSize: 14 }}>Like</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <MessageCircle color="#94A3B8" size={22} strokeWidth={1.5} />
                        <Text style={{ color: '#94A3B8', fontSize: 14 }}>Reply</Text>
                    </View>
                    <TouchableOpacity onPress={handleBookmark} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                        <Bookmark color={bookmarked ? '#5EEAD4' : '#94A3B8'} fill={bookmarked ? '#5EEAD4' : 'transparent'} size={22} strokeWidth={1.5} />
                        <Text style={{ color: bookmarked ? '#5EEAD4' : '#94A3B8', fontSize: 14 }}>{bookmarked ? 'Saved' : 'Save'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ paddingHorizontal: 4, paddingVertical: 12 }}>
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>Comments ({reflection._count.comments})</Text>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#05070A' }}>
            <StatusBar barStyle="light-content" />
            {/* FIX 1: Include 'bottom' in edges to respect Android/Samsung navigation buttons */}
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>

                {/* Top navigation */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' }}>
                    <TouchableOpacity onPress={onBack} style={{ padding: 4, marginRight: 12 }}>
                        <ArrowLeft color="white" size={22} strokeWidth={1.8} />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontWeight: '700', fontSize: 17 }}>Reflection</Text>
                </View>

                {/* FIX 2: Better Android Keyboard behavior */}
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <FlatList
                        data={comments}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={ListHeader}
                        renderItem={({ item }) => <CommentRow comment={item} />}
                        contentContainerStyle={{
                            paddingHorizontal: 20,
                            paddingBottom: 20 // Added a bit of breathing room at bottom of list
                        }}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Reply input */}
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 12,
                            paddingHorizontal: 20,
                            paddingTop: 12,
                            paddingBottom: Platform.OS === 'ios' ? 0 : 12, // Native padding if not handled by SafeArea
                            borderTopWidth: 1,
                            borderTopColor: 'rgba(255,255,255,0.06)',
                            backgroundColor: '#05070A',
                        }}
                    >
                        <Avatar name="Y" size={34} />
                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: '#0F1219',
                                borderWidth: 1,
                                borderColor: 'rgba(255,255,255,0.1)',
                                borderRadius: 999,
                                paddingHorizontal: 16,
                                paddingVertical: 8,
                                gap: 8,
                            }}
                        >
                            <TextInput
                                value={replyText}
                                onChangeText={setReplyText}
                                placeholder="Add a reply…"
                                placeholderTextColor="#475569"
                                style={{ flex: 1, color: 'white', fontSize: 14, paddingVertical: Platform.OS === 'android' ? 4 : 0 }}
                                multiline={false}
                            />
                            {replyText.length > 0 && (
                                <TouchableOpacity onPress={() => setReplyText('')}>
                                    <Send color="#5EEAD4" size={18} strokeWidth={1.5} />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}