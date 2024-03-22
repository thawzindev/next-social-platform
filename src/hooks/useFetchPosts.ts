import { getPosts } from '@/services/apiService';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

export const useFetchPosts = (page?: number, userId?: string) => {
    return useSuspenseQuery({
        queryKey: [`posts`, page, userId],
        queryFn: () => getPosts(page, userId),
    });
};
