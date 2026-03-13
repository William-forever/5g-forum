/**
 * ========================================
 * 定时任务调度器
 * ========================================
 * @description 每小时自动更新用户积分排行榜
 * @date 2026-03-13
 * @version 1.0.0
 */

const http = require('http');
const https = require('https');

// 配置
const config = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
  apiKey: process.env.CRON_API_KEY || 'forum-cron-secret-key',
  // 测试模式：设置为true时，每5分钟执行一次
  testMode: process.env.CRON_TEST_MODE === 'true',
  interval: process.env.CRON_TEST_MODE === 'true' ? 5 * 60 * 1000 : 60 * 60 * 1000, // 5分钟或1小时
};

// 日志函数
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

// 执行定时任务
async function executeCronTask() {
  try {
    const url = `${config.protocol}://${config.host}:${config.port}/api/cron/update-rankings`;
    const options = {
      method: 'POST',
      headers: {
        'X-API-Key': config.apiKey,
        'Content-Type': 'application/json'
      }
    };
    
    log(`开始执行定时任务: ${url}`);
    
    const req = (config.protocol === 'https' ? https : http).request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.success) {
            log(`定时任务执行成功: ${result.message}`);
            console.log('数据详情:', JSON.stringify(result.data, null, 2));
          } else {
            log(`定时任务执行失败: ${result.message}`, 'warning');
          }
        } catch (parseError) {
          log(`解析响应失败: ${parseError.message}`, 'error');
        }
      });
    });
    
    req.on('error', (error) => {
      log(`请求失败: ${error.message}`, 'error');
    });
    
    req.write(JSON.stringify({}));
    req.end();
    
  } catch (error) {
    log(`执行定时任务失败: ${error.message}`, 'error');
  }
}

// 主函数
function main() {
  log(`定时任务调度器启动`);
  log(`配置信息:`, 'info');
  console.log(`- 主机: ${config.host}:${config.port}`);
  console.log(`- 协议: ${config.protocol}`);
  console.log(`- 间隔: ${config.interval / 1000 / 60} 分钟`);
  console.log(`- 测试模式: ${config.testMode ? '是' : '否'}`);
  
  // 立即执行一次
  log('首次执行定时任务...');
  executeCronTask();
  
  // 设置定时器
  const intervalMs = config.interval;
  setInterval(executeCronTask, intervalMs);
  
  log(`已设置定时器，每 ${intervalMs / 1000 / 60} 分钟执行一次`);
  
  // 处理退出
  process.on('SIGINT', () => {
    log('收到退出信号，停止定时任务...');
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    log('收到终止信号，停止定时任务...');
    process.exit(0);
  });
}

// 启动
if (require.main === module) {
  main();
}

// 导出用于外部调用
module.exports = {
  config,
  executeCronTask,
  start: main
};