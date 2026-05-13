import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Switch, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ChevronLeft, Check, Wallet, User, Info, Smartphone, CircleCheck, Sparkles,
    Leaf, MessageCircle, Flower, Shield, Search, Edit2, Camera, Compass,
    Twitter, Instagram, Linkedin
} from 'lucide-react-native';
import { COLORS } from '../../constants/Theme';
import { useAuth } from '../../src/context/AuthContext';

const FOUNDATION_VALUES = [
    'Compassion', 'Integrity', 'Growth', 'Wisdom',
    'Honesty', 'Empathy', 'Courage', 'Mindfulness'
];

const SUGGESTED_INTERESTS = [
    'Mindfulness', 'Tech', 'Spirituality', 'Web3', 'Community',
    'Social Graphs', 'Reflection', 'Impact', 'Wellness'
];

export default function OnboardingSetup() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        foundations: [] as string[],
        displayName: '',
        username: '',
        birthday: '',
        gender: '',
        pronouns: '',
        bio: '',
        interests: [] as string[],
        interactionMode: 'Authentic expressions',
        privacyTone: 'Balanced',
        discoveryEnabled: true,
        notificationsEnabled: true,
        socials: { twitter: '', instagram: '', linkedin: '' },
        walletConnected: false,
    });
    
    // UI state
    const [socialInputVisible, setSocialInputVisible] = useState({ twitter: false, instagram: false, linkedin: false });

    const { login } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const backAction = () => {
            if (currentStep > 0) {
                setCurrentStep(currentStep - 1);
                return true; // Go to previous step
            }
            // On step 0, block back so the user can't accidentally exit to landing
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [currentStep]);

    const handleNext = () => {
        if (currentStep < 6) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSkip = () => {
        router.replace('/(tabs)');
    };

    const handleComplete = async () => {
        await login('mock-token', {
            id: '1',
            email: 'user@example.com',
            username: formData.username || 'user',
            displayName: formData.displayName || 'Soul Linker',
            profileCompleted: true,
        });
        router.replace('/(tabs)');
    };

    const toggleFoundation = (value: string) => {
        setFormData(prev => {
            const isSelected = prev.foundations.includes(value);
            if (isSelected) {
                return { ...prev, foundations: prev.foundations.filter(v => v !== value) };
            }
            if (prev.foundations.length < 3) {
                return { ...prev, foundations: [...prev.foundations, value] };
            }
            return prev;
        });
    };

    const toggleInterest = (interest: string) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest],
        }));
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0: // Step 1: Foundations
                return (
                    <View className="space-y-6">
                        <Text style={{ fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' }} className="text-white text-4xl font-bold mb-2">Our Foundations.</Text>
                        <Text className="text-slate-400 text-lg mb-6 leading-relaxed">
                            SoulLink is built on shared values. Before we build your profile, let's align on what matters most.
                        </Text>

                        {/* Value Cards */}
                        <View className="space-y-3 mb-8">
                            {[
                                { icon: Leaf, title: 'Authentic Expression', desc: 'Share openly and truthfully' },
                                { icon: MessageCircle, title: 'Meaningful Dialogue', desc: 'Connect beyond the surface' },
                                { icon: Flower, title: 'Deep Reflection', desc: 'Pause before you react' },
                                { icon: Shield, title: 'Earned Trust', desc: 'Build lasting reputation' }
                            ].map((item, idx) => (
                                <View key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-row items-center">
                                    <View className="w-12 h-12 rounded-full bg-[#5EEAD4]/10 items-center justify-center mr-4">
                                        <item.icon color="#5EEAD4" size={24} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white font-bold text-lg">{item.title}</Text>
                                        <Text className="text-slate-400 text-sm">{item.desc}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <Text className="text-white font-bold text-lg mb-4">Choose up to 3 foundational values</Text>
                        <View className="flex-row flex-wrap gap-3">
                            {FOUNDATION_VALUES.map(val => {
                                const isSelected = formData.foundations.includes(val);
                                return (
                                    <TouchableOpacity
                                        key={val}
                                        onPress={() => toggleFoundation(val)}
                                        className={`px-4 py-2.5 rounded-full border ${isSelected ? 'bg-[#5EEAD4] border-[#5EEAD4]' : 'bg-white/5 border-white/10'}`}
                                    >
                                        <Text className={`${isSelected ? 'text-[#05070A] font-bold' : 'text-slate-300'}`}>{val}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                );

            case 1: // Step 2: Roadmap
                return (
                    <View className="space-y-6">
                        <Text className="text-white text-3xl font-bold mb-2">Let's Set Up Your Profile.</Text>
                        <Text className="text-slate-400 text-lg mb-8">Complete these steps to personalize your experience.</Text>

                        <View className="space-y-4">
                            {[
                                'Basic Info (Required)',
                                'Bio & Interests',
                                'Preferences',
                                'Social & Web3',
                                'Review & Finish'
                            ].map((step, idx) => (
                                <View key={idx} className="flex-row items-center p-4 bg-white/5 border border-white/10 rounded-2xl">
                                    <View className="w-8 h-8 rounded-full bg-white/10 items-center justify-center mr-4">
                                        <Text className="text-slate-300 font-bold">{idx + 1}</Text>
                                    </View>
                                    <Text className="text-white text-lg font-medium">{step}</Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity onPress={handleSkip} className="mt-8 py-4">
                            <Text className="text-slate-400 text-center text-lg font-semibold">Complete Later</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 2: // Step 3: Basic Info
                return (
                    <View className="space-y-6">
                        <Text className="text-white text-3xl font-bold mb-2">Tell Us How You'll Appear</Text>
                        <Text className="text-slate-400 text-lg mb-8">Your essential identity data.</Text>

                        {/* Avatar */}
                        <View className="items-center mb-8">
                            <View className="w-28 h-28 rounded-full bg-white/5 border-2 border-dashed border-white/20 items-center justify-center relative">
                                <User color="#94A3B8" size={40} />
                                <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#5EEAD4] items-center justify-center border-2 border-[#05070A]">
                                    <Camera color="#05070A" size={14} />
                                </View>
                            </View>
                        </View>

                        {/* Inputs */}
                        <View className="space-y-4">
                            <View className="bg-[#0F1219] border border-white/10 rounded-2xl p-2 px-4">
                                <Text className="text-slate-500 text-xs font-semibold pt-1">Display Name (Required)</Text>
                                <TextInput
                                    className="text-white text-lg py-1"
                                    placeholder="e.g. Alex"
                                    placeholderTextColor="#475569"
                                    value={formData.displayName}
                                    onChangeText={t => setFormData({ ...formData, displayName: t })}
                                />
                            </View>
                            <View className="bg-[#0F1219] border border-white/10 rounded-2xl p-2 px-4">
                                <Text className="text-slate-500 text-xs font-semibold pt-1">Username (Required)</Text>
                                <View className="flex-row items-center">
                                    <Text className="text-slate-400 text-lg py-1 mr-1">@</Text>
                                    <TextInput
                                        className="text-white text-lg py-1 flex-1"
                                        placeholder="alex"
                                        placeholderTextColor="#475569"
                                        value={formData.username}
                                        onChangeText={t => setFormData({ ...formData, username: t })}
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>
                            <View className="bg-[#0F1219] border border-white/10 rounded-2xl p-2 px-4">
                                <Text className="text-slate-500 text-xs font-semibold pt-1">Birthday / Age</Text>
                                <TextInput
                                    className="text-white text-lg py-1"
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor="#475569"
                                    value={formData.birthday}
                                    onChangeText={t => setFormData({ ...formData, birthday: t })}
                                />
                            </View>
                            <View className="flex-row space-x-4">
                                <View className="flex-1 bg-[#0F1219] border border-white/10 rounded-2xl p-2 px-4">
                                    <Text className="text-slate-500 text-xs font-semibold pt-1">Gender (Optional)</Text>
                                    <TextInput
                                        className="text-white text-base py-1"
                                        placeholder="Select"
                                        placeholderTextColor="#475569"
                                        value={formData.gender}
                                        onChangeText={t => setFormData({ ...formData, gender: t })}
                                    />
                                </View>
                                <View className="flex-1 bg-[#0F1219] border border-white/10 rounded-2xl p-2 px-4">
                                    <Text className="text-slate-500 text-xs font-semibold pt-1">Pronouns (Opt)</Text>
                                    <TextInput
                                        className="text-white text-base py-1"
                                        placeholder="e.g. they/them"
                                        placeholderTextColor="#475569"
                                        value={formData.pronouns}
                                        onChangeText={t => setFormData({ ...formData, pronouns: t })}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                );

            case 3: // Step 4: Bio & Interests
                return (
                    <View className="space-y-6">
                        <Text className="text-white text-3xl font-bold mb-2">Bio & Interests</Text>
                        <Text className="text-slate-400 text-lg mb-6">Qualitative data for connection.</Text>

                        <View className="bg-[#0F1219] border border-white/10 rounded-2xl p-4">
                            <TextInput
                                className="text-white text-lg h-32"
                                placeholder="What values guide you? What do you reflect on?"
                                placeholderTextColor="#475569"
                                multiline
                                maxLength={200}
                                value={formData.bio}
                                onChangeText={t => setFormData({ ...formData, bio: t })}
                                textAlignVertical="top"
                            />
                            <Text className="text-right text-slate-500 text-sm mt-2">{formData.bio.length}/200</Text>
                        </View>

                        <Text className="text-white font-bold text-lg mt-4 mb-2">Interests</Text>
                        
                        <View className="flex-row items-center bg-[#0F1219] border border-white/10 rounded-xl px-4 py-3 mb-4">
                            <Search color="#475569" size={20} />
                            <TextInput 
                                className="flex-1 ml-3 text-white text-base"
                                placeholder="Search interests..."
                                placeholderTextColor="#475569"
                            />
                        </View>

                        <View className="flex-row flex-wrap gap-2">
                            {SUGGESTED_INTERESTS.map(interest => {
                                const isSelected = formData.interests.includes(interest);
                                return (
                                    <TouchableOpacity
                                        key={interest}
                                        onPress={() => toggleInterest(interest)}
                                        className={`px-4 py-2 rounded-full border ${isSelected ? 'bg-[#5EEAD4] border-[#5EEAD4]' : 'bg-white/5 border-white/10'}`}
                                    >
                                        <Text className={`${isSelected ? 'text-[#05070A] font-bold' : 'text-slate-300'}`}>{interest}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                );

            case 4: // Step 5: Preferences
                return (
                    <View className="space-y-6">
                        <Text className="text-white text-3xl font-bold mb-2">Preferences</Text>
                        <Text className="text-slate-400 text-lg mb-6">Tune your algorithm and visibility.</Text>

                        {/* Reflections / Interaction Mode */}
                        <Text className="text-white font-bold text-lg mb-2">Reflections</Text>
                        <View className="space-y-2 mb-6">
                            {['Authentic expressions', 'Deep discussion', 'Reflecting alone'].map(mode => (
                                <TouchableOpacity 
                                    key={mode}
                                    onPress={() => setFormData({ ...formData, interactionMode: mode })}
                                    className={`p-4 rounded-xl border flex-row items-center justify-between ${formData.interactionMode === mode ? 'bg-[#5EEAD4]/10 border-[#5EEAD4]' : 'bg-[#0F1219] border-white/10'}`}
                                >
                                    <Text className={`${formData.interactionMode === mode ? 'text-[#5EEAD4] font-bold' : 'text-white'}`}>{mode}</Text>
                                    {formData.interactionMode === mode && <Check color="#5EEAD4" size={20} />}
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Privacy Tone */}
                        <Text className="text-white font-bold text-lg mb-2">Privacy Tone</Text>
                        <View className="flex-row bg-[#0F1219] p-1 rounded-xl border border-white/10 mb-6">
                            {['Quiet', 'Balanced', 'Open'].map(tone => (
                                <TouchableOpacity 
                                    key={tone}
                                    onPress={() => setFormData({ ...formData, privacyTone: tone })}
                                    className={`flex-1 py-3 items-center rounded-lg ${formData.privacyTone === tone ? 'bg-white/10' : ''}`}
                                >
                                    <Text className={`${formData.privacyTone === tone ? 'text-white font-bold' : 'text-slate-400'}`}>{tone}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Toggles */}
                        <View className="space-y-4">
                            <View className="flex-row items-center justify-between bg-[#0F1219] p-4 rounded-xl border border-white/10">
                                <View className="flex-1 mr-4">
                                    <Text className="text-white font-bold text-lg mb-1">Discovery</Text>
                                    <Text className="text-slate-400 text-sm">Be found by like-minded people</Text>
                                </View>
                                <Switch 
                                    value={formData.discoveryEnabled} 
                                    onValueChange={(val) => setFormData({...formData, discoveryEnabled: val})}
                                    trackColor={{ false: '#1F2433', true: `${COLORS.primary}66` }}
                                    thumbColor={formData.discoveryEnabled ? COLORS.primary : '#64748B'}
                                />
                            </View>
                            <View className="flex-row items-center justify-between bg-[#0F1219] p-4 rounded-xl border border-white/10">
                                <View className="flex-1 mr-4">
                                    <Text className="text-white font-bold text-lg mb-1">Notifications</Text>
                                    <Text className="text-slate-400 text-sm">Activity alerts</Text>
                                </View>
                                <Switch 
                                    value={formData.notificationsEnabled} 
                                    onValueChange={(val) => setFormData({...formData, notificationsEnabled: val})}
                                    trackColor={{ false: '#1F2433', true: `${COLORS.primary}66` }}
                                    thumbColor={formData.notificationsEnabled ? COLORS.primary : '#64748B'}
                                />
                            </View>
                        </View>
                    </View>
                );

            case 5: // Step 6: Social & Web3
                return (
                    <View className="space-y-6">
                        <Text className="text-white text-3xl font-bold mb-2">Social & Web3 Connections</Text>
                        <Text className="text-slate-400 text-lg mb-6">External verification and identity ownership.</Text>

                        {/* Socials */}
                        <Text className="text-white font-bold text-lg mb-3">Socials (Optional)</Text>
                        <View className="space-y-3 mb-8">
                            {[
                                { id: 'twitter', icon: Twitter, label: 'Twitter/X' },
                                { id: 'instagram', icon: Instagram, label: 'Instagram' },
                                { id: 'linkedin', icon: Linkedin, label: 'LinkedIn' }
                            ].map(social => {
                                const isInputVisible = socialInputVisible[social.id as keyof typeof socialInputVisible];
                                const value = formData.socials[social.id as keyof typeof formData.socials];
                                
                                return (
                                    <View key={social.id} className="flex-row items-center bg-[#0F1219] border border-white/10 p-3 rounded-xl">
                                        <View className="w-10 h-10 rounded-full bg-white/5 items-center justify-center mr-3">
                                            <social.icon color="white" size={20} />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-white font-semibold">{social.label}</Text>
                                            {isInputVisible ? (
                                                <TextInput 
                                                    className="text-white mt-1 border-b border-white/20 pb-1"
                                                    placeholder="@handle or URL"
                                                    placeholderTextColor="#475569"
                                                    value={value}
                                                    onChangeText={(t) => setFormData({
                                                        ...formData, 
                                                        socials: { ...formData.socials, [social.id]: t }
                                                    })}
                                                    autoFocus
                                                />
                                            ) : null}
                                        </View>
                                        {!isInputVisible && !value && (
                                            <TouchableOpacity 
                                                onPress={() => setSocialInputVisible({...socialInputVisible, [social.id]: true})}
                                                className="bg-white/10 px-4 py-2 rounded-lg"
                                            >
                                                <Text className="text-white font-semibold text-sm">Connect</Text>
                                            </TouchableOpacity>
                                        )}
                                        {value && (
                                            <View className="bg-[#5EEAD4]/20 p-2 rounded-full">
                                                <Check color="#5EEAD4" size={16} />
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>

                        {/* Web3 */}
                        <Text className="text-white font-bold text-lg mb-3">Wallet (Optional)</Text>
                        <View className="bg-[#0F1219] border border-white/10 p-5 rounded-2xl">
                            <Text className="text-slate-400 text-sm mb-4 leading-relaxed">
                                A wallet lets you own your identity and reputation.
                            </Text>
                            
                            {formData.walletConnected ? (
                                <View className="flex-row items-center bg-[#5EEAD4]/10 p-4 rounded-xl border border-[#5EEAD4]/30">
                                    <View className="w-10 h-10 rounded-full bg-[#5EEAD4]/20 items-center justify-center mr-3">
                                        <Wallet color="#5EEAD4" size={20} />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-white font-bold">Wallet Connected</Text>
                                        <Text className="text-[#5EEAD4] text-xs">0x1234...5678</Text>
                                    </View>
                                    <CircleCheck color="#5EEAD4" size={24} />
                                </View>
                            ) : (
                                <View className="flex-row justify-between">
                                    <TouchableOpacity 
                                        onPress={() => setFormData({...formData, walletConnected: true})}
                                        className="items-center justify-center bg-white/5 p-4 rounded-xl flex-1 mr-2 border border-white/5"
                                    >
                                        <Wallet color="white" size={28} className="mb-2" />
                                        <Text className="text-white text-xs font-semibold">MetaMask</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => setFormData({...formData, walletConnected: true})}
                                        className="items-center justify-center bg-white/5 p-4 rounded-xl flex-1 ml-2 border border-white/5"
                                    >
                                        <Smartphone color="white" size={28} className="mb-2" />
                                        <Text className="text-white text-xs font-semibold">WalletConnect</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity onPress={handleSkip} className="mt-6 py-4">
                            <Text className="text-slate-400 text-center text-base font-semibold">Skip for now</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 6: // Step 7: Review & Finish
                return (
                    <View className="space-y-6">
                        <Text className="text-white text-3xl font-bold mb-2">Review & Finish</Text>
                        <Text className="text-slate-400 text-lg mb-6">Final confirmation of your data.</Text>

                        {/* Identity Card */}
                        <View className="bg-[#0F1219] border border-white/10 rounded-2xl p-5 relative mb-4">
                            <TouchableOpacity onPress={() => setCurrentStep(2)} className="absolute top-4 right-4 z-10 p-2">
                                <Edit2 color="#94A3B8" size={18} />
                            </TouchableOpacity>
                            <View className="flex-row items-center">
                                <View className="w-16 h-16 rounded-full bg-white/10 items-center justify-center mr-4">
                                    <User color="#94A3B8" size={24} />
                                </View>
                                <View>
                                    <Text className="text-white font-bold text-xl">{formData.displayName || 'Anonymous'}</Text>
                                    <Text className="text-slate-400">@{formData.username || 'user'}</Text>
                                </View>
                            </View>
                        </View>

                        {/* About Card */}
                        <View className="bg-[#0F1219] border border-white/10 rounded-2xl p-5 relative mb-4">
                            <TouchableOpacity onPress={() => setCurrentStep(3)} className="absolute top-4 right-4 z-10 p-2">
                                <Edit2 color="#94A3B8" size={18} />
                            </TouchableOpacity>
                            <Text className="text-white font-bold text-lg mb-2">About</Text>
                            <Text className="text-slate-400 mb-4">{formData.bio || 'No bio provided.'}</Text>
                            <View className="flex-row flex-wrap gap-2">
                                {formData.interests.length > 0 ? formData.interests.map(i => (
                                    <View key={i} className="bg-[#5EEAD4]/10 px-3 py-1 rounded-full">
                                        <Text className="text-[#5EEAD4] text-xs font-semibold">{i}</Text>
                                    </View>
                                )) : <Text className="text-slate-500 italic text-sm">No interests selected.</Text>}
                            </View>
                        </View>

                        {/* Preferences Card */}
                        <View className="bg-[#0F1219] border border-white/10 rounded-2xl p-5 relative mb-4">
                            <TouchableOpacity onPress={() => setCurrentStep(4)} className="absolute top-4 right-4 z-10 p-2">
                                <Edit2 color="#94A3B8" size={18} />
                            </TouchableOpacity>
                            <Text className="text-white font-bold text-lg mb-3">Preferences</Text>
                            <View className="space-y-2">
                                <Text className="text-slate-300">• <Text className="text-white font-semibold">Interaction:</Text> {formData.interactionMode}</Text>
                                <Text className="text-slate-300">• <Text className="text-white font-semibold">Privacy Tone:</Text> {formData.privacyTone}</Text>
                                <Text className="text-slate-300">• <Text className="text-white font-semibold">Discovery:</Text> {formData.discoveryEnabled ? 'On' : 'Off'}</Text>
                            </View>
                        </View>

                        {/* Connections Card */}
                        <View className="bg-[#0F1219] border border-white/10 rounded-2xl p-5 relative mb-8">
                            <TouchableOpacity onPress={() => setCurrentStep(5)} className="absolute top-4 right-4 z-10 p-2">
                                <Edit2 color="#94A3B8" size={18} />
                            </TouchableOpacity>
                            <Text className="text-white font-bold text-lg mb-3">Connections</Text>
                            <View className="flex-row space-x-3">
                                {formData.socials.twitter && <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"><Twitter color="white" size={18}/></View>}
                                {formData.socials.instagram && <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"><Instagram color="white" size={18}/></View>}
                                {formData.socials.linkedin && <View className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"><Linkedin color="white" size={18}/></View>}
                                {formData.walletConnected && <View className="w-10 h-10 rounded-full bg-[#5EEAD4]/20 items-center justify-center"><Wallet color="#5EEAD4" size={18}/></View>}
                                
                                {!formData.socials.twitter && !formData.socials.instagram && !formData.socials.linkedin && !formData.walletConnected && (
                                    <Text className="text-slate-500 italic">None connected.</Text>
                                )}
                            </View>
                        </View>
                    </View>
                );

            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#05070A' }}>
            <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 20 }}>
                {/* Stepper Header (Hidden on Step 2 - Roadmap) */}
                {currentStep !== 1 && (
                    <View className="flex-row items-center justify-between mb-8">
                        <TouchableOpacity onPress={handleBack} className={currentStep === 0 ? 'opacity-0' : ''} disabled={currentStep === 0}>
                            <ChevronLeft color="white" size={28} />
                        </TouchableOpacity>
                        <View className="flex-row space-x-1.5">
                            {[0, 1, 2, 3, 4, 5, 6].map((idx) => (
                                <View
                                    key={idx}
                                    className={`h-1.5 rounded-full ${idx === currentStep ? 'bg-[#5EEAD4] w-6' : idx < currentStep ? 'bg-[#5EEAD4]/40 w-2' : 'bg-white/10 w-2'}`}
                                />
                            ))}
                        </View>
                        <Text className="text-slate-500 font-bold">{currentStep + 1}/7</Text>
                    </View>
                )}
                {/* Back button for Step 2 */}
                {currentStep === 1 && (
                     <View className="flex-row items-center justify-between mb-8">
                        <TouchableOpacity onPress={handleBack}>
                            <ChevronLeft color="white" size={28} />
                        </TouchableOpacity>
                        <View />
                    </View>
                )}

                {/* Main Content */}
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
                    {renderStepContent()}
                </ScrollView>

                {/* Footer Action (Hidden on Steps that have their own CTA logic, or always show) */}
                <View className="py-6 border-t border-white/5">
                    {currentStep === 1 ? (
                        <TouchableOpacity
                            onPress={handleNext}
                            className="bg-[#5EEAD4] py-4 rounded-full items-center justify-center shadow-lg shadow-[#5EEAD4]/20"
                        >
                            <Text className="text-[#05070A] font-bold text-lg">Begin</Text>
                        </TouchableOpacity>
                    ) : currentStep === 6 ? (
                         <TouchableOpacity
                            onPress={handleComplete}
                            className="bg-[#5EEAD4] py-4 rounded-full items-center justify-center shadow-lg shadow-[#5EEAD4]/20"
                        >
                            <Text className="text-[#05070A] font-extrabold text-lg">Finish & Enter SoulLink</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={handleNext}
                            className="bg-[#5EEAD4] py-4 rounded-full flex-row items-center justify-center space-x-2 shadow-lg shadow-[#5EEAD4]/20"
                        >
                            <Text className="text-[#05070A] font-bold text-lg">Continue</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}
