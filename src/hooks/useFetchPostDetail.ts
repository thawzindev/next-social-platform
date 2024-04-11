import { getPostDetail, getPosts } from '@/services/apiService';
import {
    useInfiniteQuery,
    useQuery,
    useSuspenseInfiniteQuery,
    useSuspenseQuery,
} from '@tanstack/react-query';

export const useFetchPostDetail = (postId: string) => {
    return useQuery({
        queryKey: [`posts`, postId],
        // queryKey: [`posts`],
        queryFn: () => getPostDetail(postId),
    });
};
