import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {},
};

export default withPWA({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        urlPattern: /^https?.*/,
        handler: "NetworkFirst",
        options: {
          cacheName: "offlineCache",
          expiration: {
            maxEntries: 200,
          },
        },
      },
      {
        urlPattern: /\.pdf$/,
        handler: "CacheFirst",
        options: {
          cacheName: "pdfCache",
          expiration: {
            maxEntries: 20,
          },
        },
      },
      {
        urlPattern: /\.mp3$/,
        handler: "CacheFirst",
        options: {
          cacheName: "audioCache",
          expiration: {
            maxEntries: 10,
          },
        },
      },
    ],
  },
})(nextConfig);
