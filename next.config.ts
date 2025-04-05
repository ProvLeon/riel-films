import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.builder.io",
        pathname: "**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
