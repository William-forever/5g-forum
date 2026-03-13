/**
 * ========================================
 * 用户排行榜 API
 * ========================================
 * @description 获取用户积分排行榜
 * @date 2026-03-13
 * @version 1.0.0
 */

const { pointsDB } = require('../../../lib/supabase');

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        return getRankings(req, res);
      case 'POST':
        return forceUpdateRankings(req, res);
      default:
        return res.status(405).json({ success: false, message: '方法不允许' });
    }
  } catch (error) {
    console.error('排行榜API错误:', error);
    res.status(500).json({ 
      success: false, 
      message: '服务器错误',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * 获取排行榜
 */
async function getRankings(req, res) {
  try {
    const { limit = 10, force_update = false } = req.query;
    
    // 如果强制更新，重新计算所有用户的积分
    if (force_update === 'true') {
      try {
        const updateResult = await pointsDB.updateAllUsersPoints();
        console.log('强制更新排行榜完成:', updateResult.message);
      } catch (updateError) {
        console.error('强制更新排行榜失败:', updateError);
        // 不返回错误，继续获取现有的排行榜
      }
    }
    
    // 获取排行榜数据
    const rankings = await pointsDB.getTopUsers(parseInt(limit));
    
    // 格式化返回数据
    const formattedRankings = rankings.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      username: user.username,
      points: user.points || 0,
      avatar: user.avatar || null,
      isTop3: index < 3
    }));
    
    res.status(200).json({
      success: true,
      data: formattedRankings,
      meta: {
        count: formattedRankings.length,
        timestamp: new Date().toISOString(),
        next_update: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1小时后
      }
    });
    
  } catch (error) {
    console.error('获取排行榜失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取排行榜失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

/**
 * 强制更新排行榜（需要管理员权限）
 */
async function forceUpdateRankings(req, res) {
  try {
    // 检查管理员权限（这里简化处理，实际项目中需要验证token）
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: '需要管理员权限' });
    }
    
    // 执行更新
    const result = await pointsDB.updateAllUsersPoints();
    
    res.status(200).json({
      success: true,
      message: result.message,
      topUsers: result.topUsers?.map((user, index) => ({
        rank: index + 1,
        username: user.username,
        points: user.points || 0
      })),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('强制更新排行榜失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '更新排行榜失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}