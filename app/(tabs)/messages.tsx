import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MessageCircle, Search } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ScreenContainer';
import { GlassCard } from '../../components/GlassCard';
import { COLORS } from '../../constants/Theme';

export default function MessagesScreen() {
    return (
        <ScreenContainer className="px-4" edges={['top', 'left', 'right']}>
            <View className="flex-row justify-between items-center py-4">
                <Text className="text-2xl font-bold text-white">Messages</Text>
                <TouchableOpacity className="bg-[#1F2433] p-2 rounded-full">
                    <Search color={COLORS.textSecondary} size={20} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mt-2" contentContainerStyle={{ paddingBottom: 120 }}>

                {/* Chat List Item */}
                <TouchableOpacity>
                    <GlassCard className="mb-2 border-0 bg-transparent flex-row items-center p-2">
                        <View className={`w-14 h-14 rounded-full bg-[${COLORS.primary}]/20 items-center justify-center mr-4 relative`}>
                            <Text className="text-white font-bold text-lg">JS</Text>
                            <View className={`absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[${COLORS.accent}] border-2 border-[${COLORS.background}]`} />
                        </View>

                        <View className="flex-1 justify-center">
                            <View className="flex-row justify-between items-center mb-1">
                                <Text className="text-white font-bold text-base">Julia Smith</Text>
                                <Text className={`text-[${COLORS.textSecondary}] text-xs`}>10:42 AM</Text>
                            </View>
                            <Text className={`text-[${COLORS.textSecondary}] text-sm`} numberOfLines={1}>
                                Thanks for verifying my credentials on Reflex!
                            </Text>
                        </View>
                    </GlassCard>
                </TouchableOpacity>

                <TouchableOpacity>
                    <GlassCard className="mb-2 border-0 bg-transparent flex-row items-center p-2">
                        <View className={`w-14 h-14 rounded-full bg-[#1F2433] items-center justify-center mr-4 relative`}>
                            <Text className="text-white font-bold text-lg">DAO</Text>
                        </View>

                        <View className="flex-1 justify-center">
                            <View className="flex-row justify-between items-center mb-1">
                                <Text className="text-white font-bold text-base">KarmaFi Builders</Text>
                                <Text className={`text-[${COLORS.textSecondary}] text-xs`}>Yesterday</Text>
                            </View>
                            <Text className={`text-[${COLORS.textSecondary}] text-sm`} numberOfLines={1}>
                                New mission posted: Local beach cleanup.
                            </Text>
                        </View>
                    </GlassCard>
                </TouchableOpacity>

                <View className="h-10" />
            </ScrollView>
        </ScreenContainer>
    );
}
