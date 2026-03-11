/**
 * ========================================
 * 用户登录 API - JSON 版本
 * ========================================
 */

import { usersDB, initSampleData } from '../../../lib/jsondb';
import { verifyPassword, generateToken } from '../../../lib/auth';

// 初始化示例数据
initSampleData();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: '方法不允许' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '请填写用户名和密码' 
      });
    }

    // 查找用户（支持用户名或邮箱登录）
    let user = usersDB.findByUsername(username);
    if (!user) {
      user = usersDB.findByEmail(username);
    }

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: '用户名或密码错误' 
      });
    }

    // 验证密码
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        message: '用户名或密码错误' 
      });
    }

    // 生成 Token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role
    });

    res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        userId: user.id,
        username: user.username,
        email: user.email,
        points: user.points,
        role: user.role
      },
      token
    });

  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ success: false, message: '服务器错误' });
  }
}
