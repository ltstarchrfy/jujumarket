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
  // Route each page path to the main SPA page
  async rewrites() {
    return [
      { source: "/download", destination: "/" },
      { source: "/Verifikasi", destination: "/" },
      { source: "/Dashboard", destination: "/" },
      { source: "/verif", destination: "/" },
      { source: "/discord", destination: "/" },
      { source: "/tutorial", destination: "/" },
      { source: "/changelog", destination: "/" },
      { source: "/Buyvip", destination: "/" },
      { source: "/qris", destination: "/" },
    ];
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
