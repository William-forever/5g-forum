/**
 * ========================================
 * 单个帖子详情 API - Supabase 版本
 * ========================================
 */

import { postsDB, commentsDB } from '../../../lib/supabase';

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    switch (req.method) {
      case 'GET':
        return getPost(req, res, id);
      default:
        return res.status(405).json({ success: false, message: '方法不允许' });
    }
  } catch (error) {
    console.error('帖子详情API错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

/**
 * 获取单个帖子详情
 */
async function getPost(req, res, id) {
  try {
    const post = await postsDB.findById(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: '帖子不存在'
      });
    }

    // 增加浏览量
    await postsDB.incrementViews(id);

    // 获取评论
    const comments = await commentsDB.getByPostId(id) || [];

    res.status(200).json({
      success: true,
      post: {
        ...post,
        views: (post.views || 0) + 1,
        likes: post.likes || 0,
        comments: post.comments || 0
      },
      comments
    });

  } catch (error) {
    console.error('获取帖子详情错误:', error);
    res.status(500).json({ success: false, message: '获取帖子详情失败' });
  }
}
