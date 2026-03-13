/**
 * ========================================
 * 定时任务 API - 更新排行榜
 * ========================================
 * @description 每小时自动更新用户积分排行榜
 * @date 2026-03-13
 * @version 1.0.0
 */

const { pointsDB } = require('../../../lib/supabase');

// 缓存上次执行时间，防止重复执行
let lastExecutionTime = 0;
const MIN_EXECUTION_INTERVAL = 55 * 60 * 1000; // 55分钟，防止重复执行

export default async function handler(req, res) {
  try {
    // 验证请求（简单的API密钥验证）
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    const validApiKey = process.env.CRON_API_KEY || 'forum-cron-secret-key';
    
    if (apiKey !== validApiKey) {
      return res.status(401).json({ 
        success: false, 
        message: '无效的API密钥',
        timestamp: new Date().toISOString()
      });
    }
    
    // 检查执行间隔
    const now = Date.now();
    if (now - lastExecutionTime < MIN_EXECUTION_INTERVAL) {
      return res.status(429).json({
        success: false,
        message: '执行过于频繁，请稍后再试',
        last_execution: new Date(lastExecutionTime).toISOString(),
        next_available: new Date(lastExecutionTime + MIN_EXECUTION_INTERVAL).toISOString()
      });
    }
    
    switch (req.method) {
      case 'GET':
      case 'POST':
        return updateRankings(req, res);
      default:
        return res.status(405).json({ success: false, message: '方法不允许' });
    }
  } catch (error) {
    console.error('定时任务API错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * 更新排行榜
 */
async function updateRankings(req, res) {
  try {
    console.log('开始执行定时任务：更新用户积分排行榜...');
    
    // 更新执行时间
    lastExecutionTime = Date.now();
    
    // 执行积分更新
    const result = await pointsDB.updateAllUsersPoints();
    
    console.log('定时任务执行完成:', result.message);
    
    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        updated_users: result.topUsers?.length || 0,
        top_users: result.topUsers?.slice(0, 5).map((user, index) => ({
          rank: index + 1,
          username: user.username,
          points: user.points || 0
        })),
        execution_time: new Date().toISOString(),
        next_execution: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1小时后
      }
    });
    
  } catch (error) {
    console.error('更新排行榜失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '更新排行榜失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      execution_time: new Date().toISOString()
    });
  }
}

// 用于外部调用的辅助函数
export async function updateRankingsTask() {
  try {
    const now = Date.now();
    if (now - lastExecutionTime < MIN_EXECUTION_INTERVAL) {
      console.log('跳过执行，距离上次执行时间太近');
      return { skipped: true, lastExecutionTime: new Date(lastExecutionTime).toISOString() };
    }
    
    lastExecutionTime = now;
    const result = await pointsDB.updateAllUsersPoints();
    
    return {
      success: true,
      ...result,
      execution_time: new Date().toISOString()
    };
  } catch (error) {
    console.error('定时任务执行失败:', error);
    return {
      success: false,
      error: error.message,
      execution_time: new Date().toISOString()
    };
  }
}