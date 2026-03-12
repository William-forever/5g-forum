/**
 * ========================================
 * 创建管理员账号脚本
 * ========================================
 * @description 创建管理员用户
 * @date 2026-03-10
 * @version 1.0.0
 */

import { usersDB } from '../lib/supabase.js';
import { hashPassword } from '../lib/auth.js';

async function createAdmin() {
  try {
    const adminData = {
      username: 'admin',
      email: 'admin@5gforum.com',
      password: await hashPassword('admin123456'),
      points: 9999,
      role: 'admin'
    };

    // 检查是否已存在
    const existingUser = await usersDB.findByUsername('admin');
    if (existingUser) {
      console.log('管理员账号已存在');
      return;
    }

    const newAdmin = await usersDB.create(adminData);
    console.log('管理员账号创建成功！');
    console.log('用户名: admin');
    console.log('密码: admin123456');
    console.log('角色: admin');
  } catch (error) {
    console.error('创建管理员失败:', error);
  }
}

createAdmin();
