import React, { useState } from 'react';
import {
    View, Text, ScrollView, TouchableOpacity, Switch, Modal,
    TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    User, Shield, Wallet, Bell, Eye, ChevronRight,
    CheckCircle2, Lock, HelpCircle, LogOut, Link, X, Search,
    Instagram, Twitter, Linkedin,
} from 'lucide-react-native';
import { TopBar } from '../../components/TopBar';
import { useAuth } from '../../src/context/AuthContext';
import { api } from '../../src/services/api';
import { getAvatarInitial, getDisplayName, getSoulId } from '../../src/utils/userIdentity';
import Toast from 'react-native-toast-message';

const COLORS = {
    background: '#05070A',
    card: '#0F1219',
    primary: '#5EEAD4',
    textSecondary: '#64748B',
    border: 'rgba(255,255,255,0.07)',
};

const ONBOARDING_INTERESTS = [
    'Mindfulness', 'Spirituality', 'Web3', 'Community', 'DeFi',
    'Wellness', 'Philosophy', 'Gratitude', 'Creativity', 'Impact',
    'Social Graphs', 'Reflection', 'NFTs', 'DAO', 'Meditation',
];

const FAQS = [
    { q: 'What is SoulLink?', a: 'SoulLink is a mindful Web3 social platform connecting people through reflections, shared values, and soulbound identity.' },
    { q: 'How do I connect my wallet?', a: 'Navigate to the Wallet tab to connect your Web3 wallet using WalletConnect. We support Trust Wallet, Bybit, Phantom, and MetaMask.' },
    { q: 'What are Soulbound Badges?', a: 'Soulbound Badges are non-transferable digital credentials tied to your identity, earned by contributions and milestones on SoulLink.' },
    { q: 'Is my data private?', a: 'Your profile is public by default. You control your privacy settings and can adjust your discovery preferences at any time.' },
    { q: 'How do I delete my account?', a: 'Account deletion is available by emailing info@soullink.com.ng. We will process your request within 14 days.' },
    { q: 'How do reflections work?', a: 'Reflections are short thoughts or ideas you share with the community. Others can like, comment, and bookmark them.' },
    { q: 'Can I use SoulLink without a wallet?', a: 'Yes! Email authentication is fully supported. A wallet is optional and unlocks additional Web3 features.' },
];

