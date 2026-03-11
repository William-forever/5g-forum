/**
 * ========================================
 * 检查帖子数据脚本
 * ========================================
 * 检查Supabase数据库中的帖子数据
 */

import { supabase } from '../lib/supabase';

async function checkPosts() {
  try {
    console.log('开始检查帖子数据...');

    // 查询所有帖子
    const { data, error, count } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('查询帖子失败:', error);
      return;
    }

    console.log(`共找到 ${count || 0} 个帖子`);
    console.log('帖子数据:', data);

    // 检查帖子结构
    if (data && data.length > 0) {
      console.log('第一个帖子的结构:', Object.keys(data[0]));
    }

  } catch (error) {
    console.error('脚本执行错误:', error);
  }
}

// 运行脚本
checkPosts();
