/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Temporarily ignore ESLint during builds
  },
}

module.exports = nextConfig
