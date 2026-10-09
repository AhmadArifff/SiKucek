/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@sikucek/shared', '@sikucek/ui'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
