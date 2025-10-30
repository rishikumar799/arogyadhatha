
import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // experimental: {
  //   // Add the following line to enable the Node.js runtime for middleware
  //   unstable_allowDynamic: ['**/node_modules/google-logging-utils/**'],
  // },
};

export default nextConfig;
