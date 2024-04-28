'use client';

import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import useCreatePostModal from '@/app/hooks/useCreatePostModal';
import { RadioGroup } from '@headlessui/react';
import { cn } from '@/app/lib/utils';
import { Textarea } from '@/components/textarea';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { create } from 'domain';
import { useRouter } from 'next/navigation';
import Heading from '@/app/components/elements/Heading';
import ImageUpload from '@/app/components/inputs/ImageUpload';
import Modal from '@/app/components/modals/Modal';
import { Label } from '@/components/label';
import { Button } from '@/components/button';
import { createPost } from '@/services/apiService';

const privacyOptions = [
    { name: 'PUBLIC', value: 'PUBLIC' },
    { name: 'ONLY ME', value: 'ONLYME' },
];

const CreatePostModal = () => {
    const createPostModal = useCreatePostModal();
    const [isLoading, setIsLoading] = useState(false);

    const [privacy, setPrivacy] = useState(privacyOptions[0].value);
    const [text, setText] = useState('');
    const [file, setFile] = useState('');

    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation({
        mutationKey: ['add-post'],
        mutationFn: (formData: object) => {
            return createPost(formData)
        },
        onSuccess: () => {
            toast.success('Success!');
            // createPostModal.onClose();

            queryClient.invalidateQueries({ queryKey: ['posts'] });
            setIsLoading(false);

            setTimeout(() => {
                router.push(`/feed`);
            }, 1000);
        },
        onError: (error) => {
            console.log(error)
            toast.error(error.message);
            setIsLoading(false);
        },
    });

    const handleSubmit = () => {
        setIsLoading(true);

        const data = {
            content: text,
            file,
            privacy: privacy,
        };

        mutation.mutate(data);

        console.log('post data', data);
    };

    // const onToggle = useCallback(() => {
    //     createPostModal.onClose();
    // }, [createPostModal]);

    const handleFileChangeEvent = (id: any) => {
        setFile(id);
    };

    return (
        <div className="mx-2 space-y-2 bg-white p-2">
            <div className="flex flex-col gap-2">
                <Heading title="What is on your mind?" subtitle="" />

                <div className="w-full">
                    <Label className="mb-2">Privacy</Label>
                    <Select
                        defaultValue="PUBLIC"
                        onValueChange={(value) => {
                            setPrivacy(value);
                            console.log(privacy);
                        }}
                    >
                        <SelectTrigger className="">
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent>
                            {privacyOptions.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label className="mb-2">Content</Label>
                    <Textarea
                        placeholder="Enter your thoughs here ..."
                        rows={2}
                        required={true}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <div>
                    <Label className="mb-2">File</Label>
                    <ImageUpload onFileChange={handleFileChangeEvent} />
                </div>

                <Button onClick={() => handleSubmit()}>Submit</Button>
            </div>
        </div>
    );
};

export default CreatePostModal;
