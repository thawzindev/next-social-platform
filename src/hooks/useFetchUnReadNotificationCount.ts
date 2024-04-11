import { getUnReadNotificationCount } from '@/services/apiService';
import { useQuery } from '@tanstack/react-query';

export const useFetchUnReadNotificationCount = () => {
    return useQuery({
        queryKey: [`notifications-unread`],
        queryFn: () => getUnReadNotificationCount(),
        retry: false,
        refetchInterval: 5000,
    });
};
