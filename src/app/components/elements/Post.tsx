/* eslint-disable prettier/prettier */
'use client';

import type { Post } from '@/types/Post';
import {
    AlertCircleIcon,
    BookmarkCheckIcon,
    BookmarkIcon,
    HeartIcon,
    InboxIcon,
    MessageCircleIcon,
    MoreHorizontalIcon,
    SaveIcon,
    TrashIcon,
} from 'lucide-react';
import Image from 'next/legacy/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deletePost, makeBookmark, makeComment, makeReaction, postComments, reportComment, reportPost } from '@/services/apiService';
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
import { DropdownMenu, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/dropdown-menu';
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu';
import { useUser } from '@clerk/nextjs';

const Post: React.FC<Post> = (post) => {

    const queryClient = useQueryClient();
    const { isLoaded, isSignedIn, user } = useUser();

    const [isLoading, setIsLoading] = React.useState(false);
    const [actionOpen, setActionOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [likeCount, setLikeCount] = React.useState(post.likeCount);
    const [commentCount, setComentCount] = React.useState(post.commentCount);
    const [commentText, setCommentText] = React.useState('');

    const [isLiked, setIsLiked] = React.useState(
        post?.Like?.filter((like) => like?.userId === post.userId).length > 0,
    );

    const [isBookmark, setIsBookmark] = React.useState(
        post?.Bookmark?.filter((bookmark) => bookmark?.userId === post.userId).length > 0,
    );

    const reactionMutation = useMutation({
        mutationFn: (payload: any) => {
            return makeReaction(payload);
        },
        onSuccess: async (data) => {
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


    const bookmarkMutation = useMutation({
        mutationFn: (payload: any) => {
            return makeBookmark(payload);
        },
        onSuccess: async (data) => {
            setIsBookmark(data?.action === 'store' ? true : false);
            toast.success(data?.message || 'Success');
        },
        onError: (error) => {
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
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ['post-comment'],
            })
            setComentCount(commentCount + 1)
            toast.success(data?.message || 'Success');
        },
        onError: (error) => {
            console.log('error comments', error.stack);
            toast.error("something went wrong");
        },
        onSettled: () => {
            setCommentText('')
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

    const saveToBookmark = () => {
        const payload = {
            postId: post.id,
        };
        bookmarkMutation.mutate(payload);
    };

    const reportMutation = useMutation({
        mutationFn: (payload: any) => {
            return reportPost(post.id, payload);
        },
        onSuccess: async (data) => {
            toast.success('Reported this idea', { duration: 2000 })
        },
        onError: (error) => {
            toast.error(error.message, { duration: 2000 })
            console.log('error', error.message)
        },
        onSettled: () => {
            setReportReason('')
            setModalOpen(false)
            setIsLoading(false)
        },
    })

    const commentReportMutation = useMutation({
        mutationFn: (payload: any) => {
            return reportComment(post.id, payload);
        },
        onSuccess: async (data) => {
            toast.success('Reported this idea', { duration: 2000 })
        },
        onError: (error) => {
            toast.error(error.message, { duration: 2000 })
            console.log('error', error.message)
        },
        onSettled: () => {
            setReportReason('')
            setModalOpen(false)
            setIsLoading(false)
        },
    })

    const postDeleteMutation = useMutation({
        mutationFn: (payload) => {
            return deletePost(post.id, payload);
        },
        onSuccess: async (data) => {
            toast.success('Deleted the post', { duration: 2000 })
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
        onError: (error) => {
            toast.error(error.message, { duration: 2000 })
            console.log('error', error.message)
        },
        onSettled: () => {
            setReportReason('')
            setModalOpen(false)
            setIsLoading(false)
        },
    })

    const submitReport = () => {
        setIsLoading(true)
        const payload = {
            reason: reportReason,
            postId: post.id
        }
        reportMutation.mutate(payload)
    }

    const submitCommentReport = (commentId: string, commentReportReason: string) => {
        setIsLoading(true)
        const payload = {
            reason: commentReportReason,
            commentId: commentId,
            postId: post.id
        }
        commentReportMutation.mutate(payload)
    }

    const submitDeleteIdea = () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            setIsLoading(true)
            const payload = {
                postId: post.id
            }
            postDeleteMutation.mutate(payload)
        }
    }

    return (
        <>
            <div className="main-section rounded-md border bg-white px-4 pt-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Image
                            className="h-8 w-8 overflow-hidden rounded-full object-cover"
                            src={post?.user?.profileImage}
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

                    <span className="flex-1 text-right text-sm text-gray-500">
                        {formatDistanceToNow(new Date(post.createdAt), {
                            addSuffix: true,
                        })}
                    </span>

                    <span className='action'>
                        <DropdownMenu open={actionOpen} onOpenChange={setActionOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                    <MoreHorizontalIcon className="text-gray-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuItem onClick={() => setModalOpen(true)}>
                                    <AlertCircleIcon className="w-5 h-5 mr-2" />
                                    Report
                                </DropdownMenuItem>
                                {
                                    post.user?.refId === user?.id && (
                                        <DropdownMenuGroup>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600 hover:text-red-800"
                                                onClick={() => submitDeleteIdea()}
                                            >
                                                <TrashIcon className="w-5 h-5 mr-2" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    )
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>

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
                                                    comments?.map((comment: any) => (
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
                                                                <div className='text-right flex-1 cursor-pointer'
                                                                    onClick={() => {
                                                                        let reportReason = prompt('Report Reason');

                                                                        if (reportReason) {
                                                                            submitCommentReport(comment.id, reportReason)
                                                                        }

                                                                    }}
                                                                >
                                                                    report
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
                            {commentCount}
                        </button>

                        <button
                            className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-gray-400 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                            onClick={() => saveToBookmark()}
                        >
                            {isBookmark && (
                                <BookmarkIcon className="mr-1 h-6 w-6 hover:text-blue-400 fill-orange-600" />
                            )}

                            {!isBookmark && (
                                <BookmarkIcon className="mr-1 h-6 w-6 hover:text-blue-400" />)}
                        </button>
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Report Reason
                                        </h3>
                                        <div className="mt-2">
                                            <textarea value={reportReason} onChange={(e) => setReportReason(e.target.value)} className="w-full p-2 border border-gray-300 rounded"></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm" onClick={submitReport} disabled={isLoading}>
                                    Submit
                                </button>
                                <button type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm" onClick={() => setModalOpen(false)} disabled={isLoading}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Post;
