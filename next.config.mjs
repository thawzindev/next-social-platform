/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['res.cloudinary.com', 'img.clerk.com'],
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
