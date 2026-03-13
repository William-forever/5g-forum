import '../styles/globals.css'
import { useEffect } from 'react'

// 仅在服务端初始化定时任务
if (typeof window === 'undefined') {
  try {
    const cronModule = require('../lib/cron-init');
    cronModule.initCron();
  } catch (error) {
    console.error('定时任务初始化失败:', error);
  }
}

export default function App({ Component, pageProps }) {
  // 客户端初始化效果
  useEffect(() => {
    // 客户端可以在这里初始化一些状态或获取初始数据
    console.log('客户端应用启动');
  }, []);
  
  return <Component {...pageProps} />
}
