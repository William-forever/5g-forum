/**
 * ========================================
 * 定时任务初始化模块
 * ========================================
 * @description 在服务器启动时初始化定时任务
 * @date 2026-03-13
 * @version 1.0.0
 */

// 仅在服务端执行
if (typeof window === 'undefined') {
  const cron = require('node-cron');
  const { pointsDB } = require('./supabase');
  
  // 定时任务配置
  const cronConfig = {
    // 每小时的第0分钟执行（每小时一次）
    schedule: '0 * * * *',
    // 测试模式：每分钟执行一次
    testSchedule: '* * * * *',
    timezone: 'Asia/Shanghai'
  };
  
  // 是否启用定时任务
  const enableCron = process.env.ENABLE_CRON !== 'false';
  
  // 是否是测试模式
  const isTestMode = process.env.NODE_ENV === 'development' || process.env.CRON_TEST_MODE === 'true';
  
  // 记录日志
  function logCron(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌ [CRON]' : type === 'warning' ? '⚠️ [CRON]' : '✅ [CRON]';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }
  
  // 更新排行榜任务
  async function updateRankingsTask() {
    try {
      logCron('开始执行定时任务：更新用户积分排行榜...');
      
      const startTime = Date.now();
      const result = await pointsDB.updateAllUsersPoints();
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000;
      
      if (result.success) {
        logCron(`定时任务执行成功: ${result.message} (耗时: ${duration.toFixed(2)}秒)`);
        
        // 显示前5名
        if (result.topUsers && result.topUsers.length > 0) {
          const top5 = result.topUsers.slice(0, 5);
          logCron('当前排行榜 TOP 5:');
          top5.forEach((user, index) => {
            const rank = index + 1;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
            logCron(`  ${medal} ${user.username} - ${user.points || 0} 积分`);
          });
        }
      } else {
        logCron(`定时任务执行失败: ${result.message}`, 'warning');
      }
      
      return result;
    } catch (error) {
      logCron(`定时任务执行失败: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }
  
  // 初始化定时任务
  function initCron() {
    if (!enableCron) {
      logCron('定时任务已禁用', 'warning');
      return;
    }
    
    const schedule = isTestMode ? cronConfig.testSchedule : cronConfig.schedule;
    const scheduleDesc = isTestMode ? '每分钟' : '每小时';
    
    logCron(`初始化定时任务 (${scheduleDesc}执行)`);
    logCron(`执行时间表达式: ${schedule}`);
    logCron(`时区: ${cronConfig.timezone}`);
    
    // 设置定时任务
    const task = cron.schedule(schedule, async () => {
      await updateRankingsTask();
    }, {
      scheduled: true,
      timezone: cronConfig.timezone
    });
    
    // 立即执行一次（延迟5秒，等待服务器完全启动）
    setTimeout(async () => {
      logCron('服务器启动，立即执行一次定时任务...');
      await updateRankingsTask();
    }, 5000);
    
    // 处理进程退出
    process.on('SIGINT', () => {
      logCron('收到退出信号，停止定时任务...');
      task.stop();
    });
    
    process.on('SIGTERM', () => {
      logCron('收到终止信号，停止定时任务...');
      task.stop();
    });
    
    logCron('定时任务初始化完成');
    return task;
  }
  
  // 导出
  module.exports = {
    initCron,
    updateRankingsTask,
    cronConfig
  };
  
  // 如果直接运行此文件，则初始化
  if (require.main === module) {
    initCron();
  }
} else {
  // 客户端环境，导出空对象
  module.exports = {
    initCron: () => console.log('定时任务仅在服务端运行'),
    updateRankingsTask: () => Promise.resolve({ success: false, message: '客户端环境' }),
    cronConfig: {}
  };
}