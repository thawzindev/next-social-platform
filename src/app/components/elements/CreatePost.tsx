'use client';

import useCreatePostModal from '@/app/hooks/useCreatePostModal';
import { PencilIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import react from 'react';

const CreatePost = () => {
    // const createPostModal = useCreatePostModal();

    const router = useRouter();

    return (
        <>
            <div className="mb-4 flex items-center space-x-2 rounded-md bg-[#FFFFFF] p-2 hover:bg-gray-200">
                <PencilIcon className="mx-2 h-5 w-5" />
                {/* <input
                    placeholder="What's on your mind, Thaw?"
                    className="flex-1 border-none bg-transparent placeholder-gray-400 focus:ring-0"
                    type="text"
                    onKeyDownCapture={(event) => {
                        createPostModal.onOpen();
                    }}
                /> */}
                <button
                    className="flex-1 border-none bg-transparent placeholder-gray-400 focus:ring-0"
                    onClick={() => router.push('/feed/create')}
                >
                    What&apos;s on your mind?
                </button>
            </div>
        </>
    );
};

export default CreatePost;
