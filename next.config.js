/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: Removed 'output: export' to enable API routes for AI features
  // Vercel will use serverless functions instead of static export

  // Image optimization
  images: {
    unoptimized: true,
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
