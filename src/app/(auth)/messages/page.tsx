'use client';

/* eslint-disable prettier/prettier */
import React from 'react'
import SendbirdApp from '@sendbird/uikit-react/App';
import '@sendbird/uikit-react/dist/index.css';
import dynamic from 'next/dynamic';

const DynamicAppWithNoSSR = dynamic(() => import("../../../components/Chat"), {
    ssr: false,
    loading: () => <p>...</p>
});
const Page = () => {
    return (
        // <div className="grid mx-2 bg-white rounded">
        //     <div className="grid/grid-rows-2 border-t p-0 min-h-full">

        //     </div>
        // </div>
        <DynamicAppWithNoSSR />
    )
}

export default Page;