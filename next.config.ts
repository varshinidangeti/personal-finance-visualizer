import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Remove the experimental turbo option as it's causing type errors
  async redirects() {
    return [];
  },
};

export default nextConfig;
