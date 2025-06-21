
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co', // Changed from ibb.co to i.ibb.co
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'just4u.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'prestogifts.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
