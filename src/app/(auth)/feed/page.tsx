'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { getServerSession } from 'next-auth';
import useSWR, { preload } from 'swr';
import useSWRInfinite from 'swr/infinite';
import Sidebar from '@/app/components/ui/Sidebar';
import CreatePost from '@/app/components/elements/CreatePost';
import Post from '@/app/components/elements/Post';
import Trending from '@/app/components/ui/Trending';
import Navbar from '@/app/components/ui/Navbar';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useFetchPosts } from '@/hooks/useFetchPosts';
import FeedPage from '@/app/components/pages/FeedPage';
import FeedSkeleton from '@/app/components/skeletons/FeedSkeleton';

const Feed = () => {
    return (
        <>
            <div className="min-h-screen">
                <div className="flex-1 border-gray-600">
                    <div className="p-4">
                        <CreatePost />
                        <Suspense fallback={<FeedSkeleton />}>
                            {<FeedPage />}
                        </Suspense>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Feed;
