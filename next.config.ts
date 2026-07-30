import type { NextConfig } from "next";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  ...(isProd ? { output: "standalone" as const } : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.resolve(__dirname),
    resolveAlias: {
      "firebase/database": "@firebase/database",
    },
  },
  serverExternalPackages: ["firebase/database", "@firebase/database"],
};

export default nextConfig;
