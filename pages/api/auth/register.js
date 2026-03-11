/**
 * ========================================
 * 用户注册 API - JSON 版本
 * ========================================
 */

import { usersDB, initSampleData } from '../../../lib/jsondb';
import { hashPassword, generateToken } from '../../../lib/auth';

// 初始化示例数据
initSampleData();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: '方法不允许' });
  }

  try {
    const { username, email, password } = req.body;

    // 验证输入
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '请填写所有字段' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: '密码至少6位' 
      });
    }

    // 检查用户是否存在
    const existingUser = usersDB.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名已存在' 
      });
    }

    const existingEmail = usersDB.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ 
        success: false, 
        message: '邮箱已被注册' 
      });
    }

    // 创建用户
    const hashedPassword = await hashPassword(password);
    const newUser = usersDB.create({
      username,
      email,
      password: hashedPassword,
      points: 0,
      role: 'user'
    });

    // 生成 Token
    const token = generateToken({
      userId: newUser.id,
      username: newUser.username,
      role: newUser.role
    });

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: { 
        userId: newUser.id, 
        username: newUser.username, 
        email: newUser.email 
      },
      token
    });

  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}
