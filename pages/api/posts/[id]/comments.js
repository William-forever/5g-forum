/**
 * ========================================
 * 帖子评论 API - Supabase 版本
 * ========================================
 */

import { postsDB, commentsDB } from '../../../../lib/supabase';
import { verifyToken, getTokenFromHeader } from '../../../../lib/auth';

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    switch (req.method) {
      case 'GET':
        return getComments(req, res, id);
      case 'POST':
        return createComment(req, res, id);
      default:
        return res.status(405).json({ success: false, message: '方法不允许' });
    }
  } catch (error) {
    console.error('评论API错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

/**
 * 获取评论列表
 */
async function getComments(req, res, postId) {
  try {
    const comments = await commentsDB.getByPostId(postId) || [];

    res.status(200).json({
      success: true,
      comments
    });

  } catch (error) {
    console.error('获取评论错误:', error);
    res.status(500).json({ success: false, message: '获取评论失败' });
  }
}

/**
 * 创建评论
 */
async function createComment(req, res, postId) {
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

    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: '评论内容不能为空'
      });
    }

    // 检查帖子是否存在
    const post = await postsDB.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: '帖子不存在' });
    }

    // 创建评论
    const newComment = await commentsDB.create({
      post_id: postId,
      content: content.trim(),
      author: decoded.username,
      author_id: decoded.userId
    });

    // 更新帖子评论数
    await postsDB.update(postId, {
      comments: (post.comments || 0) + 1
    });

    res.status(201).json({
      success: true,
      message: '评论成功',
      comment: newComment
    });

  } catch (error) {
    console.error('创建评论错误:', error);
    res.status(500).json({ success: false, message: '评论失败' });
  }
}
