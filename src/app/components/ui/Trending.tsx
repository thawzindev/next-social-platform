'use client';

import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import React from 'react';

const Trending = () => {
    const router = useRouter();

    const searchResult = (value: string) => {
        router.push(`/search?keywords=${value}`);
    };

    return (
        <>
            <div className="border-1 mt-8 h-fit space-y-6 rounded rounded-md border bg-[#FFFFFF] p-4">
                <div className="mt-0">
                    <h3 className="text-sm font-bold">Search</h3>
                    <div className="mt-2 space-y-2">
                        <Input
                            type="text"
                            className="rounded-md focus:outline-none"
                            placeholder="keywords ..."
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    searchResult(event.target.value);
                                }
                            }}
                        />
                    </div>
                </div>

                {/* <hr />

                <div className="mt-0">
                    <h3 className="text-sm font-bold">Top Trendings</h3>
                    <div className="mt-2 space-y-2">
                        <div>
                            <h4 className="">#ios</h4>
                            <span className="text-sm text-gray-400">
                                20.9K posts
                            </span>
                        </div>

                        <div>
                            <h4 className="">#apple</h4>
                            <span className="text-sm text-gray-400">
                                20.9K posts
                            </span>
                        </div>

                        <div>
                            <h4 className="">#chatgpt</h4>
                            <span className="text-sm text-gray-400">
                                20.9K posts
                            </span>
                        </div>

                        <div>
                            <h4 className="">#myanmar</h4>
                            <span className="text-sm text-gray-400">
                                20.9K posts
                            </span>
                        </div>
                    </div>
                </div> */}

                <hr />

                <div>
                    <div className="flex justify-center space-x-4">
                        <a
                            href="/about"
                            className="text-xs text-gray-900 underline hover:text-gray-800"
                        >
                            About
                        </a>
                        <a
                            href="/help"
                            className="text-xs text-gray-900 underline hover:text-gray-800"
                        >
                            Help
                        </a>
                        <a
                            href="/terms"
                            className="text-xs text-gray-900 underline hover:text-gray-800"
                        >
                            Terms
                        </a>
                        <a
                            href="/terms"
                            className="text-xs text-gray-900 underline hover:text-gray-800"
                        >
                            Privacy
                        </a>
                    </div>

                    <div className="mt-5 text-center">
                        <p className="text-xs">© 2024 SOCIALSHOT</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Trending;
