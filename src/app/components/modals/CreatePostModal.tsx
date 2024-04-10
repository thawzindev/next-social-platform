'use client';

import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import Modal from './Modal';
import useCreatePostModal from '@/app/hooks/useCreatePostModal';
import { RadioGroup } from '@headlessui/react';
import { cn } from '@/app/lib/utils';
import ImageUpload from '../inputs/ImageUpload';
import Heading from '../elements/Heading';
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

const privacyOptions = [
    { name: 'PUBLIC', value: 'PUBLIC' },
    { name: 'FRIENDS', inStock: 'FRIENDS' },
    { name: 'ONLY ME', inStock: 'ONLYME' },
];

const CreatePostModal = () => {
    const createPostModal = useCreatePostModal();
    const [isLoading, setIsLoading] = useState(false);

    const [privacy, setPrivacy] = useState(privacyOptions[0]);
    const [text, setText] = useState('');
    const [file, setFile] = useState('');

    const queryClient = useQueryClient();
    const router = useRouter();

    const mutation = useMutation({
        mutationKey: ['add-post'],
        mutationFn: (formData: object) => {
            return axios.post('/api/posts', formData);
        },
        onSuccess: () => {
            toast.success('Success!');
            createPostModal.onClose();
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            setIsLoading(false);

            router.push(
                `/feed?uid=${Math.random()
                    .toString(36)
                    .substring(2, 2 + length)}`,
            );
        },
        onError: (error) => {
            toast.error(error.message);
            setIsLoading(false);
        },
    });

    const handleSubmit = () => {
        setIsLoading(true);

        const data = {
            content: text,
            file,
            privacy: privacy.value,
        };

        mutation.mutate(data);

        console.log('post data', data);
    };

    const onToggle = useCallback(() => {
        createPostModal.onClose();
    }, [createPostModal]);

    const handleFileChangeEvent = (id: any) => {
        setFile(id);
    };

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="What is on your mind?" subtitle="" />

            <div className="w-full">
                <Select className="w-full">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Privacy" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Select Privacy</SelectLabel>
                            {privacyOptions.map((option) => {
                                return (
                                    <SelectItem
                                        key={option.value}
                                        onClick={() => setPrivacy(option)}
                                        value={option.value}
                                        selected={
                                            privacy.value === option.value
                                        }
                                    >
                                        {option.name}
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <Textarea
                placeholder="Enter your thoughs here ..."
                rows={2}
                onChange={(e) => setText(e.target.value)}
            />
            <ImageUpload onFileChange={handleFileChangeEvent} />
        </div>
    );

    return (
        <Modal
            disabled={isLoading}
            isOpen={createPostModal.isOpen}
            title="Create Post"
            actionLabel="Post"
            onClose={createPostModal.onClose}
            onSubmit={() => handleSubmit()}
            body={bodyContent}
        />
    );
};

export default CreatePostModal;
