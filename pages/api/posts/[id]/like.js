/**
 * ========================================
 * 帖子点赞 API - Supabase 版本
 * ========================================
 */

import { postsDB } from '../../../../lib/supabase';
import { verifyToken, getTokenFromHeader } from '../../../../lib/auth';

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    switch (req.method) {
      case 'POST':
        return likePost(req, res, id);
      default:
        return res.status(405).json({ success: false, message: '方法不允许' });
    }
  } catch (error) {
    console.error('点赞API错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

/**
 * 点赞帖子
 */
async function likePost(req, res, id) {
  try {
    // 验证登录
    const token = getTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ success: false, message: '请先登录' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ success: false, message: '登录已过期' });
    }

    const post = await postsDB.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: '帖子不存在' });
    }

    // 增加点赞数
    const updatedPost = await postsDB.incrementLikes(id);

    res.status(200).json({
      success: true,
      message: '点赞成功',
      likes: updatedPost.likes
    });

  } catch (error) {
    console.error('点赞错误:', error);
    res.status(500).json({ success: false, message: '点赞失败' });
  }
}
