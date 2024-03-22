import React from 'react';
import PostComponent from '../elements/Post';
import { Post } from '@/types/Post';
import { useFetchPosts } from '@/hooks/useFetchPosts';

type FeedPageProps = {
    userId?: string;
};

const FeedPage: React.FC<FeedPageProps> = ({ userId }) => {
    const page = 1;
    // const { data: posts, error } = useFetchPosts(page, userId);
    const { data: posts, error } = useFetchPosts(1, userId);

    if (error) {
        return (
            <div className=" mt-4 w-[650px] space-y-4">
                <div className="space-y-2">
                    <p className="text-2xl font-bold">{error.message}</p>
                </div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className=" mt-4 w-[650px] space-y-4">
                <div className="space-y-2">
                    <p className="text-2xl font-bold">No posts found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mt-4 w-[650px] space-y-4">
            <div className="space-y-2">
                {posts &&
                    posts.map((post) => {
                        return <PostComponent key={post.id} {...post} />;
                    })}
            </div>
        </div>
    );
};

export default FeedPage;
