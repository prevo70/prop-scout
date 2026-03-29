import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
