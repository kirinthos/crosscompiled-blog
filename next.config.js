/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Remove basePath and assetPrefix for direct S3 hosting
  // Add them back if you need to host in a subdirectory

  // Enhanced development experience
  experimental: {
    // Enable faster refresh for markdown changes
    optimizePackageImports: ["@/lib/markdown"],
  },

  // Watch for changes in posts directory during development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Watch markdown files for changes
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ["**/node_modules", "**/.git", "**/.next"],
        // Poll for changes in posts directory
        poll: 1000,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
