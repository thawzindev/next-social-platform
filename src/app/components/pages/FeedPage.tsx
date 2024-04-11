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

    useEffect(() => {
        if (newPosts && newPosts.length > 0) {
            // setPosts((prevPosts) => [newPosts[0], ...prevPosts]);
            let pp = [...newPosts, ...posts];
            pp.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            setPosts(pp);
        }
        console.log('refetching posts', posts);

    }, [newPosts]);

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
        <>

            {
                (isFetching) && (
                    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                        <div className="py-12 px-4 text-sm font-medium text-center text-gray-900">
                            Loading...
                        </div>
                    </div>
                )
            }

            <div className="">
                <div className="space-y-2">
                    {posts &&
                        posts.map((post) => {
                            return <PostComponent key={post.id} {...post} />;
                        })}
                </div>

                {newPosts?.length === 0 && (
                    <div className="space-y-2">
                        <p className="text-md font-bold">No More Posts ...</p>
                    </div>
                )}

                <div className="mb-4 flex justify-center mt-5">
                    <button
                        className="rounded-lg bg-gray-600 px-4 py-2 text-white w-full"
                        onClick={() => {
                            console.log('Load More');
                            setPage(page + 1);
                        }}
                    >
                        Load More
                    </button>
                </div>
            </div>
        </>
    );
};

export default FeedPage;
