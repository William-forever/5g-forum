/**
 * ========================================
 * MongoDB 连接模块
 * ========================================
 * @description 连接 MongoDB Atlas 数据库
 * @date 2026-03-10
 * @version 1.0.0
 */

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('请在环境变量中添加 MONGODB_URI');
}

if (process.env.NODE_ENV === 'development') {
  // 开发环境使用全局变量保持连接
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // 生产环境创建新连接
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

/**
 * 获取数据库实例
 */
export async function getDatabase() {
  const client = await clientPromise;
  return client.db('forum');
}

/**
 * 获取用户集合
 */
export async function getUsersCollection() {
  const db = await getDatabase();
  return db.collection('users');
}

/**
 * 获取文章集合
 */
export async function getPostsCollection() {
  const db = await getDatabase();
  return db.collection('posts');
}
