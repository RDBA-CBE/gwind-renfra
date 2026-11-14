/** @type {import('next').NextConfig} */
export default {
    output: 'export',
    images: {
        unoptimized: true,
    },
    turbopack: {
        resolveAlias: {
            '@': './src',
            '@/components/Inner-Banner': './src/components/Inner-Banner.jsx',
            '@/components/Inner-banner': './src/components/Inner-Banner.jsx',
        },
    },
};
