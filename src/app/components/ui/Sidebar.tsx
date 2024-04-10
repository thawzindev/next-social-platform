'use client';

import React from 'react';
import { signOut } from 'next-auth/react';
import {
    BellIcon,
    BookmarkIcon,
    HomeIcon,
    LogOutIcon,
    MailIcon,
    PlusCircleIcon,
    PlusIcon,
    SearchIcon,
    SearchXIcon,
    UserIcon,
    UsersIcon,
} from 'lucide-react';
import { Button } from '@/components/button';
import { currentUser, SignOutButton, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
    const { isLoaded, isSignedIn, user } = useUser();

    const router = useRouter();

    if (!isLoaded || !isSignedIn) {
        // return null;
    }

    // console.log(user.imageUrl);

    return (
        <div className="border-1 mt-8 h-fit space-y-4 rounded rounded-md border bg-[#FFFFFF] p-4">
            <div className="ml-5">
                {/* <Image
                    src={
                        'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/512px-Logo_of_Twitter.svg.png'
                    }
                    alt="logo"
                    width={40}
                    height={40}
                    className="ml-4"
                /> */}
                <h1 className="text-lg font-bold">SocialShot</h1>
            </div>

            <div className="space-y-2">
                <button
                    className="inline-flex h-10 w-full items-center justify-start whitespace-nowrap rounded-md px-4 py-2 text-left text-sm font-medium text-gray-900 ring-offset-background transition-colors hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => {
                        router.push('/');
                    }}
                >
                    <HomeIcon className="mr-2 h-4 w-4" />
                    Home
                </button>

                <button className="inline-flex h-10 w-full items-center justify-start whitespace-nowrap rounded-md px-4 py-2 text-left text-sm font-medium text-gray-900 ring-offset-background transition-colors hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                    <BookmarkIcon className="mr-2 h-4 w-4" />
                    Saved
                </button>

                <button
                    className="inline-flex h-10 w-full items-center justify-start whitespace-nowrap rounded-md px-4 py-2 text-left text-sm font-medium text-gray-900 ring-offset-background transition-colors hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => {
                        router.push('/friends/requests');
                    }}
                >
                    <UsersIcon className="mr-2 h-4 w-4" />
                    Requests
                    {/* <span className="ml-1 rounded-md bg-emerald-200 p-1 text-xs">
                        100
                    </span> */}
                </button>

                <button
                    className="inline-flex h-10 w-full items-center justify-start whitespace-nowrap rounded-md px-4 py-2 text-left text-sm font-medium text-gray-900 ring-offset-background transition-colors hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => {
                        router.push('/notifications');
                    }}
                >
                    <BellIcon className="mr-2 h-4 w-4" />
                    Notifications
                </button>

                <button
                    className="inline-flex h-10 w-full items-center justify-start whitespace-nowrap rounded-md px-4 py-2 text-left text-sm font-medium text-gray-900 ring-offset-background transition-colors hover:bg-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => {
                        router.push('/messages');
                    }}
                >
                    <MailIcon className="mr-2 h-4 w-4" />
                    Messages
                </button>

                <hr />

                <button
                    className="inline-flex h-10 w-full items-center justify-start whitespace-nowrap rounded-md px-4 py-2 text-left text-sm font-medium text-gray-900 ring-offset-background transition-colors hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => {
                        router.push(`/profile`);
                    }}
                >
                    <Image
                        src={user?.imageUrl}
                        alt="code statistics"
                        className="w-30 h-30 mr-1 rounded-full"
                        width={30}
                        height={30}
                        style={{
                            aspectRatio: '30 / 30',
                            objectFit: 'cover',
                        }}
                    />
                    <p className="px-2">
                        {user?.firstName} {user?.lastName}
                    </p>
                </button>

                <hr />

                <SignOutButton>
                    <div className="ml-4 flex cursor-pointer px-2 py-3 hover:rounded-lg hover:bg-red-100">
                        <LogOutIcon className="h-6 w-6" />
                        <span className="ml-3">Logout</span>
                    </div>
                </SignOutButton>
                {/* <SignOutButton /> */}
            </div>
        </div>
    );
};

export default Sidebar;
