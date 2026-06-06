import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PostDetail } from '../../src/components/PostDetail';
import { api } from '../../src/services/api';
import { ActivityIndicator, View, Text } from 'react-native';

export default function ReflectionDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [reflection, setReflection] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [refResponse, commentsResponse] = await Promise.all([
                api.get(`/reflections/${id}`),
                api.get(`/reflections/${id}/comments`),
            ]);
            setReflection(refResponse.data);
            setComments(commentsResponse.data);
        } catch (error) {
            console.error('Error fetching reflection details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchData();
        }
    }, [id]);

    if (loading) {
        return (
            <View className="flex-1 bg-[#05070A] items-center justify-center">
                <ActivityIndicator size="large" color="#5EEAD4" />
            </View>
        );
    }

    if (!reflection) {
        return (
            <View className="flex-1 bg-[#05070A] items-center justify-center p-6">
                <Text className="text-white text-lg mb-4">Reflection not found</Text>
            </View>
        );
    }

    return (
        <PostDetail 
            reflection={reflection} 
            comments={comments}
            onBack={() => router.back()} 
            onRefresh={fetchData}
        />
    );
}
