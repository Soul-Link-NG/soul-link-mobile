import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowUpRight, ArrowDownLeft, RefreshCw, Activity } from 'lucide-react-native';
import { GlassCard } from '../../components/GlassCard';
import { TopBar } from '../../components/TopBar';
import { COLORS } from '../../constants/Theme';

export default function WalletScreen() {
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

                    {/* Main Balance Card */}
                    <GlassCard className="mb-6 p-6 items-center">
                        <Text className={`text-[${COLORS.textSecondary}] text-sm mb-2`}>Total Assets Value</Text>
                        <Text className="text-4xl font-bold text-white mb-6">$1,240.50</Text>

                        <View className="flex-row justify-center w-full">
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
                        { symbol: 'SOUL', name: 'Identity Token', balance: '2,500', value: '$250.00', color: COLORS.primary },
                        { symbol: 'KARMA', name: 'KarmaFi Token', balance: '15,000', value: '$150.00', color: COLORS.accent },
                        { symbol: 'REFLECT', name: 'Reflex Token', balance: '4,200', value: '$840.50', color: COLORS.secondary },
                    ].map(token => (
                        <GlassCard key={token.symbol} className="mb-3 flex-row items-center justify-between">
                            <View className="flex-row items-center">
                                <View style={{ width: 40, height: 40, borderRadius: 9999, backgroundColor: `${token.color}22`, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                                    <Activity color={token.color} size={20} />
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
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
