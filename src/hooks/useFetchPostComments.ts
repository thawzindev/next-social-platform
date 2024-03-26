import { getPosts, postComments } from '@/services/apiService';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

export const useFetchPostComments = (fetch: boolean, postId?: string) => {
    return useQuery({
        queryKey: [`post-comment`, postId],
        queryFn: () => postComments(postId as string),
        enabled: fetch,
    });
};
