import { getNotifications } from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';

export const useFetchNotifications = () => {
    return useQuery({
        queryKey: [`notifications`],
        queryFn: () => getNotifications(),
        retry: false,
        refetchInterval: 5000,
    });
};
