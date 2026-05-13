import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: true, optimizePackageImports: ["lucide-react", "@mediapipe/tasks-vision"] },
  transpilePackages: ["@ui", "@lib", "@content"],
  eslint: { ignoreDuringBuilds: true },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },
};

export default config;
