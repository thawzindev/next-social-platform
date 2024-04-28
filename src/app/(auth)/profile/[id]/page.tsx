'use client';

import FeedPage from '@/app/components/pages/FeedPage';
import FeedSkeleton from '@/app/components/skeletons/FeedSkeleton';
import { useFetchProfile } from '@/hooks/useFetchProfile';
import { friendRequest } from '@/services/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserRoundPlusIcon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { Suspense } from 'react';
import toast from 'react-hot-toast';

const Page = () => {
    const { id: userId } = useParams();
    const [isLoading, setIsLoading] = React.useState(false);
    const queryClient = useQueryClient();

    const { data: profile, error } = useFetchProfile(userId as string);

    const mutation = useMutation({
        mutationFn: (payload: any) => {
            return friendRequest(payload);
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: ['profile'] });
            toast.success(data?.message || 'Success');
        },
        onError: (error) => {
            console.log('error ggg', error);
            toast.error(error?.message);
        },
        onSettled: () => {
            setIsLoading(false);
        },
    });

    const addFriend = () => {
        console.log('add friend');

        const payload = {
            requestTo: userId,
            type: 'FRIEND_PENDING',
        };
        setIsLoading(true);
        mutation.mutate(payload);
    };

    const cancelFriendRequest = () => {
        const payload = {
            requestTo: userId,
            type: 'CANCEL_REQUEST',
        };
        setIsLoading(true);
        mutation.mutate(payload);
    };

    const unfriend = () => {
        const payload = {
            requestTo: userId,
            type: 'UNFRIEND',
        };
        setIsLoading(true);
        mutation.mutate(payload);
    };

    let friendStatus;

    if (profile?.friendStatus === 'FRIEND_PENDING') {
        friendStatus = (
            <button
                className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => {
                    cancelFriendRequest();
                }}
            >
                Cancel Frient Request
            </button>
        );
    } else if (profile?.friendStatus === 'FRIEND') {
        friendStatus = (
            <button
                className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => {
                    unfriend();
                }}
            >
                Unfriend
            </button>
        );
    } else if (profile?.friendStatus === 'none') {
        friendStatus = (
            <button
                className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => {
                    addFriend();
                }}
            >
                <UserRoundPlusIcon className="w-4 h-4 mr-1" /> Add friend
            </button>
        );
    }

    return (
        <div className="px-2">
            <div className="mb-3 rounded-lg bg-white p-2">
                <div className="mb-2">
                    <div className="flex items-center space-x-4">
                        <div className="h-36 w-36 overflow-hidden rounded-lg border-2 border-white">
                            <Image
                                src={profile?.profileImage}
                                width={300}
                                height={300}
                                alt="profile"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <h1 className="text-2xl font-bold">
                                {profile?.name}
                            </h1>
                            {friendStatus}
                        </div>
                    </div>
                </div>
                <div className="mb-4 space-y-2">
                    <p className="text-sm leading-none">
                        <span className="mr-1 font-medium">Friends:</span>
                        {profile?.gotRequests.length}
                    </p>
                    <p className="text-sm leading-none">
                        <span className="mr-1 font-medium">Location:</span>
                        New York, NY
                    </p>
                </div>
            </div>

            <h3 className="text-lg font-bold">Posts</h3>

            <Suspense fallback={<FeedSkeleton />}>
                <FeedPage userId={userId} />
            </Suspense>
        </div>
    );
};

export default Page;
