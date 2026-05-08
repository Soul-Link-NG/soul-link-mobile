import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Share2, Grid, Bookmark, MessageSquare, CheckCircle2, UserPlus, UserMinus } from 'lucide-react-native';
import { ReflectionCard } from '../../src/components/ReflectionCard';
import { COLORS } from '../../constants/Theme';

const MOCK_OTHER_USERS: Record<string, any> = {
    'zen_master': {
        username: 'zen_master',
        displayName: 'Zen Master',
        isVerified: false,
        bio: 'Finding peace in the noise of the digital world. 🧘‍♂️',
        stats: { reflections: 45, followers: '1.2k', following: '88' },
        reflections: [
            {
                id: '3',
                content: 'Reflection is the mirror of the mind. Today, I am grateful for the small moments of silence.',
                topicTags: ['Gratitude', 'Silence'],
                createdAt: '2026-04-11T09:00:00Z',
                author: { username: 'zen_master', displayName: 'Zen Master', isVerified: false },
                _count: { likes: 15, comments: 5 },
            }
        ]
    },
    'philosopher_king': {
        username: 'philosopher_king',
        displayName: 'Phil',
        isVerified: true,
        bio: 'Exploring the depths of human thought and the future of social logic.',
        stats: { reflections: 210, followers: '50k', following: '12' },
        reflections: [
            {
                id: '4',
                content: 'Is truth discovered or created? Discuss.',
                topicTags: ['Philosophy', 'Truth'],
                createdAt: '2026-04-11T14:00:00Z',
                author: { username: 'philosopher_king', displayName: 'Phil', isVerified: true },
                _count: { likes: 120, comments: 45 },
            }
        ]
    }
};

export default function UserProfileScreen() {
    const { username } = useLocalSearchParams();
    const router = useRouter();
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState<'reflections' | 'tags'>('reflections');

    const user = MOCK_OTHER_USERS[username as string] || {
        username: username as string,
        displayName: username as string,
        isVerified: false,
        bio: 'No bio available.',
        stats: { reflections: 0, followers: '0', following: '0' },
        reflections: []
    };

    return (
        <View className="flex-1 bg-[#05070A]">
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                {/* Header Nav */}
                <View className="flex-row items-center justify-between px-6 py-4 border-b border-white/5">
                    <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/5 rounded-full">
                        <ArrowLeft color="white" size={20} />
                    </TouchableOpacity>
                    <Text className="text-white font-bold text-lg">Profile</Text>
                    <TouchableOpacity className="p-2 bg-white/5 rounded-full">
                        <Share2 color="white" size={20} />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Profile Info */}
                    <View className="px-6 items-center mt-6">
                        <View className="w-24 h-24 rounded-full bg-[#5EEAD4]/20 items-center justify-center border-2 border-[#5EEAD4] mb-4">
                            <Text className="text-[#5EEAD4] text-3xl font-bold">{user.displayName[0]}</Text>
                        </View>
                        <View className="flex-row items-center space-x-1 mb-1">
                            <Text className="text-white text-2xl font-bold">{user.displayName}</Text>
                            {user.isVerified && <CheckCircle2 color="#5EEAD4" size={20} fill="#5EEAD4" stroke="#05070A" />}
                        </View>
                        <Text className="text-slate-500 text-base mb-4">@{user.username}</Text>
                        <Text className="text-slate-300 text-center text-base px-4 leading-relaxed">{user.bio}</Text>
                    </View>

                    {/* Stats */}
                    <View className="flex-row justify-around px-10 py-8">
                        <View className="items-center">
                            <Text className="text-white text-xl font-bold">{user.stats.reflections}</Text>
                            <Text className="text-slate-500 text-sm">Reflections</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-white text-xl font-bold">{user.stats.followers}</Text>
                            <Text className="text-slate-500 text-sm">Followers</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-white text-xl font-bold">{user.stats.following}</Text>
                            <Text className="text-slate-500 text-sm">Following</Text>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="px-6 flex-row space-x-3 mb-8">
                        <TouchableOpacity 
                            onPress={() => setIsFollowing(!isFollowing)}
                            className={`flex-1 py-3 rounded-2xl flex-row items-center justify-center space-x-2 ${isFollowing ? 'bg-white/5 border border-white/10' : 'bg-[#5EEAD4]'}`}
                        >
                            {isFollowing ? (
                                <>
                                    <UserMinus color="white" size={18} />
                                    <Text className="text-white font-bold">Unfollow</Text>
                                </>
                            ) : (
                                <>
                                    <UserPlus color="#05070A" size={18} />
                                    <Text className="text-[#05070A] font-bold">Follow</Text>
                                </>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1 bg-white/5 border border-white/10 py-3 rounded-2xl">
                            <Text className="text-white text-center font-bold">Message</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tabs */}
                    <View className="flex-row border-b border-white/5 mb-6">
                        <TouchableOpacity onPress={() => setActiveTab('reflections')} className={`flex-1 items-center py-4 border-b-2 ${activeTab === 'reflections' ? 'border-[#5EEAD4]' : 'border-transparent'}`}>
                            <Grid color={activeTab === 'reflections' ? '#5EEAD4' : '#94A3B8'} size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab('tags')} className={`flex-1 items-center py-4 border-b-2 ${activeTab === 'tags' ? 'border-[#5EEAD4]' : 'border-transparent'}`}>
                            <MessageSquare color={activeTab === 'tags' ? '#5EEAD4' : '#94A3B8'} size={20} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View className="px-6 pb-20">
                        {user.reflections.length > 0 ? (
                            user.reflections.map((item: any) => <ReflectionCard key={item.id} reflection={item} />)
                        ) : (
                            <View className="items-center py-20">
                                <Text className="text-slate-500">No reflections yet.</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
