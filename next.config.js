/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',

  // Image optimization
  images: {
    unoptimized: true, // Required for static export
  },

  trailingSlash: true,

  // Performance optimizations
  poweredByHeader: false,

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Experimental performance features
  experimental: {
    optimizeCss: true,
  },
};

module.exports = nextConfig;
