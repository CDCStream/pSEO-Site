/** @type {import('next').NextConfig} */
const nextConfig = {
  // Note: Removed 'output: export' to enable API routes for AI features
  // Vercel will use serverless functions instead of static export

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  trailingSlash: true,

  async redirects() {
    return [
      {
        source: '/tools/cursive-text-generator/',
        destination: '/tools/cursed-text-generator/',
        permanent: true,
      },
      {
        source: '/tools/fancy-text-generator/',
        destination: '/tools/glitch-text-generator/',
        permanent: true,
      },
    ];
  },

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
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
};

module.exports = nextConfig;
