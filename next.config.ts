import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      // Keep existing patterns if any

      {
        protocol: "https",
        hostname: "cdn.builder.io", // Keep existing if needed
        pathname: "**",
      },
      {
        protocol: "https",
        // Replace 'your_cloud_name' with your actual Cloudinary cloud name
        hostname: "res.cloudinary.com",
        pathname: `/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/**`, // More specific path
      },
      // Add other domains if needed (e.g., Google user images)
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
