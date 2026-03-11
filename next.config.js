/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片优化配置
  images: {
    unoptimized: true
  },
  
  // 环境变量
  env: {
    JWT_SECRET: process.env.JWT_SECRET
  }
};

export default nextConfig;
