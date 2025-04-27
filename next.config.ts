import type { NextConfig } from 'next';

// Fixed configuration for Vercel deployment
const nextConfig: NextConfig = {
  // No experimental options - they were causing type errors
  async redirects() {
    return [];
  },
};

export default nextConfig;
