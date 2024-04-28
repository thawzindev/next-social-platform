'use client';

import * as React from 'react';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import CreatePostModal from '../components/modals/CreatePostModal';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { ClerkProvider } from '@clerk/nextjs';

interface providerProps {
    children?: React.ReactNode;
    props?: unknown;
}

export function Providers({ children, ...props }: providerProps) {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryStreamedHydration>
                {/* <ReactQueryDevtools initialIsOpen={false} /> */}
                <CreatePostModal />
                <Toaster />
                <div className="">{children}</div>
            </ReactQueryStreamedHydration>
        </QueryClientProvider>
    );
}
