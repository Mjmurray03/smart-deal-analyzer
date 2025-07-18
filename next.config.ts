import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable problematic features for OneDrive/Windows compatibility
  images: {
    unoptimized: true, // Prevents image optimization issues on OneDrive
  },
  // Disable static export markers that cause readlink issues
  trailingSlash: false,
  // Improve file system compatibility
  // Enhanced webpack configuration for Windows/OneDrive
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        // Ignore OneDrive sync files and .next directory issues
        ignored: /node_modules|\.next/,
      };
    }
    
    // Resolve symlink issues on Windows
    config.resolve.symlinks = false;
    
    // Add webpack fallbacks for OneDrive compatibility
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      crypto: false,
    };
    
    // Handle file system case sensitivity
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    return config;
  },
  // Optimize for OneDrive sync
  generateBuildId: async () => {
    // Use timestamp instead of git hash to avoid OneDrive sync issues
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
