'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import PostComponent from '../elements/Post';
import { Post } from '@/types/Post';
import { useFetchPosts } from '@/hooks/useFetchPosts';
import { useInView } from 'react-intersection-observer';

type FeedPageProps = {
    userId?: string;
};

const FeedPage: React.FC<FeedPageProps> = ({ userId }) => {
    const [page, setPage] = React.useState(1);

    const [posts, setPosts] = React.useState<Post[]>([]);

    const { data: newPosts, error, isFetching } = useFetchPosts(page, userId);

    // useEffect(() => {
    //     console.log('refetching posts', newPosts);
    //     if (newPosts && newPosts.length > 0) {
    //         setPosts((prevPosts) => [...prevPosts, ...newPosts]);
    //     }
    // }, [newPosts]);

    if (error) {
        return (
            <div className="space-y-2">
                <div className="space-y-2">
                    <p className="text-2xl font-bold">{error.message}</p>
                </div>
            </div>
        );
    }

    // if (isFetching) {
    //     return (
    //         <div className="space-y-2">
    //             <div className="space-y-2">
    //                 <p className="text-2xl font-bold">Getting posts</p>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="">
            <div className="space-y-2">
                {newPosts &&
                    newPosts.map((post) => {
                        return <PostComponent key={post.id} {...post} />;
                    })}
            </div>

            {isFetching && (
                <div className="space-y-2">
                    <p className="text-md font-bold">Getting posts</p>
                </div>
            )}

            {newPosts?.length === 0 && (
                <div className="space-y-2">
                    <p className="text-md font-bold">No More Posts ...</p>
                </div>
            )}

            <div className="mb-4">
                <button
                    className="rounded-lg bg-gray-400 px-4 py-2 text-white"
                    onClick={() => {
                        console.log('Load More');
                        setPage(page + 1);
                    }}
                >
                    Load More
                </button>
            </div>
        </div>
    );
};

export default FeedPage;
