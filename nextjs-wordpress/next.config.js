/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath removed - Next.js runs on its own port (3000)
  // WordPress is at http://localhost/moreyeahs-new
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.wordpress.com',
      },
      {
        protocol: 'https',
        hostname: 'your-wordpress-site.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
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
