'use client';

import Post from '@/app/components/elements/Post';
import { Button } from '@/components/button';
import { useFetchSearchResult } from '@/hooks/useFetchSearchResult';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import React from 'react';

const Page = () => {
    const searchParams = useSearchParams();

    const search = searchParams.get('keywords');

    const { data, isFetching, isError } = useFetchSearchResult(
        search as string,
    );

    // if (isFetching) {
    //     return (
    //         <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
    //             <div className="mt-4 w-[650px] space-y-4">
    //                 <div className="py-12 px-4 text-sm font-medium text-center text-gray-900">
    //                     Loading...
    //                 </div>
    //             </div>
    //         </div>
    //     )
    // }

    console.log('data', data);

    return (
        <div className="space-y-2 px-2">
            <div className="main-section rounded-md border bg-white px-4 pt-4">
                <h1>People</h1>

                {data?.people &&
                    data?.people.map((person) => {
                        return (
                            <div className="py-2" key={person.id}>
                                <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm">
                                    <Image
                                        src={
                                            'https://cdn2.vectorstock.com/i/1000x1000/38/21/male-face-avatar-logo-template-pictograph-vector-11333821.jpg'
                                        }
                                        alt="profile"
                                        width={40}
                                        height={40}
                                        className="h-12 w-12 rounded-lg"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900">
                                            {person.name}
                                        </p>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <Button
                                            className="mx-2"
                                            variant={'default'}
                                        >
                                            Friend Request
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                <hr className="my-2 text-gray-800" />

                <h1 className="my-2">Posts</h1>

                <div className="mb-5">
                    {data?.posts &&
                        data?.posts?.map((post) => {
                            return <Post key={post.id} {...post} />;
                        })}
                </div>
            </div>
        </div>
    );
};

export default Page;
