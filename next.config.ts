import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Tree-shake Phosphor Icons — avoids importing the entire icon set
    optimizePackageImports: ["@phosphor-icons/react"],
  },
};

export default nextConfig;
