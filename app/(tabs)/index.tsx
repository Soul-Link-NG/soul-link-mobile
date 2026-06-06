import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StatusBar,
    TextInput,
    Modal,
    ActivityIndicator,
    RefreshControl,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, Users, PlusCircle, X, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { ReflectionCard } from '../../src/components/ReflectionCard';
import { TopBar } from '../../components/TopBar';
import { api } from '../../src/services/api';
import { useAuth } from '../../src/context/AuthContext';
import { getAvatarInitial } from '../../src/utils/userIdentity';
import { Web3PulseLoader } from '../../components/Web3PulseLoader';
import Toast from 'react-native-toast-message';

type FeedTab = 'trending' | 'following';

const TABS: { key: FeedTab; label: string; Icon: React.ComponentType<any> }[] = [
    { key: 'trending', label: 'Trending', Icon: Flame },
    { key: 'following', label: 'Following', Icon: Users },
];

export default function HomeFeed() {
    const [feedType, setFeedType] = useState<FeedTab>('trending');
    const [reflections, setReflections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [newPostText, setNewPostText] = useState('');
    const [postTags, setPostTags] = useState('');
    const [postImages, setPostImages] = useState('');
    const [composeVisible, setComposeVisible] = useState(false);
    const [posting, setPosting] = useState(false);

    const { user, setUser } = useAuth();
    const router = useRouter();

    const fetchFeed = async () => {
        try {
            const endpoint =
                feedType === 'trending' ? '/reflections/trending' : '/reflections/following';
            const response = await api.get(endpoint);
            setReflections(response.data);
        } catch (error) {
            console.error('Feed fetch error:', error);
            Toast.show({ type: 'error', text1: 'Could not load feed' });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            fetchFeed();
        }, [feedType])
    );

    const handleRefresh = () => {
        setRefreshing(true);
        fetchFeed();
    };

    const handlePost = async () => {
        if (!newPostText.trim()) return;
        setPosting(true);
        try {
            const tags = postTags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);
            const imageUrls = postImages
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean);
            const res = await api.post('/reflections', {
                content: newPostText.trim(),
                topicTags: tags,
                imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
            });
            const createdReflection = res.data.reflection;
            if (createdReflection) {
                setReflections((prev) => [createdReflection, ...prev.filter((item) => item.id !== createdReflection.id)]);
            }
            if (res.data.updatedUser) {
                await setUser?.(res.data.updatedUser);
            } else if (res.data.rewardGranted && user) {
                await setUser?.({
                    ...user,
                    karmaBalance: (user.karmaBalance ?? 0) + 5,
                });
            }
            setNewPostText('');
            setPostTags('');
            setPostImages('');
            setComposeVisible(false);
            Toast.show({
                type: 'success',
                text1: 'Reflection posted!',
                text2: res.data.rewardGranted ? 'Mission completed. +5 KARMA awarded.' : undefined,
            });
            setLoading(true);
            fetchFeed();
        } catch (error: any) {
            console.error('Post error:', error);
            Toast.show({
                type: 'error',
                text1: 'Post failed',
                text2: error.response?.data?.message || 'Please try again',
            });
        } finally {
            setPosting(false);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#05070A' }}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                <TopBar title="SoulLink" />

                {/* Feed Toggle */}
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: 24,
                        gap: 8,
                        marginBottom: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(255,255,255,0.05)',
                    }}
                >
                    {TABS.map(({ key, label, Icon }) => {
                        const active = feedType === key;
                        return (
                            <TouchableOpacity
                                key={key}
                                onPress={() => setFeedType(key)}
                                activeOpacity={0.75}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 6,
                                    paddingVertical: 12,
                                    paddingHorizontal: 4,
                                    marginRight: 16,
                                    borderBottomWidth: 2,
                                    borderBottomColor: active ? '#5EEAD4' : 'transparent',
                                }}
                            >
                                <Icon size={16} strokeWidth={1.8} color={active ? '#5EEAD4' : '#64748B'} />
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: active ? '700' : '500',
                                        color: active ? '#5EEAD4' : '#64748B',
                                    }}
                                >
                                    {label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Feed List */}
                {loading ? (
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Web3PulseLoader size={84} />
                    </View>
                ) : (
                    <FlatList
                        data={reflections}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 100 }}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                                tintColor="#5EEAD4"
                            />
                        }
                        ListHeaderComponent={
                            <TouchableOpacity
                                onPress={() => setComposeVisible(true)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(255,255,255,0.04)',
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.08)',
                                    borderRadius: 16,
                                    paddingHorizontal: 16,
                                    paddingVertical: 14,
                                    marginBottom: 20,
                                    gap: 12,
                                }}
                                activeOpacity={0.7}
                            >
                                <View
                                    style={{
                                        width: 38,
                                        height: 38,
                                        borderRadius: 19,
                                        backgroundColor: 'rgba(94,234,212,0.15)',
                                        borderWidth: 1,
                                        borderColor: 'rgba(94,234,212,0.3)',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Text style={{ color: '#5EEAD4', fontWeight: 'bold', fontSize: 15 }}>
                                        {getAvatarInitial(user)}
                                    </Text>
                                </View>
                                <Text style={{ flex: 1, color: '#475569', fontSize: 15 }}>
                                    Share a reflection...
                                </Text>
                                <PlusCircle color="#5EEAD4" size={22} />
                            </TouchableOpacity>
                        }
                        ListEmptyComponent={
                            <View style={{ alignItems: 'center', paddingTop: 60 }}>
                                <Text style={{ color: '#64748B', fontSize: 15, textAlign: 'center' }}>
                                    {feedType === 'following'
                                        ? 'Follow some people to see their reflections here.'
                                        : 'No reflections yet. Be the first to share one!'}
                                </Text>
                            </View>
                        }
                        renderItem={({ item }) => (
                            <ReflectionCard
                                reflection={item}
                                onCommentPress={() => router.push(`/reflection/${item.id}`)}
                            />
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </SafeAreaView>

            {/* Compose Modal */}
            <Modal
                visible={composeVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setComposeVisible(false)}
            >
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
                        <View
                            style={{
                                backgroundColor: '#0F1219',
                                borderTopLeftRadius: 32,
                                borderTopRightRadius: 32,
                                padding: 24,
                                borderWidth: 1,
                                borderColor: 'rgba(255,255,255,0.08)',
                            }}
                        >
                            {/* Handle */}
                            <View
                                style={{
                                    width: 40,
                                    height: 4,
                                    backgroundColor: 'rgba(255,255,255,0.15)',
                                    borderRadius: 2,
                                    alignSelf: 'center',
                                    marginBottom: 20,
                                }}
                            />

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>
                                    New Reflection
                                </Text>
                                <TouchableOpacity onPress={() => setComposeVisible(false)}>
                                    <X color="#64748B" size={22} />
                                </TouchableOpacity>
                            </View>

                            {/* Content Input */}
                            <TextInput
                                value={newPostText}
                                onChangeText={setNewPostText}
                                placeholder="What's on your mind or soul today?"
                                placeholderTextColor="#475569"
                                style={{
                                    color: 'white',
                                    fontSize: 16,
                                    lineHeight: 24,
                                    backgroundColor: 'rgba(255,255,255,0.04)',
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.08)',
                                    borderRadius: 16,
                                    padding: 16,
                                    minHeight: 120,
                                    textAlignVertical: 'top',
                                    marginBottom: 12,
                                }}
                                multiline
                                autoFocus
                            />

                            {/* Tags Input */}
                            <TextInput
                                value={postTags}
                                onChangeText={setPostTags}
                                placeholder="Tags (comma-separated, e.g. Mindfulness, Web3)"
                                placeholderTextColor="#475569"
                                style={{
                                    color: 'white',
                                    fontSize: 14,
                                    backgroundColor: 'rgba(255,255,255,0.04)',
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.08)',
                                    borderRadius: 12,
                                    paddingHorizontal: 14,
                                    paddingVertical: 12,
                                    marginBottom: 20,
                                }}
                            />

                            <TextInput
                                value={postImages}
                                onChangeText={setPostImages}
                                placeholder="Image URLs (comma-separated, Cloudinary or image links)"
                                placeholderTextColor="#475569"
                                style={{
                                    color: 'white',
                                    fontSize: 14,
                                    backgroundColor: 'rgba(255,255,255,0.04)',
                                    borderWidth: 1,
                                    borderColor: 'rgba(255,255,255,0.08)',
                                    borderRadius: 12,
                                    paddingHorizontal: 14,
                                    paddingVertical: 12,
                                    marginBottom: 20,
                                }}
                            />

                            <TouchableOpacity
                                onPress={handlePost}
                                disabled={posting || !newPostText.trim()}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 8,
                                    backgroundColor: newPostText.trim() ? '#5EEAD4' : 'rgba(94,234,212,0.3)',
                                    borderRadius: 24,
                                    paddingVertical: 16,
                                }}
                            >
                                {posting ? (
                                    <ActivityIndicator color="#05070A" />
                                ) : (
                                    <>
                                        <Send color="#05070A" size={18} />
                                        <Text style={{ color: '#05070A', fontWeight: '700', fontSize: 16 }}>
                                            Post Reflection
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
}