export default function SettingsScreen() {
    const { user: authUser, logout, setUser } = useAuth();
    const router = useRouter();

    const [discoveryEnabled, setDiscoveryEnabled] = useState(true);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // Edit Profile Modal
    const [editVisible, setEditVisible] = useState(false);
    const [editDisplayName, setEditDisplayName] = useState(authUser?.displayName || '');
    const [editBio, setEditBio] = useState(authUser?.bio || '');
    const [editAvatarUrl, setEditAvatarUrl] = useState(authUser?.avatarUrl || '');
    const [editInterests, setEditInterests] = useState<string[]>(authUser?.interests || []);
    const [saving, setSaving] = useState(false);

    // Social Accounts Modal
    const [socialVisible, setSocialVisible] = useState(false);
    const [twitterHandle, setTwitterHandle] = useState('');
    const [instagramHandle, setInstagramHandle] = useState('');
    const [linkedinHandle, setLinkedinHandle] = useState('');
    const [savingSocial, setSavingSocial] = useState(false);

    // FAQ Modal
    const [faqVisible, setFaqVisible] = useState(false);
    const [faqSearch, setFaqSearch] = useState('');

    const toggleInterest = (interest: string) => {
        setEditInterests(prev =>
            prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
        );
    };

    const handleSaveProfile = async () => {
        if (!editDisplayName.trim()) {
            Toast.show({ type: 'error', text1: 'Display name cannot be empty' });
            return;
        }
        setSaving(true);
        try {
            const res = await api.patch('/profile/me', {
                displayName: editDisplayName.trim(),
                bio: editBio.trim(),
                avatarUrl: editAvatarUrl.trim() || undefined,
                interests: editInterests,
            });
            await setUser?.({ ...authUser!, ...res.data });
            setEditVisible(false);
            Toast.show({ type: 'success', text1: 'Profile updated!' });
        } catch (e: any) {
            Toast.show({ type: 'error', text1: 'Update failed', text2: e.response?.data?.message || 'Please try again' });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveSocial = async () => {
        setSavingSocial(true);
        try {
            const socialLinks: Record<string, string> = {};
            if (twitterHandle.trim()) socialLinks.twitter = twitterHandle.trim();
            if (instagramHandle.trim()) socialLinks.instagram = instagramHandle.trim();
            if (linkedinHandle.trim()) socialLinks.linkedin = linkedinHandle.trim();

            await api.patch('/profile/me', { socialLinks });
            if (authUser) {
                await setUser?.({ ...authUser, socialLinks: { ...(authUser.socialLinks || {}), ...socialLinks } });
            }
            setSocialVisible(false);
            Toast.show({ type: 'success', text1: 'Social accounts saved!' });
        } catch (e: any) {
            Toast.show({ type: 'error', text1: 'Save failed' });
        } finally {
            setSavingSocial(false);
        }
    };

    const openSocialAccounts = () => {
        const links = authUser?.socialLinks || {};
        setTwitterHandle(links.twitter || '');
        setInstagramHandle(links.instagram || '');
        setLinkedinHandle(links.linkedin || '');
        setSocialVisible(true);
    };

    const filteredFaqs = FAQS.filter(f =>
        f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
        f.a.toLowerCase().includes(faqSearch.toLowerCase())
    );

    const displayName = getDisplayName(authUser);
    const username = authUser?.username || '';
    const soulId = getSoulId(authUser);

    const groups = [
        {
            title: 'Account',
            items: [
                { icon: User, label: 'Edit Profile', sublabel: 'Name, bio, interests', onPress: () => { setEditDisplayName(authUser?.displayName || ''); setEditBio(authUser?.bio || ''); setEditAvatarUrl(authUser?.avatarUrl || ''); setEditInterests(authUser?.interests || []); setEditVisible(true); } },
                { icon: CheckCircle2, label: 'Identity Verification', sublabel: 'Verify your identity for trust badges', badge: 'Optional', badgeColor: '#F59E0B', onPress: () => {} },
                { icon: Wallet, label: 'Connect Wallet', sublabel: 'Own your identity on-chain', badge: 'Optional', badgeColor: '#6C5DD3', onPress: () => {} },
            ],
        },
        {
            title: 'Privacy & Safety',
            items: [
                { icon: Eye, label: 'Discovery', sublabel: 'Be found by like-minded people', toggle: true, toggleValue: discoveryEnabled, onToggle: setDiscoveryEnabled, onPress: () => {} },
                { icon: Lock, label: 'Privacy Tone', sublabel: 'Quiet · Balanced · Open', onPress: () => {} },
                { icon: Shield, label: 'Blocked Users', onPress: () => {} },
            ],
        },
        {
            title: 'Notifications',
            items: [
                { icon: Bell, label: 'Push Notifications', sublabel: 'Activity alerts and updates', toggle: true, toggleValue: notificationsEnabled, onToggle: setNotificationsEnabled, onPress: () => {} },
            ],
        },
        {
            title: 'Connections',
            items: [
                { icon: Link, label: 'Social Accounts', sublabel: 'Twitter/X, Instagram, LinkedIn', onPress: openSocialAccounts },
            ],
        },
        {
            title: 'Support',
            items: [
                { icon: HelpCircle, label: 'Help & FAQ', onPress: () => { setFaqSearch(''); setFaqVisible(true); } },
            ],
        },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.background }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
                <TopBar title="Settings" />
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>

                    {/* Profile Card */}
                    <View style={{ marginHorizontal: 20, marginBottom: 24, marginTop: 8, backgroundColor: COLORS.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: COLORS.border, flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: `${COLORS.primary}22`, borderWidth: 2, borderColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                            <Text style={{ color: COLORS.primary, fontSize: 22, fontWeight: '700' }}>{getAvatarInitial(authUser)}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: 'white', fontSize: 17, fontWeight: '700', textTransform: 'lowercase' }}>{displayName}</Text>
                            <Text style={{ color: COLORS.textSecondary, fontSize: 14 }}>@{username}</Text>
                            {soulId ? <Text style={{ color: COLORS.primary, fontSize: 12, fontWeight: '700', marginTop: 2, textTransform: 'lowercase' }}>{soulId}</Text> : null}
                        </View>
                        <TouchableOpacity
                            onPress={() => { setEditDisplayName(authUser?.displayName || ''); setEditBio(authUser?.bio || ''); setEditAvatarUrl(authUser?.avatarUrl || ''); setEditInterests(authUser?.interests || []); setEditVisible(true); }}
                            style={{ backgroundColor: `${COLORS.primary}20`, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 }}
                        >
                            <Text style={{ color: COLORS.primary, fontWeight: '600', fontSize: 13 }}>Edit</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Setting groups */}
                    {groups.map((group) => (
                        <View key={group.title} style={{ marginBottom: 8 }}>
                            <Text style={{ color: COLORS.textSecondary, fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginHorizontal: 28, marginBottom: 8 }}>
                                {group.title}
                            </Text>
                            <View style={{ marginHorizontal: 20, backgroundColor: COLORS.card, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden' }}>
                                {group.items.map((item: any, idx: number) => (
                                    <TouchableOpacity
                                        key={item.label}
                                        onPress={item.onPress}
                                        activeOpacity={item.toggle ? 1 : 0.7}
                                        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 15, borderBottomWidth: idx < group.items.length - 1 ? 1 : 0, borderBottomColor: 'rgba(255,255,255,0.05)' }}
                                    >
                                        <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.05)', alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
                                            <item.icon color={COLORS.textSecondary} size={18} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                                <Text style={{ color: 'white', fontSize: 15, fontWeight: '600' }}>{item.label}</Text>
                                                {item.badge && (
                                                    <View style={{ backgroundColor: `${item.badgeColor}22`, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
                                                        <Text style={{ color: item.badgeColor, fontSize: 11, fontWeight: '600' }}>{item.badge}</Text>
                                                    </View>
                                                )}
                                            </View>
                                            {item.sublabel && <Text style={{ color: COLORS.textSecondary, fontSize: 13, marginTop: 2 }}>{item.sublabel}</Text>}
                                        </View>
                                        {item.toggle ? (
                                            <Switch value={item.toggleValue} onValueChange={item.onToggle} trackColor={{ false: '#1F2433', true: `${COLORS.primary}66` }} thumbColor={item.toggleValue ? COLORS.primary : '#64748B'} />
                                        ) : (
                                            <ChevronRight color="#3F4A5A" size={18} />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}

                    {/* Logout */}
                    <TouchableOpacity
                        onPress={() => { logout?.(); router.replace('/(auth)/landing'); }}
                        activeOpacity={0.7}
                        style={{ marginHorizontal: 20, marginTop: 16, backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 }}
                    >
                        <LogOut color="#EF4444" size={18} />
                        <Text style={{ color: '#EF4444', fontWeight: '700', fontSize: 15 }}>Sign Out</Text>
                    </TouchableOpacity>

                    <Text style={{ color: '#1F2A38', textAlign: 'center', fontSize: 12, marginTop: 24 }}>SoulLink v1.0.0</Text>
                </ScrollView>
            </SafeAreaView>

            {/* ── Edit Profile Modal ── */}
            <Modal visible={editVisible} animationType="slide" transparent onRequestClose={() => setEditVisible(false)}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                        <View style={{ backgroundColor: COLORS.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, borderTopWidth: 1, borderColor: COLORS.border, maxHeight: '90%' }}>
                            <View style={{ width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>Edit Profile</Text>
                                <TouchableOpacity onPress={() => setEditVisible(false)}><X color="#64748B" size={22} /></TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={{ color: COLORS.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>Display Name</Text>
                                <TextInput value={editDisplayName} onChangeText={setEditDisplayName} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 14, color: 'white', fontSize: 15, marginBottom: 16 }} />

                                <Text style={{ color: COLORS.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>Profile Image URL</Text>
                                <TextInput
                                    value={editAvatarUrl}
                                    onChangeText={setEditAvatarUrl}
                                    style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 14, color: 'white', fontSize: 15, marginBottom: 16 }}
                                    placeholder="https://..."
                                    placeholderTextColor="#475569"
                                />

                                <Text style={{ color: COLORS.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 6 }}>Bio</Text>
                                <TextInput value={editBio} onChangeText={setEditBio} multiline numberOfLines={3} style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 14, color: 'white', fontSize: 15, height: 80, textAlignVertical: 'top', marginBottom: 20 }} placeholder="Tell the world about your soul..." placeholderTextColor="#475569" />

                                <Text style={{ color: COLORS.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 12 }}>Interests</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                                    {ONBOARDING_INTERESTS.map(interest => {
                                        const selected = editInterests.includes(interest);
                                        return (
                                            <TouchableOpacity
                                                key={interest}
                                                onPress={() => toggleInterest(interest)}
                                                style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: selected ? COLORS.primary : 'rgba(255,255,255,0.1)', backgroundColor: selected ? `${COLORS.primary}20` : 'transparent' }}
                                            >
                                                <Text style={{ color: selected ? COLORS.primary : '#94A3B8', fontSize: 13, fontWeight: selected ? '700' : '400' }}>{interest}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>

                                <TouchableOpacity
                                    onPress={handleSaveProfile}
                                    disabled={saving}
                                    style={{ backgroundColor: COLORS.primary, borderRadius: 20, paddingVertical: 16, alignItems: 'center', marginBottom: 8 }}
                                >
                                    {saving ? <ActivityIndicator color="#05070A" /> : <Text style={{ color: '#05070A', fontWeight: '800', fontSize: 16 }}>Save Changes</Text>}
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* ── Social Accounts Modal ── */}
            <Modal visible={socialVisible} animationType="slide" transparent onRequestClose={() => setSocialVisible(false)}>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                    <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                        <View style={{ backgroundColor: COLORS.card, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, borderTopWidth: 1, borderColor: COLORS.border }}>
                            <View style={{ width: 40, height: 4, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2, alignSelf: 'center', marginBottom: 20 }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                                <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>Social Accounts</Text>
                                <TouchableOpacity onPress={() => setSocialVisible(false)}><X color="#64748B" size={22} /></TouchableOpacity>
                            </View>

                            {[
                                { label: 'Twitter / X', placeholder: '@yourhandle', value: twitterHandle, setValue: setTwitterHandle, icon: '𝕏' },
                                { label: 'Instagram', placeholder: '@yourhandle', value: instagramHandle, setValue: setInstagramHandle, icon: '📷' },
                                { label: 'LinkedIn', placeholder: 'linkedin.com/in/yourname', value: linkedinHandle, setValue: setLinkedinHandle, icon: 'in' },
                            ].map(field => (
                                <View key={field.label} style={{ marginBottom: 16 }}>
                                    <Text style={{ color: COLORS.textSecondary, fontSize: 13, fontWeight: '600', marginBottom: 8 }}>{field.label}</Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, gap: 10 }}>
                                        <Text style={{ color: COLORS.primary, fontSize: 15, fontWeight: '700', width: 22, textAlign: 'center' }}>{field.icon}</Text>
                                        <TextInput
                                            value={field.value}
                                            onChangeText={field.setValue}
                                            placeholder={field.placeholder}
                                            placeholderTextColor="#475569"
                                            autoCapitalize="none"
                                            style={{ flex: 1, color: 'white', fontSize: 15 }}
                                        />
                                    </View>
                                </View>
                            ))}

                            <TouchableOpacity
                                onPress={handleSaveSocial}
                                disabled={savingSocial}
                                style={{ backgroundColor: COLORS.primary, borderRadius: 20, paddingVertical: 16, alignItems: 'center', marginTop: 8 }}
                            >
                                {savingSocial ? <ActivityIndicator color="#05070A" /> : <Text style={{ color: '#05070A', fontWeight: '800', fontSize: 16 }}>Save Connections</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* ── Help & FAQ Modal ── */}
            <Modal visible={faqVisible} animationType="slide" transparent onRequestClose={() => setFaqVisible(false)}>
                <View style={{ flex: 1, backgroundColor: '#05070A' }}>
                    <SafeAreaView style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' }}>
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: '700' }}>Help & FAQ</Text>
                            <TouchableOpacity onPress={() => setFaqVisible(false)}><X color="white" size={22} /></TouchableOpacity>
                        </View>

                        <View style={{ paddingHorizontal: 24, paddingVertical: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, gap: 10 }}>
                                <Search color="#64748B" size={16} />
                                <TextInput value={faqSearch} onChangeText={setFaqSearch} placeholder="Search FAQs…" placeholderTextColor="#475569" style={{ flex: 1, color: 'white', fontSize: 15 }} />
                            </View>
                        </View>

                        <FlatList
                            data={filteredFaqs}
                            keyExtractor={(item) => item.q}
                            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                            ListEmptyComponent={<View style={{ alignItems: 'center', paddingTop: 40 }}><Text style={{ color: '#64748B' }}>No results found</Text></View>}
                            renderItem={({ item }) => (
                                <FAQItem question={item.q} answer={item.a} />
                            )}
                            ListFooterComponent={
                                <View style={{ marginTop: 24, backgroundColor: '#0F1219', borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)', padding: 20, alignItems: 'center' }}>
                                    <Text style={{ color: '#94A3B8', fontSize: 14, marginBottom: 6 }}>Still need help?</Text>
                                    <Text style={{ color: COLORS.primary, fontSize: 15, fontWeight: '700' }}>info@soullink.com.ng</Text>
                                </View>
                            }
                        />
                    </SafeAreaView>
                </View>
            </Modal>
        </View>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <TouchableOpacity
            onPress={() => setOpen(p => !p)}
            activeOpacity={0.8}
            style={{
                backgroundColor: '#0F1219', borderRadius: 16, borderWidth: 1,
                borderColor: open ? 'rgba(94,234,212,0.2)' : 'rgba(255,255,255,0.06)',
                padding: 16, marginBottom: 10,
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Text style={{ flex: 1, color: 'white', fontSize: 15, fontWeight: '600' }}>{question}</Text>
                <Text style={{ color: '#5EEAD4', fontSize: 18, fontWeight: '700' }}>{open ? '−' : '+'}</Text>
            </View>
            {open && (
                <Text style={{ color: '#94A3B8', fontSize: 14, lineHeight: 22, marginTop: 12 }}>{answer}</Text>
            )}
        </TouchableOpacity>
    );
}
