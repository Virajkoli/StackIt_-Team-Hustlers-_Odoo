/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["lucide-react"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
    // Improve build performance
    webpackBuildWorker: true,
  },
  // Move turbo to top level as it's now stable
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  // Reduce bundle size
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // Improve performance
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
};

export default nextConfig;
