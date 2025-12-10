/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-domain.com'],
    unoptimized: true, // For static export if needed
  },
  // Enable static export for Vercel deployment
  output: 'export',
  trailingSlash: true,
  // Disable image optimization for static export
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig