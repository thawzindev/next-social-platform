import { getPosts, getProfile } from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';

export const useFetchProfile = (id?: string) => {
    return useQuery({
        queryKey: [`profile`, id],
        queryFn: () => getProfile(id),
    });
};
