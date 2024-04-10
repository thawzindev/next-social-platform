/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'res.cloudinary.com',
            'img.clerk.com',
            'cdn2.vectorstock.com',
        ],
    },

    async redirects() {
        return [
            // Basic redirect
            {
                source: '/',
                destination: '/feed',
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
