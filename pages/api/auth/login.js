/**
 * ========================================
 * 用户登录 API - Supabase 版本
 * ========================================
 */

import { usersDB } from '../../../lib/supabase';
import { verifyPassword, generateToken } from '../../../lib/auth';

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'POST':
        return login(req, res);
      default:
        return res.status(405).json({ success: false, message: '方法不允许' });
    }
  } catch (error) {
    console.error('登录API错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

/**
 * 用户登录
 */
async function login(req, res) {
  try {
    const { username, password } = req.body;

    // 验证输入
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '请填写用户名和密码'
      });
    }

    // 查找用户（支持用户名或邮箱登录）
    let user = await usersDB.findByUsername(username);
    
    // 如果没找到，尝试用邮箱查找
    if (!user && username.includes('@')) {
      user = await usersDB.findByEmail(username);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 验证密码
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      });
    }

    // 生成 JWT Token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      success: true,
      message: '登录成功',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        points: user.points,
        role: user.role
      }
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ success: false, message: '登录失败，请稍后重试' });
  }
}
