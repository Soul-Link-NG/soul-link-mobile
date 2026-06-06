import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Sparkles, CheckCircle2, Users, Heart } from 'lucide-react-native';
import { GlassCard } from '../../components/GlassCard';
import { TopBar } from '../../components/TopBar';
import { COLORS } from '../../constants/Theme';
import { useAuth } from '../../src/context/AuthContext';
import { SoulOrb } from '../../components/SoulOrb';

export default function WalletScreen() {
    const { user } = useAuth();
    const networkBadge = (
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F2433', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 9999, marginRight: 4 }}>
            <View style={{ width: 7, height: 7, borderRadius: 9999, backgroundColor: COLORS.accent, marginRight: 6 }} />
            <Text style={{ color: COLORS.textSecondary, fontSize: 11, fontWeight: '700' }}>Polygon</Text>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                <TopBar title="Wallet" rightContent={networkBadge} />

                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>

                    {/* Identity Hero */}
                    <GlassCard className="mb-6 p-5">
                        <View className="flex-row items-center justify-between mb-4">
                            <View>
                                <Text className="text-[#94A3B8] text-xs font-bold uppercase tracking-[2px] mb-2">Soul Vault</Text>
                                <Text className="text-white text-2xl font-bold mb-1">{user?.displayName || 'Your Soul'}</Text>
                                <Text className="text-[#5EEAD4] text-sm font-semibold">{user?.soulId || '@claim-your-soul.soul'}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                    <CheckCircle2 color="#5EEAD4" size={16} />
                                    <Text style={{ color: '#5EEAD4', fontSize: 12, fontWeight: '700' }}>Reputation Active</Text>
                                </View>
                                <Text style={{ color: COLORS.textSecondary, fontSize: 12 }}>Referral tier {user?.referralCount ?? 0}</Text>
                            </View>
                        </View>

                        <View className="items-center py-2">
                            <SoulOrb
                                size={164}
                                connected={Boolean(user?.walletAddress)}
                                karmaBalance={user?.karmaBalance ?? 0}
                            />
                        </View>

                        <View className="flex-row justify-between mt-5">
                            <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.04)', borderRadius: 18, padding: 14, marginRight: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' }}>
                                <Text style={{ color: COLORS.textSecondary, fontSize: 11, fontWeight: '700', marginBottom: 4 }}>SOUL</Text>
                                <Text style={{ color: 'white', fontSize: 22, fontWeight: '800' }}>{Math.max(100, (user?.referralCount ?? 0) * 10 + 100)}</Text>
                            </View>
                            <View style={{ flex: 1, backgroundColor: 'rgba(94,234,212,0.06)', borderRadius: 18, padding: 14, marginLeft: 8, borderWidth: 1, borderColor: 'rgba(94,234,212,0.14)' }}>
                                <Text style={{ color: '#5EEAD4', fontSize: 11, fontWeight: '700', marginBottom: 4 }}>KARMA</Text>
                                <Text style={{ color: 'white', fontSize: 22, fontWeight: '800' }}>{user?.karmaBalance ?? 0}</Text>
                            </View>
                        </View>

                        <View className="flex-row justify-center w-full mt-5">
                            <TouchableOpacity className="items-center mx-4">
                                <View className={`w-12 h-12 rounded-full bg-[${COLORS.primary}] items-center justify-center mb-2`}>
                                    <ArrowUpRight color="white" size={20} />
                                </View>
                                <Text className="text-white text-xs">Send</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="items-center mx-4">
                                <View className="w-12 h-12 rounded-full bg-[#1F2433] items-center justify-center mb-2">
                                    <ArrowDownLeft color="white" size={20} />
                                </View>
                                <Text className="text-white text-xs">Receive</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className="items-center mx-4">
                                <View className="w-12 h-12 rounded-full bg-[#1F2433] items-center justify-center mb-2">
                                    <RefreshCw color="white" size={20} />
                                </View>
                                <Text className="text-white text-xs">Swap</Text>
                            </TouchableOpacity>
                        </View>
                    </GlassCard>

                    {/* Tokens */}
                    <Text className="text-lg font-bold text-white mb-3">Your Tokens</Text>

                    {[
                        { symbol: 'SOUL', name: 'Identity Token', balance: String(Math.max(100, (user?.referralCount ?? 0) * 10 + 100)), value: 'Tiered by identity milestones', color: COLORS.primary },
                        { symbol: 'KARMA', name: 'Reputation Token', balance: String(user?.karmaBalance ?? 0), value: 'Earned through impact', color: COLORS.accent },
                    ].map(token => (
                        <GlassCard key={token.symbol} className="mb-3 flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View style={{ width: 40, height: 40, borderRadius: 9999, backgroundColor: `${token.color}22`, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                    <Sparkles color={token.color} size={20} />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-base">{token.symbol}</Text>
                                    <Text className={`text-[${COLORS.textSecondary}] text-xs`}>{token.name}</Text>
                                </View>
                            </View>
                            <View className="items-end">
                                <Text className="text-white font-bold text-base">{token.balance}</Text>
                                <Text className={`text-[${COLORS.textSecondary}] text-xs`}>{token.value}</Text>
                            </View>
                        </GlassCard>
                    ))}

                    {/* Missions */}
                    <Text className="text-lg font-bold text-white mb-3 mt-4">Missions</Text>

                    {[
                        { title: 'Claim your .soul ID', reward: '+10 KARMA', desc: 'Register and lock in your digital identity.', icon: Sparkles },
                        { title: 'Link 3 Souls', reward: '+50 KARMA', desc: 'Grow your trusted network.', icon: Users },
                        { title: 'First Reflection', reward: '+5 KARMA', desc: 'Publish your first thought to the feed.', icon: Heart },
                    ].map((mission) => (
                        <GlassCard key={mission.title} className="mb-3">
                            <View className="flex-row items-start justify-between">
                                <View style={{ flex: 1, paddingRight: 16 }}>
                                    <Text className="text-white font-bold text-base mb-1">{mission.title}</Text>
                                    <Text className={`text-[${COLORS.textSecondary}] text-sm mb-3`}>{mission.desc}</Text>
                                    <View style={{ alignSelf: 'flex-start', backgroundColor: 'rgba(94,234,212,0.1)', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 5 }}>
                                        <Text style={{ color: '#5EEAD4', fontSize: 11, fontWeight: '700' }}>{mission.reward}</Text>
                                    </View>
                                </View>
                                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center' }}>
                                    <mission.icon color="#5EEAD4" size={18} />
                                </View>
                            </View>
                        </GlassCard>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
