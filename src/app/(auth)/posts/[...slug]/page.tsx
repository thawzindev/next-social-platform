'use client';

import React, { Suspense, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFetchPostDetail } from '@/hooks/useFetchPostDetail';
import Post from '@/app/components/elements/Post';
import { useQueryClient } from '@tanstack/react-query';

const Feed = () => {

    const { slug } = useParams();
    const queryClient = useQueryClient();

    const { data: post, isFetching } = useFetchPostDetail(slug as string);

    return (

        <div className="flex-1 bg-white rounded-md mx-2">

            {/* <div className="p-2"> */}

            {
                (isFetching && !post) && (
                    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                        <div className="py-12 px-4 text-sm font-medium text-center text-gray-900">
                            Loading...
                        </div>
                    </div>
                )
            }

            {
                post && (
                    <Post {...post} />
                )
            }

            {/* </div> */}
        </div >

    );
};

export default Feed;
