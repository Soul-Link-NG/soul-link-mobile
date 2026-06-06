import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Mail, Lock, User, Wallet } from 'lucide-react-native';
import { useAuth } from '../../src/context/AuthContext';
import { api } from "../../src/services/api";
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        displayName: '',
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleRegister = async () => {
        if (!formData.email || !formData.password || !formData.username) {
            Toast.show({
                type: 'error',
                text1: 'Required',
                text2: 'Please fill in Email, Password, and Username.',
            });
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/register', {
                email: formData.email,
                password: formData.password,
                username: formData.username,
                displayName: formData.displayName || undefined,
            });

            await login(response.data.token, response.data.user);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Account created successfully!',
            });
        } catch (error: any) {
            console.error('Registration error:', error);
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: error.response?.data?.message || 'Something went wrong',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#05070A]">
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 32 }}>
                        {/* Header */}
                        <TouchableOpacity 
                            onPress={() => router.back()}
                            className="mt-6 mb-10 w-12 h-12 bg-white/5 items-center justify-center rounded-full"
                        >
                            <ChevronLeft color="white" size={24} />
                        </TouchableOpacity>

                        <Text className="text-white text-4xl font-bold mb-2">Create Account</Text>
                        <Text className="text-slate-400 text-lg mb-10">Sign up to get started with SoulLink.</Text>

                        {/* Form */}
                        <View className="space-y-6">
                            <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center">
                                <User color="#94A3B8" size={20} />
                                <TextInput
                                    className="flex-1 ml-3 text-white text-lg"
                                    placeholder="Username"
                                    placeholderTextColor="#94A3B8"
                                    value={formData.username}
                                    onChangeText={(text) => setFormData({ ...formData, username: text })}
                                />
                            </View>

                            <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center">
                                <User color="#94A3B8" size={20} />
                                <TextInput
                                    className="flex-1 ml-3 text-white text-lg"
                                    placeholder="Display Name"
                                    placeholderTextColor="#94A3B8"
                                    value={formData.displayName}
                                    onChangeText={(text) => setFormData({ ...formData, displayName: text })}
                                />
                            </View>

                            <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center">
                                <Mail color="#94A3B8" size={20} />
                                <TextInput
                                    className="flex-1 ml-3 text-white text-lg"
                                    placeholder="Email"
                                    placeholderTextColor="#94A3B8"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={formData.email}
                                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                                />
                            </View>

                            <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center">
                                <Lock color="#94A3B8" size={20} />
                                <TextInput
                                    className="flex-1 ml-3 text-white text-lg"
                                    placeholder="Password"
                                    placeholderTextColor="#94A3B8"
                                    secureTextEntry
                                    value={formData.password}
                                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                                />
                            </View>

                            <TouchableOpacity 
                                onPress={handleRegister}
                                disabled={loading}
                                className={`py-5 rounded-3xl mt-6 shadow-lg ${loading ? 'bg-[#5EEAD4]/50' : 'bg-[#5EEAD4] shadow-[#5EEAD4]/20'}`}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#05070A" />
                                ) : (
                                    <Text className="text-[#05070A] text-center font-bold text-lg">Create Account</Text>
                                )}
                            </TouchableOpacity>

                            <View className="flex-row justify-center mt-6">
                                <Text className="text-slate-500">Already have an account? </Text>
                                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                                    <Text className="text-[#5EEAD4] font-bold">Login</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

