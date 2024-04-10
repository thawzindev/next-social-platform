import { getPosts } from '@/services/apiService';
import {
    useInfiniteQuery,
    useQuery,
    useSuspenseInfiniteQuery,
    useSuspenseQuery,
} from '@tanstack/react-query';

export const useFetchPosts = (page: number, userId?: string) => {
    return useQuery({
        queryKey: [`posts`, page, userId],
        // queryKey: [`posts`],
        queryFn: () => getPosts(page, userId),
    });
};
