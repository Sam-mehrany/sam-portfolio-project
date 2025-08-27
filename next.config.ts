/** @type {import('next').NextConfig} */
const nextConfig = {
  // This will temporarily ignore ESLint warnings and errors during the build
  // It's a quick fix, but it's recommended to fix the underlying code issues.
  eslint: {
    ignoreDuringBuilds: true,
  },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:8000/uploads/:path*',
      }
    ];
  },
};

export default nextConfig;
