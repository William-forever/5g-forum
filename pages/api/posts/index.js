/**
 * ========================================
 * 帖子 API - Supabase 版本
 * ========================================
 */

import { postsDB } from '../../../lib/supabase';
import { verifyToken, getTokenFromHeader } from '../../../lib/auth';

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'GET':
        return getPosts(req, res);
      case 'POST':
        return createPost(req, res);
      default:
        return res.status(405).json({ success: false, message: '方法不允许' });
    }
  } catch (error) {
    console.error('帖子API错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

/**
 * 获取帖子列表
 */
async function getPosts(req, res) {
  try {
    const { page = 1, limit = 10, category } = req.query;

    const result = await postsDB.getPage(
      parseInt(page),
      parseInt(limit),
      category || null
    );

    res.status(200).json({
      success: true,
      posts: result.posts,
      pagination: result.pagination
    });

  } catch (error) {
    console.error('获取帖子列表错误:', error);
    res.status(500).json({ success: false, message: '获取帖子列表失败' });
  }
}

/**
 * 创建帖子
 */
async function createPost(req, res) {
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

    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: '标题和内容不能为空'
      });
    }

    // 创建帖子
    const newPost = await postsDB.create({
      title,
      content,
      category: category || '其他',
      author: decoded.username,
      author_id: decoded.userId
    });

    res.status(201).json({
      success: true,
      message: '发布成功',
      post: newPost
    });

  } catch (error) {
    console.error('创建帖子错误:', error);
    res.status(500).json({ success: false, message: '发布失败' });
  }
}
