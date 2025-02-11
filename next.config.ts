import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // TODO: Remove this because it should not be used for production, only being used for components from shadcn checking
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
