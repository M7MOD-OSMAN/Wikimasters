import assert from "node:assert";
import { dirname } from "node:path";
import type { NextConfig } from "next";

assert(process.env.BLOB_READ_WRITE_TOKEN, "you must have defined BLOB_READ_WRITE_TOKEN");
// BLOB_BASE_URL
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },
  turbopack: {
    root: dirname(__filename),
  },
};

export default nextConfig;
  