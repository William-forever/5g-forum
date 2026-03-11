/**
 * ========================================
 * 删除帖子 API
 * ========================================
 */

import { postsDB } from '../../../../lib/supabase';
import { verifyToken, getTokenFromHeader } from '../../../../lib/auth';

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    switch (req.method) {
      case 'DELETE':
        return deletePost(req, res, id);
      default:
        return res.status(405).json({ success: false, message: '方法不允许' });
    }
  } catch (error) {
    console.error('删除帖子API错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

/**
 * 删除帖子
 */
async function deletePost(req, res, id) {
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

    // 获取帖子信息
    const post = await postsDB.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: '帖子不存在' });
    }

    // 验证是否是作者或管理员
    if (post.author_id !== decoded.userId && decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: '无权删除此帖子' });
    }

    // 删除帖子
    await postsDB.delete(id);

    res.status(200).json({
      success: true,
      message: '删除成功'
    });

  } catch (error) {
    console.error('删除帖子错误:', error);
    res.status(500).json({ success: false, message: '删除失败' });
  }
}
