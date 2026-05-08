import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    TouchableOpacity, 
    KeyboardAvoidingView, 
    Platform, 
    ScrollView, 
    ActivityIndicator,
    Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, ArrowLeft, Eye, EyeOff, Send, CheckCircle2, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { api } from '../../src/services/api';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isForgotModalVisible, setIsForgotModalVisible] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [forgotLoading, setForgotLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        if (!formData.email || !formData.password) {
            Toast.show({
                type: 'error',
                text1: 'Required',
                text2: 'Please fill in all fields.',
            });
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password,
            });

            await login(response.data.token, response.data.user);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Welcome back!',
            });
        } catch (error: any) {
            console.error('Login error:', error);
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: error.response?.data?.message || 'Invalid email or password',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!forgotEmail) {
            Toast.show({
                type: 'error',
                text1: 'Required',
                text2: 'Please enter your email.',
            });
            return;
        }

        setForgotLoading(true);
        try {
            await api.post('/auth/forgot-password', { email: forgotEmail });
            Toast.show({
                type: 'success',
                text1: 'Check your email',
                text2: 'If an account exists, you will receive a reset token.',
            });
            setIsForgotModalVisible(false);
            setForgotEmail('');
        } catch (error: any) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Something went wrong. Please try again.',
            });
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#05070A]">
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView 
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                >
                    <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-8">
                        {/* Header */}
                        <TouchableOpacity 
                            onPress={() => router.back()}
                            className="mt-6 mb-10 w-12 h-12 bg-white/5 items-center justify-center rounded-full"
                        >
                            <ArrowLeft color="white" size={24} />
                        </TouchableOpacity>

                        <Text className="text-white text-4xl font-bold mb-2">Welcome Back</Text>
                        <Text className="text-slate-400 text-lg mb-12">Log in to your soul's journey.</Text>

                        {/* Form */}
                        <View className="space-y-6">
                            <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center mb-4">
                                <Mail color="#94A3B8" size={20} />
                                <TextInput
                                    className="flex-1 ml-3 text-white text-lg"
                                    placeholder="Email Address"
                                    placeholderTextColor="#475569"
                                    value={formData.email}
                                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>

                            <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center">
                                <Lock color="#94A3B8" size={20} />
                                <TextInput
                                    className="flex-1 ml-3 text-white text-lg"
                                    placeholder="Password"
                                    placeholderTextColor="#475569"
                                    secureTextEntry={!showPassword}
                                    value={formData.password}
                                    onChangeText={(text) => setFormData({ ...formData, password: text })}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <EyeOff color="#94A3B8" size={20} />
                                    ) : (
                                        <Eye color="#94A3B8" size={20} />
                                    )}
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity 
                                onPress={() => setIsForgotModalVisible(true)}
                                className="items-end mt-4"
                            >
                                <Text className="text-[#5EEAD4] font-medium">Forgot Password?</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress={handleLogin}
                                disabled={loading}
                                className={`py-5 rounded-3xl mt-10 flex-row items-center justify-center ${loading ? 'bg-[#5EEAD4]/50' : 'bg-[#5EEAD4]'}`}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#05070A" />
                                ) : (
                                    <Text className="text-[#05070A] font-bold text-xl">Log In</Text>
                                )}
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row justify-center mt-8 pb-10">
                            <Text className="text-slate-400 text-base">Don't have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                                <Text className="text-[#5EEAD4] font-bold text-base">Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

            {/* Forgot Password Modal */}
            <Modal
                visible={isForgotModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setIsForgotModalVisible(false)}
            >
                <View className="flex-1 bg-black/60 items-center justify-center px-6">
                    <View className="bg-[#0F1219] w-full p-8 rounded-[40px] border border-white/10">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-white text-2xl font-bold">Reset Password</Text>
                            <TouchableOpacity onPress={() => setIsForgotModalVisible(false)}>
                                <X color="white" size={24} />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-slate-400 mb-6 text-base">
                            Enter your email and we'll send you a 6-digit token to reset your password.
                        </Text>

                        <View className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center mb-8">
                            <Mail color="#94A3B8" size={20} />
                            <TextInput
                                className="flex-1 ml-3 text-white text-lg"
                                placeholder="Email Address"
                                placeholderTextColor="#475569"
                                value={forgotEmail}
                                onChangeText={setForgotEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <TouchableOpacity 
                            onPress={handleForgotPassword}
                            disabled={forgotLoading}
                            className={`py-5 rounded-3xl flex-row items-center justify-center ${forgotLoading ? 'bg-[#5EEAD4]/50' : 'bg-[#5EEAD4]'}`}
                        >
                            {forgotLoading ? (
                                <ActivityIndicator color="#05070A" />
                            ) : (
                                <>
                                    <Text className="text-[#05070A] font-bold text-lg mr-2">Send Token</Text>
                                    <Send color="#05070A" size={18} />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
