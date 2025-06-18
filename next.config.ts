
import type { NextConfig } from 'next';

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
    ],
  },
  allowedDevOrigins:
    process.env.ALLOWED_DEV_ORIGINS?.split(',') ?? [
      'http://localhost:9003',
      'https://*.cloudworkstations.dev',
    ],
};

export default nextConfig;
