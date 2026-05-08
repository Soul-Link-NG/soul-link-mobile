import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StatusBar, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Flame, Users, PlusCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { ReflectionCard } from '../../src/components/ReflectionCard';
import { TopBar } from '../../components/TopBar';

const MOCK_REFLECTIONS = [
    {
        id: '1',
        content: 'The universe is not outside of you. Look inside everything that you want, you already are.',
        topicTags: ['Mindfulness', 'Wisdom'],
        createdAt: '2026-04-10T10:00:00Z',
        author: { username: 'abulex', displayName: 'Abulex', isVerified: true },
        _count: { likes: 42, comments: 12 },
    },
    {
        id: '2',
        content: 'Building a decentralized future for social connection. One reflection at a time. 🌐✨',
        topicTags: ['Web3', 'SoulLink'],
        createdAt: '2026-04-10T11:00:00Z',
        author: { username: 'soulink', displayName: 'SoulLink', isVerified: true },
        _count: { likes: 88, comments: 24 },
    },
    {
        id: '3',
        content: 'Reflection is the mirror of the mind. Today, I am grateful for the small moments of silence.',
        topicTags: ['Gratitude', 'Silence'],
        createdAt: '2026-04-11T09:00:00Z',
        author: { username: 'zen_master', displayName: 'Zen Master', isVerified: false },
        _count: { likes: 15, comments: 5 },
    },
    {
        id: '4',
        content: 'Is truth discovered or created? Discuss.',
        topicTags: ['Philosophy', 'Truth'],
        createdAt: '2026-04-11T14:00:00Z',
        author: { username: 'philosopher_king', displayName: 'Phil', isVerified: true },
        _count: { likes: 120, comments: 45 },
    },
];

type FeedTab = 'trending' | 'following';

const TABS: { key: FeedTab; label: string; Icon: React.ComponentType<any> }[] = [
    { key: 'trending', label: 'Trending', Icon: Flame },
    { key: 'following', label: 'Following', Icon: Users },
];

export default function HomeFeed() {
    const [feedType, setFeedType] = useState<FeedTab>('trending');
    const [newReflection, setNewReflection] = useState('');
    const router = useRouter();

    const handlePostReflection = () => {
        if (newReflection.trim()) {
            console.log('Posting reflection:', newReflection);
            setNewReflection('');
        }
    };

    return (
        <View className="flex-1 bg-[#05070A]">
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
                                <Icon
                                    size={16}
                                    strokeWidth={1.8}
                                    color={active ? '#5EEAD4' : '#64748B'}
                                />
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
                <FlatList
                    data={MOCK_REFLECTIONS}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 80 }}
                    ListHeaderComponent={
                        <View className="mb-6">
                            <View className="flex-row items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                                <View className="w-10 h-10 rounded-full bg-[#5EEAD4]/20 items-center justify-center mr-3">
                                    <Text className="text-[#5EEAD4] font-bold">A</Text>
                                </View>
                                <TextInput
                                    className="flex-1 text-white text-base"
                                    placeholder="Share a reflection..."
                                    placeholderTextColor="#64748B"
                                    value={newReflection}
                                    onChangeText={setNewReflection}
                                    onSubmitEditing={handlePostReflection}
                                />
                                <TouchableOpacity onPress={handlePostReflection}>
                                    <PlusCircle color={newReflection ? '#5EEAD4' : '#64748B'} size={24} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <ReflectionCard
                            reflection={item}
                            onCommentPress={() => {
                                router.push(`/reflection/${item.id}`);
                            }}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </View>
    );
}