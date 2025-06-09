
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
    ],
  },
  experimental: {
    allowedDevOrigins: [
        "6000-firebase-studio-1749420368814.cluster-kc2r6y3mtba5mswcmol45orivs.cloudworkstations.dev",
        // You might want to add http://localhost:6000 if you access it that way sometimes
    ],
  }
};

export default nextConfig;
