import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    ActivityIndicator,
    ScrollView,
    Image,
    useWindowDimensions,
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
import * as SecureStore from 'expo-secure-store';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getDisplayName } from '../utils/userIdentity';
import Toast from 'react-native-toast-message';

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
    user: {
        id: string;
        username: string;
        displayName: string;
    };
};

type Reflection = {
    id: string;
    content: string;
    imageUrl?: string;
    imageUrls?: string[];
    topicTags: string[];
    createdAt: string;
    author: Author;
    _count: { likes: number; comments: number };
};

type PostDetailProps = {
    reflection: Reflection;
    comments?: any[];
    onBack?: () => void;
    onRefresh?: () => void;
};

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
                {name ? name[0].toUpperCase() : '?'}
            </Text>
        </View>
    );
}

// ── Comment Row ───────────────────────────────────────────────────────────────

function CommentRow({ comment }: { comment: any }) {
    const router = useRouter();
    const displayName = getDisplayName(comment.user || comment.author);
    const username = comment.user?.username || comment.author?.username || 'anonymous';

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
                if (username === 'abulex') {
                    router.push('/(tabs)/soul');
                } else {
                    router.push(`/profile/${username}`);
                }
            }}>
                <Avatar name={displayName} size={36} />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
                {/* Author */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <TouchableOpacity onPress={() => {
                        if (username === 'abulex') {
                            router.push('/(tabs)/soul');
                        } else {
                            router.push(`/profile/${username}`);
                        }
                    }}>
                        <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>
                            {displayName}
                        </Text>
                    </TouchableOpacity>
                    <Text style={{ color: '#64748B', fontSize: 12, marginLeft: 'auto' }}>
                        {relativeTime(comment.createdAt)}
                    </Text>
                </View>

                {/* Body */}
                <Text style={{ color: '#CBD5E1', fontSize: 14, lineHeight: 20, marginBottom: 4 }}>
                    {comment.content}
                </Text>
            </View>
        </View>
    );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function PostDetail({ reflection, comments = [], onBack, onRefresh }: PostDetailProps) {
    const { user: currentUser } = useAuth();
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(reflection._count.likes);
    const [bookmarked, setBookmarked] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [commentsList, setCommentsList] = useState<any[]>(comments);
    const [postingReply, setPostingReply] = useState(false);
    const router = useRouter();
    const { width } = useWindowDimensions();

    useEffect(() => {
        setCommentsList(comments);
    }, [comments]);

    useEffect(() => {
        const checkInitialStates = async () => {
            try {
                const raw = await SecureStore.getItemAsync('bookmarks');
                const list: string[] = raw ? JSON.parse(raw) : [];
                if (list.includes(reflection.id)) {
                    setBookmarked(true);
                }
            } catch (e) {
                console.warn(e);
            }
        };
        checkInitialStates();
    }, [reflection.id]);

    const handleLike = async () => {
        const next = !liked;
        setLiked(next);
        setLikeCount((c) => (next ? c + 1 : c - 1));
        try {
            if (next) {
                await api.post(`/reflections/like/${reflection.id}`);
            } else {
                await api.delete(`/reflections/unlike/${reflection.id}`);
            }
        } catch (e) {
            console.error('Like error:', e);
            // revert
            setLiked(!next);
            setLikeCount((c) => (next ? c - 1 : c + 1));
        }
    };

    const handleBookmark = async () => {
        const next = !bookmarked;
        setBookmarked(next);
        try {
            if (next) {
                await api.post(`/reflections/bookmark/${reflection.id}`);
            } else {
                await api.delete(`/reflections/unbookmark/${reflection.id}`);
            }

            const raw = await SecureStore.getItemAsync('bookmarks');
            const list: string[] = raw ? JSON.parse(raw) : [];
            if (next) {
                if (!list.includes(reflection.id)) {
                    await SecureStore.setItemAsync('bookmarks', JSON.stringify([...list, reflection.id]));
                }
            } else {
                await SecureStore.setItemAsync(
                    'bookmarks',
                    JSON.stringify(list.filter((id) => id !== reflection.id))
                );
            }
        } catch (e) {
            console.error('Bookmark error:', e);
            setBookmarked(!next);
        }
    };

    const handleAddComment = async () => {
        if (!replyText.trim() || postingReply) return;
        setPostingReply(true);
        try {
            const response = await api.post(`/reflections/${reflection.id}/comments`, {
                content: replyText.trim(),
            });

            // Add new comment locally
            setCommentsList((prev) => [...prev, response.data]);
            setReplyText('');

            if (onRefresh) {
                onRefresh();
            }

            Toast.show({
                type: 'success',
                text1: 'Reply posted',
            });
        } catch (e) {
            console.error('Comment error:', e);
            Toast.show({
                type: 'error',
                text1: 'Failed to reply',
                text2: 'Please try again later.',
            });
        } finally {
            setPostingReply(false);
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
                    <TouchableOpacity onPress={() => {
                        if (reflection.author?.username === 'abulex') {
                            router.push('/(tabs)/soul');
                        } else {
                            router.push(`/profile/${reflection.author?.username || 'anonymous'}`);
                        }
                    }}>
                        <Avatar name={getDisplayName(reflection.author)} />
                    </TouchableOpacity>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text style={{ color: 'white', fontWeight: '700', fontSize: 15, textTransform: 'lowercase' }}>
                                {getDisplayName(reflection.author)}
                            </Text>
                            {reflection.author?.isVerified && (
                                <CheckCircle2 color="#5EEAD4" size={14} fill="#5EEAD4" stroke="#05070A" />
                            )}
                        </View>
                        <Text style={{ color: '#64748B', fontSize: 13 }}>@{reflection.author?.username || 'anonymous'}</Text>
                    </View>
                    <Text style={{ color: '#64748B', fontSize: 12 }}>{relativeTime(reflection.createdAt)}</Text>
                </View>

                {(reflection.imageUrls?.length || reflection.imageUrl) ? (
                    <View style={{ marginBottom: 16 }}>
                        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
                            {(reflection.imageUrls?.length ? reflection.imageUrls : [reflection.imageUrl]).filter(Boolean).map((uri, index) => (
                                <View key={`${reflection.id}-${index}`} style={{ width: Math.max(240, width - 84), marginRight: 10 }}>
                                    <Image
                                        source={{ uri: uri as string }}
                                        style={{
                                            width: Math.max(240, width - 84),
                                            height: 220,
                                            borderRadius: 20,
                                            backgroundColor: 'rgba(255,255,255,0.04)',
                                        }}
                                        resizeMode="cover"
                                    />
                                </View>
                            ))}
                        </ScrollView>
                        {((reflection.imageUrls?.length || 0) + (reflection.imageUrl ? 1 : 0)) > 1 && (
                            <Text style={{ color: '#64748B', fontSize: 11, textAlign: 'center', marginTop: 8 }}>
                                Swipe to view all images
                            </Text>
                        )}
                    </View>
                ) : null}

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
                    <Text style={{ color: '#64748B', fontSize: 13 }}><Text style={{ color: 'white', fontWeight: '600' }}>{commentsList.length}</Text> comments</Text>
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
                <Text style={{ color: 'white', fontWeight: '700', fontSize: 16 }}>Comments ({commentsList.length})</Text>
            </View>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#05070A' }}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right', 'bottom']}>

                {/* Top navigation */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' }}>
                    <TouchableOpacity onPress={onBack} style={{ padding: 4, marginRight: 12 }}>
                        <ArrowLeft color="white" size={22} strokeWidth={1.8} />
                    </TouchableOpacity>
                    <Text style={{ color: 'white', fontWeight: '700', fontSize: 17 }}>Reflection</Text>
                </View>

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <FlatList
                        data={commentsList}
                        keyExtractor={(item) => item.id}
                        ListHeaderComponent={ListHeader}
                        renderItem={({ item }) => <CommentRow comment={item} />}
                        contentContainerStyle={{
                            paddingHorizontal: 20,
                            paddingBottom: 20
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
                            paddingBottom: Platform.OS === 'ios' ? 20 : 12,
                            borderTopWidth: 1,
                            borderTopColor: 'rgba(255,255,255,0.06)',
                            backgroundColor: '#05070A',
                        }}
                    >
                        <Avatar name={getDisplayName(currentUser)} size={34} />
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
                                <TouchableOpacity onPress={handleAddComment} disabled={postingReply}>
                                    {postingReply ? (
                                        <ActivityIndicator size="small" color="#5EEAD4" />
                                    ) : (
                                        <Send color="#5EEAD4" size={18} strokeWidth={1.5} />
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
