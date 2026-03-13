/**
 * ========================================
 * 一次性更新排行榜脚本
 * ========================================
 * @description 手动更新用户积分排行榜
 * @date 2026-03-13
 * @version 1.0.0
 */

const { pointsDB } = require('../lib/supabase');

async function updateRankingsOnce() {
  console.log('🎯 开始更新用户积分排行榜...');
  console.log('='.repeat(50));
  
  try {
    const startTime = Date.now();
    
    // 执行更新
    const result = await pointsDB.updateAllUsersPoints();
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`✅ ${result.message}`);
    console.log(`⏱️ 执行时间: ${duration.toFixed(2)} 秒`);
    console.log('');
    
    // 显示排行榜
    if (result.topUsers && result.topUsers.length > 0) {
      console.log('🏆 当前积分排行榜 TOP 10:');
      console.log('='.repeat(50));
      
      result.topUsers.forEach((user, index) => {
        const rank = index + 1;
        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
        const points = user.points || 0;
        
        console.log(`${medal} ${user.username.padEnd(15)} - ${points.toString().padStart(6)} 积分`);
      });
      
      console.log('='.repeat(50));
    }
    
    // 显示积分规则
    console.log('');
    console.log('📊 积分计算规则:');
    console.log('- 发帖: +10分');
    console.log('- 帖子被点赞: +2分/次');
    console.log('- 帖子被收藏: +2分/次');
    console.log('- 评论: +1分');
    console.log('- 点赞他人: +0.5分/次');
    console.log('- 收藏他人: +0.5分/次');
    
    console.log('');
    console.log('⏰ 下次自动更新时间: 1小时后');
    console.log('📅 执行时间:', new Date().toISOString());
    
  } catch (error) {
    console.error('❌ 更新排行榜失败:', error.message);
    process.exit(1);
  }
}

// 执行
if (require.main === module) {
  updateRankingsOnce()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ 脚本执行失败:', error);
      process.exit(1);
    });
}

module.exports = updateRankingsOnce;