import { friendRequestList, getPosts } from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';

export const useFetchFriendRequest = () => {
    return useQuery({
        queryKey: [`friendRequestList`],
        queryFn: () => friendRequestList(),
    });
};
