import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight, Contact, Leaf, Key } from 'lucide-react-native';

export default function LandingScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-[#05070A]">
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
                    <View className="flex-1 px-8 py-10 justify-between">

                        {/* Top Section */}
                        <View className="items-center pt-8 pb-4">
                            {/* Logo */}
                            <View className="items-center justify-center mb-4">
                                <Image
                                    source={require('../../assets/icon.png')}
                                    className="w-20 h-20"
                                    resizeMode="contain"
                                />
                            </View>
                            <Text className="text-white text-2xl font-bold mb-10">Soul-Link</Text>

                            {/* Hero Text */}
                            <Text className="text-white text-[40px] font-extrabold tracking-tighter text-center mb-6 leading-tight">
                                A space for meaningful identity.
                            </Text>
                            <Text className="text-slate-400 text-lg text-center px-2 leading-relaxed">
                                Reflect. Connect values. Own your digital self.
                            </Text>
                        </View>

                        {/* CTA Buttons */}
                        <View className="py-6">
                            <TouchableOpacity
                                onPress={() => router.push('/onboarding/setup')}
                                className="bg-[#b3f0cc] py-4 rounded-full items-center justify-center mb-4 shadow-lg shadow-[#b3f0cc]/20"
                            >
                                <Text className="text-[#05070A] font-bold text-lg">Begin your journey</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => router.push('/(auth)/login')}
                                className="items-center py-2"
                            >
                                <Text className="text-slate-300 font-semibold text-base">Login</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Features List */}
                        <View className="py-8 my-2 border-y border-white/10 space-y-6">
                            <View className="flex-row items-center px-2">
                                <View className="w-10 items-center justify-center">
                                    <Contact color="#718096" size={24} />
                                </View>
                                <Text className="text-slate-300 text-base ml-4 flex-1">
                                    <Text className="text-white font-bold tracking-wide">Identity</Text> over popularity
                                </Text>
                            </View>

                            <View className="flex-row items-center px-2">
                                <View className="w-10 items-center justify-center">
                                    <Leaf color="#718096" size={24} />
                                </View>
                                <Text className="text-slate-300 text-base ml-4 flex-1">
                                    <Text className="text-white font-bold tracking-wide">Reflection</Text> before reaction
                                </Text>
                            </View>

                            <View className="flex-row items-center px-2">
                                <View className="w-10 items-center justify-center">
                                    <Key color="#718096" size={24} />
                                </View>
                                <Text className="text-slate-300 text-base ml-4 flex-1">
                                    <Text className="text-white font-bold tracking-wide">Ownership</Text> without noise
                                </Text>
                            </View>
                        </View>

                        {/* Footer */}
                        <View className="items-center pb-6 pt-4">
                            <Text className="text-slate-400 text-sm text-center leading-relaxed">
                                <Text className="text-white font-bold">SoulLink</Text> is not a social network.{'\n'}
                                It's a place to align who you are.
                            </Text>
                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
