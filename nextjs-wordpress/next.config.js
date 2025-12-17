/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: process.env.NODE_ENV === 'development', // Disable optimization in development
    remotePatterns: [
      // Local development - specific paths
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/moreyeahs-new/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '*.localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      // Development environment
      {
        protocol: 'https',
        hostname: 'dev.moreyeahs.com',
      },
      // Staging environment
      {
        protocol: 'https',
        hostname: 'staging.moreyeahs.com',
      },
      // Production environment
      {
        protocol: 'https',
        hostname: 'moreyeahs.com',
      },
      {
        protocol: 'https',
        hostname: 'www.moreyeahs.com',
      },
      // WordPress.com hosted sites
      {
        protocol: 'https',
        hostname: '**.wordpress.com',
      },
      // Placeholder service
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      // Generic patterns for flexibility
      {
        protocol: 'https',
        hostname: '**.com',
      },
      {
        protocol: 'https',
        hostname: '**.org',
      },
      {
        protocol: 'https',
        hostname: '**.net',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  swcMinify: true,
}

module.exports = nextConfig
