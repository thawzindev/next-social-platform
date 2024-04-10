import React from 'react';

const PostSkeleton = () => (
    <div className="">
        <div className="my-2 h-10 w-1/3 animate-pulse rounded-xl bg-slate-300"></div>
        <div className="my-6 h-80 w-full animate-pulse rounded-xl bg-slate-300 sm:h-48 md:h-80 lg:h-80"></div>
    </div>
);

const FeedSkeleton = () => {
    return (
        <div className="mt-4 space-y-4">
            <div className="main-section rounded-md border bg-white px-4 pt-4">
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
            </div>
        </div>
    );
};

export default FeedSkeleton;
