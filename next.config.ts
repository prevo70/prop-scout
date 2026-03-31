import type { NextConfig } from "next";

const rootDir = process.cwd();

const nextConfig: NextConfig = {
  outputFileTracingRoot: rootDir,
  turbopack: {
    root: rootDir,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.domain.com.au" },
      { protocol: "https", hostname: "bucket-api.domain.com.au" },
      { protocol: "https", hostname: "rimh2.domainstatic.com.au" },
      { protocol: "https", hostname: "ayre.com.au" },
    ],
  },
};

export default nextConfig;
