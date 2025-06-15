
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
  allowedDevOrigins: ['https://9003-firebase-studio-1749490048431.cluster-duylic2g3fbzerqpzxxbw6helm.cloudworkstations.dev'],
  webpack: (config, { isServer }) => {
    // This configuration helps prevent "Module not found" errors for Node.js
    // core modules like 'child_process', 'fs', 'os', etc., when they are
    // inadvertently imported by client-side code (often via dependencies).
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback, // Preserve any existing fallbacks
        child_process: false, // Indicates 'child_process' is not available
        fs: false,            // Indicates 'fs' is not available
        os: false,             // Indicates 'os' is not available
        net: false,            // Indicates 'net' is not available
        tls: false,            // Indicates 'tls' is not available
      };
    }
    return config;
  },
};

export default nextConfig;
