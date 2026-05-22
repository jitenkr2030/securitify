import type { NextConfig } from "next";

// Map Neon integration variables to standard names
if (!process.env.DATABASE_URL && process.env.storage_POSTGRES_URL) {
  process.env.DATABASE_URL = process.env.storage_POSTGRES_URL;
}
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = "securitify-production-secret-jiten2024";
}
if (!process.env.NEXTAUTH_URL && process.env.VERCEL_URL) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
} else if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = "https://securitifyapp.vercel.app";
}

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
