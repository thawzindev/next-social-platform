/* eslint-disable prettier/prettier */
"use client";

import { Button } from '@/components/button';
import { useFetchFriendRequest } from '@/hooks/useFetchFriendRequest';
import { friendRequest } from '@/services/apiService';
import { useMutation } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const Page = () => {
    const { data: friends, error } = useFetchFriendRequest();
    const [isLoading, setIsLoading] = useState(false);

    const mutation = useMutation({
        mutationFn: (payload: any) => {
            return friendRequest(payload);
        },
        onSuccess: async (data) => {
            console.log("SUCCESS");
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

    const friendRequestAction = (type: string, userId: string, id: string) => {
        const payload = {
            requestTo: userId,
            type: type,
            id: id,
        };
        setIsLoading(true);
        mutation.mutate(payload);
    }

    return (
        <div className="main-section mx-4 mt-8 w-[700px] space-y-4 rounded-md border bg-white px-4 pt-4">
            <div className="relative flex justify-center">
                <div className="mt-4 w-[700px] space-y-4">
                    <h1>Friends Request List</h1>
                    <div className="mx-auto grid max-w-6xl gap-3 lg:grid-cols-1">

                        {
                            friends && friends.length === 0 && (
                                <p className='text-center py-10'>No friends request found</p>
                            )
                        }

                        {friends && friends.map((person) => (
                            <div
                                key={person.id}
                                className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm"
                            >
                                <Image
                                    src={person?.from?.profileImage}
                                    alt="profile"
                                    width={40}
                                    height={40}
                                    className="h-12 w-12 rounded-lg"
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {person?.from?.name}
                                    </p>
                                </div>

                                <div className="min-w-0 flex-1">
                                    <Button
                                        className="mx-2"
                                        variant={'default'}
                                        onClick={() =>
                                            friendRequestAction('FRIEND', person?.from?.id, person.id)
                                        }
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        className="mx-2"
                                        variant={'destructive'}
                                        onClick={() =>
                                            friendRequestAction('REJECT', person?.from?.id, person.id)
                                        }
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page;