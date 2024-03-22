import { Input } from '@/components/ui/input';
import React from 'react';

const Trending = () => {
    return (
        <>
            <div className="border-1 mt-8 h-fit w-80 space-y-6 rounded rounded-md border bg-[#FFFFFF] p-4">
                {/* <div className="mt-4 flex items-start space-x-2 rounded bg-gray-300 p-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="h-5 w-5"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </svg>
                    <button className="justify-contents-start flex-1 border-none focus:ring-0">
                        Search ...
                    </button>
                </div> */}

                <div className="mt-0">
                    <h3 className="text-sm font-bold">Search</h3>
                    <div className="mt-2 space-y-2">
                        <Input
                            type="text"
                            className="rounded-md focus:outline-none"
                            placeholder="keywords ..."
                        />
                    </div>
                </div>

                <hr />

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
                </div>

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
                        <a
                            href="/terms"
                            className="text-xs text-gray-900 underline hover:text-gray-800"
                        >
                            Jobs
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
