/**
 * ========================================
 * 文章 API - JSON 版本
 * ========================================
 */

import { postsDB, initSampleData } from '../../../lib/jsondb';
import { verifyToken, getTokenFromHeader } from '../../../lib/auth';

// 初始化示例数据
initSampleData();

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
    console.error('文章API错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

/**
 * 获取文章列表
 */
function getPosts(req, res) {
  try {
    const { page = 1, limit = 10, category } = req.query;
    
    const result = postsDB.getPage(
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
    console.error('获取文章列表错误:', error);
    res.status(500).json({ success: false, message: '获取文章列表失败' });
  }
}

/**
 * 创建文章
 */
function createPost(req, res) {
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

    // 创建文章
    const newPost = postsDB.create({
      title,
      content,
      category: category || '其他',
      author: decoded.username,
      authorId: decoded.userId
    });

    res.status(201).json({
      success: true,
      message: '发布成功',
      postId: newPost.id
    });

  } catch (error) {
    console.error('创建文章错误:', error);
    res.status(500).json({ success: false, message: '发布失败' });
  }
}
