import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // 方便 Docker/VPS 用 standalone 方式部署；对 Vercel 也不会造成负面影响
  output: "standalone",
};

export default nextConfig;
