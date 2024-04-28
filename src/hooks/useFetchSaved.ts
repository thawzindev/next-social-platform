import { getPosts, savedPost } from '@/services/apiService';
import {
    useInfiniteQuery,
    useQuery,
    useSuspenseInfiniteQuery,
    useSuspenseQuery,
} from '@tanstack/react-query';

export const useFetchSaved = () => {
    return useQuery({
        queryKey: [`saved`],
        // queryKey: [`posts`],
        queryFn: () => savedPost(),
    });
};
