import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Settings, Share2, Grid, Bookmark, MessageSquare, CheckCircle2, X, Search, Wallet, Check } from 'lucide-react-native';
import { ReflectionCard } from '../../src/components/ReflectionCard';
import { TopBar } from '../../components/TopBar';
import { COLORS } from '../../constants/Theme';

const MOCK_USER = {
    username: 'abulex',
    displayName: 'Abulex',
    isVerified: true,
    bio: 'Building mindful, decentralized social experiences. Exploring the intersection of Web3 and well-being.',
    stats: { reflections: 124, followers: '12.5k', following: '450' },
};

const MOCK_MY_REFLECTIONS = [
    {
        id: '1',
        content: 'The universe is not outside of you. Look inside everything that you want, you already are.',
        topicTags: ['Mindfulness', 'Wisdom'],
        createdAt: '2026-04-10T10:00:00Z',
        author: { username: 'abulex', displayName: 'Abulex', isVerified: true },
        _count: { likes: 42, comments: 12 },
    },
];

const MOCK_FOLLOWERS = [
    { username: 'zen_master', displayName: 'Zen Master' },
    { username: 'philosopher_king', displayName: 'Phil' },
    { username: 'soulink', displayName: 'SoulLink' },
];

export default function ProfileScreen() {
    const [activeTab, setActiveTab] = useState<'reflections' | 'bookmarks' | 'tags'>('reflections');
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isWalletModalVisible, setIsWalletModalVisible] = useState(false);
    const [isUserListModalVisible, setIsUserListModalVisible] = useState(false);
    const [userListType, setUserListType] = useState<'Followers' | 'Following'>('Followers');
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    
    const [displayName, setDisplayName] = useState(MOCK_USER.displayName);
    const [bio, setBio] = useState(MOCK_USER.bio);
    
    const [isLinking, setIsLinking] = useState(false);
    const [isLinked, setIsLinked] = useState(false);

    const soulRightContent = (
        <TouchableOpacity
            style={{ padding: 9, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 9999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', marginRight: 4 }}
            activeOpacity={0.7}
        >
            <Share2 color={COLORS.textSecondary} size={19} />
        </TouchableOpacity>
    );

    const handleLinkWallet = () => {
        setIsLinking(true);
        setTimeout(() => {
            setIsLinking(false);
            setIsLinked(true);
            setTimeout(() => setIsWalletModalVisible(false), 1500);
        }, 2000);
    };

    const filteredUsers = MOCK_FOLLOWERS.filter(u => 
        u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View className="flex-1 bg-[#05070A]">
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                <TopBar title="Soul" rightContent={soulRightContent} />

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Profile Info */}
                    <View className="px-6 items-center mt-4">
                        <View className="w-24 h-24 rounded-full bg-[#5EEAD4]/20 items-center justify-center border-2 border-[#5EEAD4] mb-4">
                            <Text className="text-[#5EEAD4] text-3xl font-bold">{displayName[0]}</Text>
                        </View>
                        <View className="flex-row items-center space-x-1 mb-1">
                            <Text className="text-white text-2xl font-bold">{displayName}</Text>
                            <CheckCircle2 color="#5EEAD4" size={20} fill="#5EEAD4" stroke="#05070A" />
                        </View>
                        <Text className="text-slate-500 text-base mb-4">@{MOCK_USER.username}</Text>
                        <Text className="text-slate-300 text-center text-base px-4 leading-relaxed">{bio}</Text>
                    </View>

                    {/* Stats */}
                    <View className="flex-row justify-around px-10 py-8">
                        <View className="items-center">
                            <Text className="text-white text-xl font-bold">{MOCK_USER.stats.reflections}</Text>
                            <Text className="text-slate-500 text-sm">Reflections</Text>
                        </View>
                        <TouchableOpacity 
                            onPress={() => { setUserListType('Followers'); setIsUserListModalVisible(true); }}
                            className="items-center"
                        >
                            <Text className="text-white text-xl font-bold">{MOCK_USER.stats.followers}</Text>
                            <Text className="text-slate-500 text-sm">Followers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => { setUserListType('Following'); setIsUserListModalVisible(true); }}
                            className="items-center"
                        >
                            <Text className="text-white text-xl font-bold">{MOCK_USER.stats.following}</Text>
                            <Text className="text-slate-500 text-sm">Following</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Action Buttons */}
                    <View className="px-6 flex-row space-x-3 mb-8">
                        <TouchableOpacity 
                            onPress={() => setIsEditModalVisible(true)}
                            className="flex-1 bg-[#5EEAD4] py-3 rounded-2xl"
                        >
                            <Text className="text-[#05070A] text-center font-bold">Edit Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => setIsWalletModalVisible(true)}
                            className="flex-1 bg-white/5 border border-white/10 py-3 rounded-2xl"
                        >
                            <Text className="text-white text-center font-bold">{isLinked ? 'Wallet Linked' : 'Link Wallet'}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Tabs */}
                    <View className="flex-row border-b border-white/5 mb-6">
                        <TouchableOpacity onPress={() => setActiveTab('reflections')} className={`flex-1 items-center py-4 border-b-2 ${activeTab === 'reflections' ? 'border-[#5EEAD4]' : 'border-transparent'}`}>
                            <Grid color={activeTab === 'reflections' ? '#5EEAD4' : '#94A3B8'} size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab('bookmarks')} className={`flex-1 items-center py-4 border-b-2 ${activeTab === 'bookmarks' ? 'border-[#5EEAD4]' : 'border-transparent'}`}>
                            <Bookmark color={activeTab === 'bookmarks' ? '#5EEAD4' : '#94A3B8'} size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setActiveTab('tags')} className={`flex-1 items-center py-4 border-b-2 ${activeTab === 'tags' ? 'border-[#5EEAD4]' : 'border-transparent'}`}>
                            <MessageSquare color={activeTab === 'tags' ? '#5EEAD4' : '#94A3B8'} size={20} />
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    <View className="px-6 pb-20">
                        {activeTab === 'reflections' ? (
                            MOCK_MY_REFLECTIONS.map(item => <ReflectionCard key={item.id} reflection={item} />)
                        ) : activeTab === 'bookmarks' ? (
                            <View className="items-center py-20">
                                <Bookmark color="#1F2937" size={48} className="mb-4" />
                                <Text className="text-slate-500">Your saved reflections will appear here.</Text>
                            </View>
                        ) : (
                            <View className="items-center py-20">
                                <MessageSquare color="#1F2937" size={48} className="mb-4" />
                                <Text className="text-slate-500">Your tags and mentions will appear here.</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Edit Profile Modal */}
            <Modal visible={isEditModalVisible} animationType="slide" transparent>
                <View className="flex-1 justify-end bg-black/60">
                    <View className="bg-[#0F1219] rounded-t-3xl p-6 border-t border-white/10">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-xl font-bold">Edit Profile</Text>
                            <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                                <X color="white" size={24} />
                            </TouchableOpacity>
                        </View>
                        
                        <Text className="text-slate-400 mb-2">Display Name</Text>
                        <TextInput 
                            className="bg-white/5 border border-white/10 rounded-xl p-4 text-white mb-4"
                            value={displayName}
                            onChangeText={setDisplayName}
                        />
                        
                        <Text className="text-slate-400 mb-2">Bio</Text>
                        <TextInput 
                            className="bg-white/5 border border-white/10 rounded-xl p-4 text-white mb-8 h-24"
                            multiline
                            value={bio}
                            onChangeText={setBio}
                        />
                        
                        <TouchableOpacity 
                            onPress={() => setIsEditModalVisible(false)}
                            className="bg-[#5EEAD4] py-4 rounded-2xl"
                        >
                            <Text className="text-[#05070A] text-center font-bold">Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Link Wallet Modal */}
            <Modal visible={isWalletModalVisible} animationType="fade" transparent>
                <View className="flex-1 justify-center items-center bg-black/80 px-6">
                    <View className="bg-[#0F1219] rounded-3xl p-8 border border-white/10 w-full items-center">
                        <View className="w-16 h-16 rounded-full bg-[#5EEAD4]/20 items-center justify-center mb-6">
                            <Wallet color="#5EEAD4" size={32} />
                        </View>
                        <Text className="text-white text-2xl font-bold mb-2">Link Your Wallet</Text>
                        <Text className="text-slate-400 text-center mb-8">Connect your wallet to enable Web3 features and identity ownership.</Text>
                        
                        {isLinking ? (
                            <View className="items-center">
                                <ActivityIndicator color="#5EEAD4" size="large" />
                                <Text className="text-[#5EEAD4] mt-4 font-bold">Connecting to Provider...</Text>
                            </View>
                        ) : isLinked ? (
                            <View className="items-center">
                                <View className="bg-[#5EEAD4] rounded-full p-2 mb-4">
                                    <Check color="#05070A" size={32} />
                                </View>
                                <Text className="text-[#5EEAD4] font-bold">Wallet Successfully Linked!</Text>
                            </View>
                        ) : (
                            <TouchableOpacity 
                                onPress={handleLinkWallet}
                                className="bg-[#5EEAD4] py-4 rounded-2xl w-full"
                            >
                                <Text className="text-[#05070A] text-center font-bold">Connect Wallet</Text>
                            </TouchableOpacity>
                        )}
                        
                        {!isLinking && !isLinked && (
                            <TouchableOpacity onPress={() => setIsWalletModalVisible(false)} className="mt-4">
                                <Text className="text-slate-500 font-bold">Cancel</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </Modal>

            {/* Followers/Following Modal */}
            <Modal visible={isUserListModalVisible} animationType="slide" transparent>
                <View className="flex-1 bg-[#05070A]">
                    <SafeAreaView style={{ flex: 1 }}>
                        <View className="flex-row items-center justify-between px-6 py-4 border-b border-white/5">
                            <Text className="text-white text-xl font-bold">{userListType}</Text>
                            <TouchableOpacity onPress={() => setIsUserListModalVisible(false)}>
                                <X color="white" size={24} />
                            </TouchableOpacity>
                        </View>
                        
                        <View className="px-6 py-4">
                            <View className="flex-row items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                                <Search color="#64748B" size={20} />
                                <TextInput 
                                    className="flex-1 ml-3 text-white text-base"
                                    placeholder={`Search ${userListType.toLowerCase()}...`}
                                    placeholderTextColor="#64748B"
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                />
                            </View>
                        </View>
                        
                        <ScrollView className="px-6">
                            {filteredUsers.map(user => (
                                <View key={user.username} className="flex-row items-center justify-between py-4 border-b border-white/5">
                                    <View className="flex-row items-center space-x-3">
                                        <View className="w-12 h-12 rounded-full bg-white/10 items-center justify-center">
                                            <Text className="text-white font-bold">{user.displayName[0]}</Text>
                                        </View>
                                        <View>
                                            <Text className="text-white font-bold">{user.displayName}</Text>
                                            <Text className="text-slate-500">@{user.username}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity 
                                        onPress={() => {
                                            setIsUserListModalVisible(false);
                                            router.push(`/profile/${user.username}`);
                                        }}
                                        className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl"
                                    >
                                        <Text className="text-white font-bold text-xs">Profile</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </Modal>
        </View>
    );
}
