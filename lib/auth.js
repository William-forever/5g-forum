/**
 * ========================================
 * 认证工具模块
 * ========================================
 * @description JWT 认证和密码加密相关功能
 * @date 2026-03-10
 * @version 1.0.0
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * 密码加密
 * @param {string} password - 明文密码
 * @returns {Promise<string>} - 加密后的密码
 */
export async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * 验证密码
 * @param {string} password - 明文密码
 * @param {string} hashedPassword - 加密后的密码
 * @returns {Promise<boolean>} - 是否匹配
 */
export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * 生成 JWT Token
 * @param {Object} payload - 要编码的数据
 * @returns {string} - JWT Token
 */
export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * 验证 JWT Token
 * @param {string} token - JWT Token
 * @returns {Object|null} - 解码后的数据或 null
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * 从请求头中获取 Token
 * @param {Object} req - HTTP 请求对象
 * @returns {string|null} - Token 或 null
 */
export function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}
