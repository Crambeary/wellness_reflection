import { NextConfig } from 'next';

/** @type {NextConfig} */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config: NextConfig) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
}

export default nextConfig
