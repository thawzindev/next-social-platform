import { getPosts, postComments, searchResult } from '@/services/apiService';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';

export const useFetchSearchResult = (keywords: string) => {
    return useQuery({
        queryKey: [`search`, keywords],
        queryFn: () => searchResult(keywords),
    });
};
