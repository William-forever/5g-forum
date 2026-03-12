/** @type {import('next').NextConfig} */
const nextConfig = {
  // 图片优化配置
  images: {
    unoptimized: true
  },
  
  // 环境变量
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
};

export default nextConfig;
