import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    Pressable,
    Share,
    Linking,
    Clipboard,
    Platform,
    ScrollView,
    Image,
    useWindowDimensions,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { Heart, MessageCircle, Bookmark, CheckCircle2, X, Copy, Link, Eye, ChevronRight } from 'lucide-react-native';
import { api } from '../services/api';
import { getAvatarInitial, getDisplayName } from '../utils/userIdentity';
import Toast from 'react-native-toast-message';

type ReflectionCardProps = {
    reflection: {
        id: string;
        content: string;
        imageUrl?: string;
        imageUrls?: string[];
        topicTags: string[];
        createdAt: string;
        author?: {
            username: string;
            displayName?: string | null;
            isVerified: boolean;
            avatarUrl?: string;
        } | null;
        _count: {
            likes: number;
            comments: number;
        };
        truthNote?: {
            content: string;
            reputationWeight: number;
            status: string;
        } | null;
    };
    onCommentPress?: () => void;
};

const POST_BASE_URL = 'https://soullink.app/reflection'; // adjust to your actual domain

export function ReflectionCard({ reflection, onCommentPress }: ReflectionCardProps) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(reflection._count.likes);
    const [bookmarked, setBookmarked] = useState(false);
    const [shareVisible, setShareVisible] = useState(false);
    const [truthVisible, setTruthVisible] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);
    const router = useRouter();
    const { width } = useWindowDimensions();

    const postUrl = `${POST_BASE_URL}/${reflection.id}`;
    const authorDisplayName = getDisplayName(reflection.author);
    const authorUsername = reflection.author?.username || 'unknown';
    const mediaUrls = reflection.imageUrls?.length
        ? reflection.imageUrls
        : reflection.imageUrl
            ? [reflection.imageUrl]
            : [];
    const mediaWidth = Math.max(240, width - 88);

    // ── Like ──────────────────────────────────────────────
    const handleLike = async () => {
        const next = !liked;
        setLiked(next);
        setLikeCount((c) => (next ? c + 1 : c - 1));
        try {
            if (next) {
                await api.post(`/reflections/like/${reflection.id}`);
            } else {
                await api.delete(`/reflections/unlike/${reflection.id}`);
            }
        } catch (e) {
            // revert on error
            setLiked(!next);
            setLikeCount((c) => (next ? c - 1 : c + 1));
            console.warn('Like error', e);
        }
    };

    // ── Bookmark ──────────────────────────────────────────
    const handleBookmark = async () => {
        const next = !bookmarked;
        setBookmarked(next);
        try {
            if (next) {
                await api.post(`/reflections/bookmark/${reflection.id}`);
            } else {
                await api.delete(`/reflections/unbookmark/${reflection.id}`);
            }
            const raw = await SecureStore.getItemAsync('bookmarks');
            const bookmarks: string[] = raw ? JSON.parse(raw) : [];
            if (next) {
                if (!bookmarks.includes(reflection.id)) {
                    await SecureStore.setItemAsync('bookmarks', JSON.stringify([...bookmarks, reflection.id]));
                }
            } else {
                await SecureStore.setItemAsync('bookmarks', JSON.stringify(bookmarks.filter((id) => id !== reflection.id)));
            }
        } catch (e) {
            setBookmarked(!next);
            console.warn('Bookmark error', e);
        }
    };

    // ── Share helpers ─────────────────────────────────────
    const openShare = () => {
        setLinkCopied(false);
        setShareVisible(true);
    };

    const copyLink = () => {
        Clipboard.setString(postUrl);
        setLinkCopied(true);
    };

    const shareToWhatsApp = () => {
        const url = `whatsapp://send?text=${encodeURIComponent(postUrl)}`;
        Linking.openURL(url).catch(() =>
            Linking.openURL(`https://api.whatsapp.com/send?text=${encodeURIComponent(postUrl)}`)
        );
        setShareVisible(false);
    };

    const shareToX = () => {
        const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent('Check this out on SoulLink')}`;
        Linking.openURL(url);
        setShareVisible(false);
    };

    const shareToFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        Linking.openURL(url);
        setShareVisible(false);
    };

    const nativeShare = async () => {
        try {
            await Share.share({ message: postUrl, url: postUrl });
        } catch (_) { }
        setShareVisible(false);
    };

    const suggestTruthNote = () => {
        setTruthVisible(true);
    };

    // ── Relative time ─────────────────────────────────────
    const relativeTime = (() => {
        const diff = Date.now() - new Date(reflection.createdAt).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    })();

    return (
        <>
            <View className="bg-[#0F1219] border border-white/5 rounded-3xl p-5 mb-4 shadow-xl">
                {/* Header */}
                <View className="flex-row items-center justify-between mb-4">
                    <TouchableOpacity 
                        className="flex-row items-center gap-3"
                        onPress={() => {
                            if (authorUsername === 'abulex') {
                                router.push('/(tabs)/soul');
                            } else {
                                router.push(`/profile/${authorUsername}`);
                            }
                        }}
                    >
                        <View className="w-10 h-10 rounded-full bg-[#5EEAD4]/20 items-center justify-center border border-[#5EEAD4]/30">
                            <Text className="text-[#5EEAD4] font-bold">
                                {getAvatarInitial(reflection.author)}
                            </Text>
                        </View>
                        <View>
                            <View className="flex-row items-center gap-1">
                                <Text className="text-white font-bold text-base" style={{ textTransform: 'lowercase' }}>
                                    {authorDisplayName}
                                </Text>
                                {reflection.author?.isVerified && (
                                    <CheckCircle2
                                        color="#5EEAD4"
                                        size={14}
                                        fill="#5EEAD4"
                                        stroke="#05070A"
                                    />
                                )}
                            </View>
                            <Text className="text-slate-400 text-sm">
                                @{authorUsername}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <Text className="text-slate-500 text-xs">{relativeTime}</Text>
                </View>

                {/* Media */}
                {mediaUrls.length > 0 && (
                    <View className="mb-4">
                        <ScrollView
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            nestedScrollEnabled
                            contentContainerStyle={{ gap: 10 }}
                        >
                            {mediaUrls.map((uri, index) => (
                                <View key={`${reflection.id}-${index}`} style={{ width: mediaWidth }}>
                                    <Image
                                        source={{ uri }}
                                        style={{
                                            width: mediaWidth,
                                            height: 220,
                                            borderRadius: 22,
                                            backgroundColor: 'rgba(255,255,255,0.04)',
                                        }}
                                        resizeMode="cover"
                                    />
                                    {mediaUrls.length > 1 && index === 0 && (
                                        <View
                                            style={{
                                                position: 'absolute',
                                                right: 12,
                                                top: 16,
                                                backgroundColor: 'rgba(5,7,10,0.72)',
                                                borderRadius: 999,
                                                paddingHorizontal: 10,
                                                paddingVertical: 6,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 4,
                                            }}
                                        >
                                            <Text style={{ color: 'white', fontSize: 11, fontWeight: '700' }}>
                                                Swipe
                                            </Text>
                                            <ChevronRight color="#5EEAD4" size={12} />
                                        </View>
                                    )}
                                </View>
                            ))}
                        </ScrollView>

                        {mediaUrls.length > 1 && (
                            <Text className="text-slate-500 text-[11px] mt-2 text-center">
                                Swipe to view all images
                            </Text>
                        )}
                    </View>
                )}

                {/* Content */}
                <TouchableOpacity onPress={() => router.push(`/reflection/${reflection.id}`)}>
                    <Text className="text-white text-lg leading-relaxed mb-4">
                        {reflection.content}
                    </Text>
                </TouchableOpacity>

                {/* Tags */}
                <View className="flex-row flex-wrap gap-2 mb-6">
                    {reflection.topicTags.map((tag) => (
                        <View
                            key={tag}
                            className="bg-white/5 px-3 py-1 rounded-full border border-white/10"
                        >
                            <Text className="text-[#5EEAD4] text-xs">#{tag}</Text>
                        </View>
                    ))}
                </View>

                {/* Action Row */}
                <View className="flex-row items-center justify-between pt-4 border-t border-white/5">
                    {/* Like */}
                    <TouchableOpacity
                        className="flex-row items-center gap-2"
                        onPress={handleLike}
                        activeOpacity={0.7}
                    >
                        <Heart
                            color={liked ? '#F43F5E' : '#94A3B8'}
                            fill={liked ? '#F43F5E' : 'transparent'}
                            size={20}
                            strokeWidth={1.5}
                        />
                        <Text
                            className="text-sm"
                            style={{ color: liked ? '#F43F5E' : '#94A3B8' }}
                        >
                            {likeCount}
                        </Text>
                    </TouchableOpacity>

                    {/* Comment */}
                    <TouchableOpacity
                        className="flex-row items-center gap-2"
                        onPress={onCommentPress}
                        activeOpacity={0.7}
                    >
                        <MessageCircle color="#94A3B8" size={20} strokeWidth={1.5} />
                        <Text className="text-slate-400 text-sm">
                            {reflection._count.comments}
                        </Text>
                    </TouchableOpacity>

                    {/* TruthNet */}
                    <TouchableOpacity onPress={suggestTruthNote} onLongPress={suggestTruthNote} activeOpacity={0.7}>
                        <Eye color="#5EEAD4" size={20} strokeWidth={1.5} />
                    </TouchableOpacity>

                    {/* Bookmark */}
                    <TouchableOpacity onPress={handleBookmark} activeOpacity={0.7}>
                        <Bookmark
                            color={bookmarked ? '#5EEAD4' : '#94A3B8'}
                            fill={bookmarked ? '#5EEAD4' : 'transparent'}
                            size={20}
                            strokeWidth={1.5}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── Share Modal ─────────────────────────────────── */}
            <Modal
                visible={shareVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setShareVisible(false)}
            >
                <Pressable
                    className="flex-1 justify-end bg-black/60"
                    onPress={() => setShareVisible(false)}
                >
                    <Pressable onPress={() => { }} className="rounded-t-3xl overflow-hidden">
                        <View className="bg-[#0F1219] border-t border-white/10 px-6 pt-5 pb-10">
                            {/* Handle */}
                            <View className="w-10 h-1 bg-white/20 rounded-full self-center mb-5" />

                            {/* Header row */}
                            <View className="flex-row items-center justify-between mb-5">
                                <Text className="text-white font-bold text-lg">Share Reflection</Text>
                                <TouchableOpacity onPress={() => setShareVisible(false)}>
                                    <X color="#94A3B8" size={20} />
                                </TouchableOpacity>
                            </View>

                            {/* Link box */}
                            <View className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 flex-row items-center gap-3 mb-2">
                                <Link color="#5EEAD4" size={16} strokeWidth={1.5} />
                                <Text
                                    className="text-slate-400 text-sm flex-1"
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {postUrl}
                                </Text>
                                <TouchableOpacity onPress={copyLink} activeOpacity={0.7}>
                                    <Copy
                                        color={linkCopied ? '#5EEAD4' : '#94A3B8'}
                                        size={18}
                                        strokeWidth={1.5}
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Copied feedback */}
                            {linkCopied && (
                                <Text className="text-[#5EEAD4] text-xs text-center mb-4">
                                    ✓ Link copied to clipboard
                                </Text>
                            )}
                            {!linkCopied && <View className="mb-4" />}

                            {/* Divider */}
                            <View className="flex-row items-center gap-3 mb-5">
                                <View className="flex-1 h-px bg-white/10" />
                                <Text className="text-slate-500 text-xs">Share via</Text>
                                <View className="flex-1 h-px bg-white/10" />
                            </View>

                            {/* Platform buttons */}
                            <View className="flex-row justify-around mb-2">
                                {/* WhatsApp */}
                                <TouchableOpacity
                                    onPress={shareToWhatsApp}
                                    activeOpacity={0.8}
                                    className="items-center gap-2"
                                >
                                    <View className="w-14 h-14 rounded-2xl items-center justify-center bg-[#25D366]/15 border border-[#25D366]/30">
                                        <Text style={{ fontSize: 28 }}>💬</Text>
                                    </View>
                                    <Text className="text-slate-400 text-xs">WhatsApp</Text>
                                </TouchableOpacity>

                                {/* X / Twitter */}
                                <TouchableOpacity
                                    onPress={shareToX}
                                    activeOpacity={0.8}
                                    className="items-center gap-2"
                                >
                                    <View className="w-14 h-14 rounded-2xl items-center justify-center bg-white/10 border border-white/20">
                                        <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>𝕏</Text>
                                    </View>
                                    <Text className="text-slate-400 text-xs">X (Twitter)</Text>
                                </TouchableOpacity>

                                {/* Facebook */}
                                <TouchableOpacity
                                    onPress={shareToFacebook}
                                    activeOpacity={0.8}
                                    className="items-center gap-2"
                                >
                                    <View className="w-14 h-14 rounded-2xl items-center justify-center bg-[#1877F2]/15 border border-[#1877F2]/30">
                                        <Text style={{ fontSize: 28 }}>👥</Text>
                                    </View>
                                    <Text className="text-slate-400 text-xs">Facebook</Text>
                                </TouchableOpacity>

                                {/* Native Share */}
                                <TouchableOpacity
                                    onPress={nativeShare}
                                    activeOpacity={0.8}
                                    className="items-center gap-2"
                                >
                                    <View className="w-14 h-14 rounded-2xl items-center justify-center bg-[#5EEAD4]/10 border border-[#5EEAD4]/25">
                                        <Link color="#5EEAD4" size={22} strokeWidth={1.5} />
                                    </View>
                                    <Text className="text-slate-400 text-xs">More</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>

            {/* ── TruthNet Modal ─────────────────────────────────── */}
            <Modal
                visible={truthVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setTruthVisible(false)}
            >
                <Pressable
                    className="flex-1 justify-end bg-black/60"
                    onPress={() => setTruthVisible(false)}
                >
                    <Pressable onPress={() => { }} className="rounded-t-3xl overflow-hidden">
                        <View className="bg-[#0F1219] border-t border-white/10 px-6 pt-5 pb-10">
                            <View className="w-10 h-1 bg-white/20 rounded-full self-center mb-5" />
                            <View className="flex-row items-center justify-between mb-4">
                                <View>
                                    <Text className="text-white font-bold text-lg">TruthNet</Text>
                                    <Text className="text-slate-400 text-xs mt-1">Suggest a community note for this reflection</Text>
                                </View>
                                <TouchableOpacity onPress={() => setTruthVisible(false)}>
                                    <X color="#94A3B8" size={20} />
                                </TouchableOpacity>
                            </View>

                            <View className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
                                <Text className="text-slate-300 text-sm leading-6">
                                    Your vote carries a Soul Weight based on karma and badges. This module will later submit evidence and community review.
                                </Text>
                            </View>

                            {reflection.truthNote ? (
                                <View className="bg-[#5EEAD4]/10 border border-[#5EEAD4]/20 rounded-2xl p-4 mb-4">
                                    <Text className="text-[#5EEAD4] text-xs font-bold uppercase tracking-[1.5px] mb-1">
                                        TruthNet Note
                                    </Text>
                                    <Text className="text-white text-sm leading-6 mb-2">
                                        {reflection.truthNote.content}
                                    </Text>
                                    <Text className="text-slate-400 text-xs">
                                        Reputation Weight: {reflection.truthNote.reputationWeight}
                                    </Text>
                                </View>
                            ) : (
                                <View className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-4">
                                    <Text className="text-white font-semibold mb-2">No note yet</Text>
                                    <Text className="text-slate-400 text-sm leading-6">
                                        Long press TruthNet to suggest a note with evidence.
                                    </Text>
                                </View>
                            )}

                            <View className="flex-row gap-3">
                                <TouchableOpacity className="flex-1 bg-[#5EEAD4] py-4 rounded-2xl items-center">
                                    <Text className="text-[#05070A] font-bold">Helpful</Text>
                                </TouchableOpacity>
                                <TouchableOpacity className="flex-1 bg-white/5 border border-white/10 py-4 rounded-2xl items-center">
                                    <Text className="text-white font-bold">Not Helpful</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}
