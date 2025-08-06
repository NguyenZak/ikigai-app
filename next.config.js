/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export configuration
  // output: 'export',
  // trailingSlash: true,
  images: {
    unoptimized: true
  },
  experimental: {
    optimizeCss: false
  },
  // Configure dynamic routes to reduce warnings
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate'
          }
        ]
      }
    ]
  }
  // Remove rewrites that are incompatible with API routes
  // async rewrites() {
  //   return []
  // }
}

module.exports = nextConfig 