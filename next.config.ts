import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    turbo: true,  // ✅ Enable Turbopack officially
  },
  async redirects() {
    return [];
  },
};

export default nextConfig;
