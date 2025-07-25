import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    unoptimized: true, // 禁用图片优化，直接使用原图
  }
};

export default nextConfig;
