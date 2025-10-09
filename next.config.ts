import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable strict mode for better development experience
  reactStrictMode: true,
  
  // TypeScript configuration
  typescript: {
    // Don't ignore build errors in production
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    // Don't ignore ESLint errors in production
    ignoreDuringBuilds: false,
  },
  
  // Experimental features
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ['lucide-react'],
  },
  
  // Compression
  compress: true,
  
  // Images configuration
  images: {
    formats: ['image/webp', 'image/avif'],
  },
  
  // PWA configuration
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Enable static generation for better performance
  output: 'standalone',
  
  // Generate source maps for better debugging
  productionBrowserSourceMaps: false,
  
  // Environment variables that should be available to the client
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
