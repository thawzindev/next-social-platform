/* eslint-disable prettier/prettier */
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { makeComment, makeReaction, postComments } from '@/services/apiService';
import toast from 'react-hot-toast';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/button';
import { Input } from '@/components/ui/input';
import { useFetchPostComments } from '@/hooks/useFetchPostComments';

const Post: React.FC<Post> = (post) => {

    const queryClient = useQueryClient();

    const [isLoading, setIsLoading] = React.useState(false);
    const [likeCount, setLikeCount] = React.useState(post.likeCount);
    const [commentText, setCommentText] = React.useState('');

    const [isLiked, setIsLiked] = React.useState(
        post.Like.filter((like) => like.userId === post.userId).length > 0,
    );

    const reactionMutation = useMutation({
        mutationFn: (payload: any) => {
            return makeReaction(payload);
        },
        onSuccess: async (data) => {
            console.log('SUCCESS');
            console.log(data);
            setLikeCount(data?.likeCount);
            setIsLiked(data?.action === 'like' ? true : false);
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

    const commentMutation = useMutation({
        mutationFn: (payload: any) => {
            return makeComment(payload);
        },
        onSuccess: async (data) => {
            queryClient.invalidateQueries(['post-comment']);
            toast.success(data?.message || 'Success');
        },
        onError: (error) => {
            console.log('error comments', error.stack);
            toast.error(error?.message);
        },
        onSettled: () => {
            setIsLoading(false);
        },
    });

    const setReaction = () => {
        const payload = {
            postId: post.id,
        };
        reactionMutation.mutate(payload);
    };

    const [fetchComments, setFetchComments] = React.useState(false);

    const {
        data: comments,
        isLoading: isCommentLoading,
        error,
    } = useFetchPostComments(fetchComments, post.id);

    console.log(comments);

    const handleButtonClick = () => {
        setFetchComments(true);
    };

    const addComment = () => {
        const payload = {
            postId: post.id,
            content: commentText,
        };
        commentMutation.mutate(payload);
    };

    const saveToBookmark = () => { };

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
                        <button
                            className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-gray-400 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                            onClick={() => setReaction()}
                        >
                            {isLiked && (
                                <HeartIcon className="mr-1 h-6 w-6 fill-red-600 text-red-600" />
                            )}

                            {!isLiked && (
                                <HeartIcon className="mr-1 h-6 w-6 hover:text-red-400" />
                            )}
                            {likeCount}
                        </button>
                        <button className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-gray-400 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                            <Drawer>
                                <DrawerTrigger
                                    onClick={() => {
                                        handleButtonClick();
                                    }}
                                >
                                    <MessageCircleIcon className="mr-1 h-6 w-6 hover:text-blue-400" />
                                </DrawerTrigger>
                                <DrawerContent>
                                    <DrawerHeader>
                                        <DrawerTitle>Comments</DrawerTitle>
                                        <DrawerDescription>
                                            <div className="mt-6 grid gap-6">

                                                {isCommentLoading ? (
                                                    'Loading comments...'
                                                ) : error ? (
                                                    'Error fetching comments'
                                                ) : (
                                                    comments?.map((comment) => (
                                                        <div
                                                            className="grid gap-1.5 border-b pb-2 text-sm"
                                                            key={
                                                                comment.id
                                                            }
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div className="font-bold text-gray-900">
                                                                    {comment?.user?.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                    {formatDistanceToNow(
                                                                        new Date(
                                                                            comment?.createdAt,
                                                                        ),
                                                                        {
                                                                            addSuffix: true,
                                                                        },
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                {comment?.content}
                                                            </div>
                                                        </div>

                                                    ))
                                                )}

                                                <div className="grid gap-1.5 text-sm">
                                                    <Input placeholder="Add your comment ..." onChange={(e) => setCommentText(e.target.value)} />
                                                </div>
                                            </div>
                                        </DrawerDescription>
                                    </DrawerHeader>
                                    <DrawerFooter>
                                        <Button onClick={() => addComment()}>Add Comment</Button>
                                        {/* <DrawerClose>
                                            <Button variant="outline">Cancel</Button>
                                        </DrawerClose> */}
                                    </DrawerFooter>
                                </DrawerContent>
                            </Drawer>
                            2.7K
                        </button>

                        <button
                            className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-gray-400 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                            onClick={() => saveToBookmark()}
                        >
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
