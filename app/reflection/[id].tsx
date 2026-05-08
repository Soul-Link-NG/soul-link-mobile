import React from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PostDetail } from '../../src/components/PostDetail';

// For now, we'll mock the data fetching. In a real app, this would come from a context or API.
const MOCK_REFLECTIONS = [
    {
        id: '1',
        content: 'The universe is not outside of you. Look inside everything that you want, you already are.',
        topicTags: ['Mindfulness', 'Wisdom'],
        createdAt: '2026-04-10T10:00:00Z',
        author: { username: 'abulex', displayName: 'Abulex', isVerified: true },
        _count: { likes: 42, comments: 12 },
    },
    {
        id: '2',
        content: 'Building a decentralized future for social connection. One reflection at a time. 🌐✨',
        topicTags: ['Web3', 'SoulLink'],
        createdAt: '2026-04-10T11:00:00Z',
        author: { username: 'soulink', displayName: 'SoulLink', isVerified: true },
        _count: { likes: 88, comments: 24 },
    },
];

export default function ReflectionDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const reflection = MOCK_REFLECTIONS.find(r => r.id === id) || MOCK_REFLECTIONS[0];

    return (
        <PostDetail 
            reflection={reflection} 
            onBack={() => router.back()} 
        />
    );
}
