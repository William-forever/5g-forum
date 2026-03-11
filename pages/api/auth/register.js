/**
 * ========================================
 * 用户注册 API - Supabase 版本
 * ========================================
 */

import { usersDB } from '../../../lib/supabase';
import { hashPassword } from '../../../lib/auth';

export default async function handler(req, res) {
  try {
    switch (req.method) {
      case 'POST':
        return register(req, res);
      default:
        return res.status(405).json({ success: false, message: '方法不允许' });
    }
  } catch (error) {
    console.error('注册API错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}

/**
 * 用户注册
 */
async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    // 验证输入
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: '请填写所有必填字段'
      });
    }

    // 验证用户名格式
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      return res.status(400).json({
        success: false,
        message: '用户名只能包含字母、数字和下划线，长度3-20位'
      });
    }

    // 验证邮箱格式
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: '邮箱格式不正确'
      });
    }

    // 验证密码长度
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度至少为6位'
      });
    }

    // 检查用户名是否已存在
    const existingUser = await usersDB.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: '用户名已被注册'
      });
    }

    // 检查邮箱是否已存在
    const existingEmail = await usersDB.findByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: '邮箱已被注册'
      });
    }

    // 加密密码
    const hashedPassword = await hashPassword(password);

    // 创建用户
    const newUser = await usersDB.create({
      username,
      email,
      password: hashedPassword,
      points: 100, // 新用户赠送100积分
      role: 'user'
    });

    res.status(201).json({
      success: true,
      message: '注册成功',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        points: newUser.points,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ success: false, message: '注册失败，请稍后重试' });
  }
}
