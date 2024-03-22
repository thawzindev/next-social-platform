'use client';

import type { Post } from '@/types/Post';
import {
    BookmarkCheckIcon,
    BookmarkIcon,
    HeartIcon,
    InboxIcon,
    MessageCircleIcon,
    SaveIcon,
} from 'lucide-react';
import Image from 'next/legacy/image';
import Link from 'next/link';
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const Post: React.FC<Post> = (post) => {
    return (
        <>
            <div className="main-section rounded-md border bg-white px-4 pt-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Image
                            className="h-8 w-8 overflow-hidden rounded-full object-cover"
                            src={post.user.profileImage}
                            height={25}
                            width={25}
                            alt="user avatar"
                            loading="lazy"
                        />
                        <div className="flex flex-col">
                            <Link
                                href={`/profile/${post.user.id}`}
                                className="text-md font-semibold"
                            >
                                {post.user.name}
                            </Link>
                        </div>
                    </div>

                    <span className="self-center text-sm text-gray-500">
                        {formatDistanceToNow(new Date(post.createdAt), {
                            addSuffix: true,
                        })}
                    </span>
                </div>

                <div className="mb-4">
                    <p className="my-2">{post.content}</p>
                    <div className="relative flex justify-center">
                        {post.file && post.file.fullUrl && (
                            <Image
                                src={post.file.fullUrl}
                                alt={post.content}
                                loading="lazy"
                                width={
                                    post.file.width
                                        ? parseInt(post.file.width)
                                        : 500
                                }
                                height={
                                    post.file.height
                                        ? parseInt(post.file.height)
                                        : 500
                                }
                                className="h-96 w-96 cursor-pointer rounded-md"
                            />
                        )}
                    </div>

                    {/* <div className="relative h-[500px] w-[500px]">
                        {post.file && post.file.fullUrl && (
                            <Image
                                layout="fill"
                                src={post.file.fullUrl}
                                alt={post.content}
                                sizes="50px"
                            />
                        )}
                    </div> */}

                    <div className="mt-2 flex items-center justify-start space-x-4">
                        <button className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-gray-400 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                            <HeartIcon className="mr-1 h-6 w-6 hover:text-red-400" />
                            58
                        </button>
                        <button className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-gray-400 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                            <MessageCircleIcon className="mr-1 h-6 w-6 hover:text-blue-400" />
                            2.7K
                        </button>

                        <button className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-gray-400 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                            <BookmarkIcon className="mr-1 h-6 w-6 hover:text-blue-400" />
                            4.3K
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Post;
