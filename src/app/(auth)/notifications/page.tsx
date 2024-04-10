'use client';

import { useFetchNotifications } from '@/hooks/useFetchNotifications';
import Image from 'next/image';
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/app/lib/utils';
import { DotIcon } from 'lucide-react';

const Page = () => {
    const { data, error } = useFetchNotifications();
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="mx-2 min-h-screen rounded-md bg-white p-2">
            <h1 className="text-lg font-bold">Notifications</h1>

            <div className="mt-5 p-0">
                <div className="space-y-2 divide-y divide-gray-200 dark:divide-gray-800">
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
