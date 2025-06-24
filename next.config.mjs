import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // typescript: {
  //   ignoreBuildErrors: true,
  // },
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
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

  allowedDevOrigins: [
    'https://9003-firebase-studio-1749490048431.cluster-duylic2g3fbzerqpzxxbw6helm.cloudworkstations.dev',
    'https://3000-firebase-studio-1749490048431.cluster-duylic2g3fbzerqpzxxbw6helm.cloudworkstations.dev',
    'https://3000-firebase-thalamus-1749490048431.cluster-duylic2g3fbzerqpzxxbw6helm.cloudworkstations.dev',
    'https://3000-firebase-thalamus-20-1750567551083.cluster-etsqrqvqyvd4erxx7qq32imrjk.cloudworkstations.dev',
  ],
};

export default process.env.ANALYZE === 'true'
  ? withBundleAnalyzer(nextConfig)
  : nextConfig;
