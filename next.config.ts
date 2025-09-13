import type { NextConfig } from "next";

module.exports = {
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  },
};

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
