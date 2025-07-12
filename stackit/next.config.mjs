/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization
  swcMinify: true,
  
  // Optimize images
  images: {
    domains: ['res.cloudinary.com'],
    formats: ['image/webp', 'image/avif'],
  },

  // Optimize for performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
    // Improve build performance
    webpackBuildWorker: true,
  },

  // Compression
  compress: true,

  // Optimize for development and production
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Reduce compilation in development
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      };
    }
    return config;
  },

  // Headers for better caching
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=10, stale-while-revalidate=59' }
        ],
      },
    ]
  },
};

export default nextConfig;
