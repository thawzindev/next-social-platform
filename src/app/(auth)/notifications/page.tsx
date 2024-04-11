'use client';

import { useFetchNotifications } from '@/hooks/useFetchNotifications';
import Image from 'next/image';
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/app/lib/utils';
import { DotIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { readNotification } from '@/services/apiService';
import { useRouter } from 'next/navigation';

const Page = () => {
    const { data, error, isFetching } = useFetchNotifications();
    const [isLoading, setIsLoading] = useState(false);

    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation({
        mutationKey: ['notification-read'],
        mutationFn: (formData: object) => {
            return readNotification(formData)
        },
        onSuccess: () => {
            // queryClient.invalidateQueries({ queryKey: ['notifications'] });
            setIsLoading(false);
        },
        onError: (error) => {
            setIsLoading(false);
        },
    });

    const handleSubmit = (notification: any) => {
        console.log(notification)
        setIsLoading(true);
        const data = {
            id: notification.postId
        };
        mutation.mutate(data);

        router.push(`/posts/${notification.postId}`)
    };


    return (
        <div className="mx-2 min-h-screen rounded-md bg-white p-2">
            <h1 className="text-lg font-bold">Notifications</h1>

            {
                (isFetching) && (
                    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                        <div className="py-12 px-4 text-sm font-medium text-center text-gray-900">
                            Loading...
                        </div>
                    </div>
                )
            }

            <div className="mt-5 p-0">
                <div className="space-y-2 divide-y divide-gray-200 dark:divide-gray-800">

                    {
                        (!data?.notifications || data?.notifications?.length === 0) && (
                            <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                                <p>No notifications</p>
                            </div>
                        )
                    }

                    {data?.notifications &&
                        data?.notifications.map((notification: any) => {
                            return (
                                <div
                                    className={cn(
                                        'flex flex-1 cursor-pointer items-center gap-4 rounded p-4 hover:bg-gray-100',
                                        !notification.isRead
                                            ? 'bg-gray-200'
                                            : 'bg-gray-50',
                                    )}
                                    key={notification.id}
                                    onClick={() => handleSubmit(notification)}
                                >
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={notification.user.profileImage}
                                            width="40"
                                            height="40"
                                            alt="Avatar"
                                            className="rounded-full"
                                        />
                                    </div>
                                    <div className="grid w-full gap-1 text-sm">
                                        <p className="font-medium">
                                            {notification.content}
                                        </p>

                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {formatDistanceToNow(
                                                notification.createdAt,
                                                { addSuffix: true },
                                            )}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

export default Page;
