/**
 * ========================================
 * 测试用户种子脚本
 * ========================================
 * 向数据库中添加测试用户
 */

import { supabase } from '../lib/supabase';
import { hashPassword } from '../lib/auth';

async function seedTestUser() {
  try {
    console.log('开始添加测试用户...');

    // 测试用户数据
    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: '123456', // 明文密码
      points: 100,
      role: 'user'
    };

    // 检查用户是否已存在
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('username', testUser.username)
      .single();

    if (existingUser) {
      console.log('测试用户已存在:', existingUser.username);
      return;
    }

    // 加密密码
    const hashedPassword = await hashPassword(testUser.password);

    // 创建用户
    const { data, error } = await supabase
      .from('users')
      .insert([{
        username: testUser.username,
        email: testUser.email,
        password: hashedPassword,
        points: testUser.points,
        role: testUser.role
      }])
      .select()
      .single();

    if (error) {
      console.error('添加用户失败:', error);
      return;
    }

    console.log('测试用户添加成功:', data.username);
    console.log('登录信息:');
    console.log('用户名:', testUser.username);
    console.log('密码:', testUser.password);
    console.log('邮箱:', testUser.email);

  } catch (error) {
    console.error('脚本执行错误:', error);
  }
}

// 运行脚本
seedTestUser();
