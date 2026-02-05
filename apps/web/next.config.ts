import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@portfolio/ui", "@portfolio/theme", "@portfolio/content"]
};

export default nextConfig;
