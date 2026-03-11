/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片优化配置
  images: {
    unoptimized: true
  },
  
  // 环境变量
  env: {
    JWT_SECRET: process.env.JWT_SECRET
  },
  
  // 静态导出配置
  output: 'export',
  
  // 重写规则
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*'
      }
    ];
  }
};

export default nextConfig;
