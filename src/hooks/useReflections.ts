import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/api';

export function useTrendingReflections() {
    return useQuery({
        queryKey: ['reflections', 'trending'],
        queryFn: async () => {
            const { data } = await api.get('/reflections/trending');
            return data;
        },
    });
}

export function useFollowingReflections() {
    return useQuery({
        queryKey: ['reflections', 'following'],
        queryFn: async () => {
            const { data } = await api.get('/social/following/me/reflections'); // Example endpoint
            return data;
        },
    });
}

export function useCreateReflection() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { content: string; topicTags?: string[] }) => {
            const { data } = await api.post('/reflections', payload);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reflections'] });
        },
    });
}
