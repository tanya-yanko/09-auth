import type { NextConfig } from 'next';

import type { Configuration as WebpackConfiguration } from 'webpack';
import path from 'path';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ac.goit.global',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack(config: WebpackConfiguration) {
    const { resolve = {} } = config;
    config.resolve = {
      ...resolve,
      alias: {
        ...(resolve.alias as Record<string, string>),
        '@': path.resolve(__dirname),
      },
    };
    return config;
  },
};

export default nextConfig;