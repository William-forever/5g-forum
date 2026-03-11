# Serverless 部署完整指南

## 一、什么是 Serverless？

### 概念
Serverless（无服务器架构）是一种云计算模式，开发者只需编写业务代码，无需管理服务器。云服务提供商会自动分配计算资源，按实际使用量计费。

### 核心优势
- ✅ **零服务器维护** - 无需配置、更新、监控服务器
- ✅ **自动扩缩容** - 根据流量自动调整资源
- ✅ **按需付费** - 只在代码运行时收费
- ✅ **快速部署** - 秒级部署上线
- ✅ **全球 CDN** - 自动分发到全球节点

### 适用场景
- 网站/应用后端 API
- 用户认证系统
- 数据处理任务
- 定时任务
- 实时通信

---

## 二、技术栈选择

### 推荐方案：Vercel + Next.js + MongoDB Atlas

```
┌─────────────────────────────────────────────────────────┐
│                    前端层 (Frontend)                      │
│              Next.js React 组件 + 静态页面                 │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                   API 层 (Serverless)                     │
│         Vercel Serverless Functions (Node.js)            │
│         - 用户认证 API                                    │
│         - 文章管理 API                                    │
│         - 文件上传 API                                    │
└─────────────────────────────────────────────────────────┘
                           │
┌─────────────────────────────────────────────────────────┐
│                  数据层 (Database)                        │
│              MongoDB Atlas (云数据库)                      │
│         - 用户数据                                        │
│         - 文章数据                                        │
│         - 评论数据                                        │
└─────────────────────────────────────────────────────────┘
```

### 为什么选择这套方案？

| 组件 | 选择理由 | 免费额度 |
|------|---------|---------|
| **Vercel** | Next.js 官方出品，部署最简单 | 100GB流量/月，无限请求 |
| **Next.js** | 全栈框架，前后端一体 | 开源免费 |
| **MongoDB Atlas** | 文档型数据库，适合快速开发 | 512MB存储，共享集群 |

---

## 三、部署前准备

### 1. 注册必要账号

#### A. GitHub 账号
- 访问 https://github.com
- 注册账号（如已有可跳过）
- 创建新仓库 `5g-forum`

#### B. Vercel 账号
- 访问 https://vercel.com
- 点击 "Sign Up" 用 GitHub 账号登录
- 授权 Vercel 访问你的 GitHub 仓库

#### C. MongoDB Atlas 账号
- 访问 https://www.mongodb.com/cloud/atlas
- 注册账号
- 创建免费集群（Free Tier）

### 2. 安装必要工具

```bash
# 安装 Node.js (18.x 或更高版本)
# 访问 https://nodejs.org 下载安装

# 验证安装
node -v  # 应显示 v18.x.x 或更高
npm -v   # 应显示 9.x.x 或更高

# 安装 Vercel CLI (可选，用于命令行部署)
npm i -g vercel
```

---

## 四、详细部署步骤

### 步骤 1：准备项目代码

#### 1.1 创建项目结构

在你的项目文件夹中创建以下文件：

```
5g-forum/
├── package.json          # 项目依赖配置
├── next.config.js        # Next.js 配置
├── .env.local            # 本地环境变量（不提交到Git）
├── .env.example          # 环境变量示例
├── lib/
│   ├── mongodb.js        # MongoDB 连接
│   └── auth.js           # 认证工具
├── pages/
│   ├── api/              # API 路由
│   │   ├── auth/
│   │   │   ├── login.js  # 登录接口
│   │   │   └── register.js # 注册接口
│   │   └── posts/
│   │       └── index.js  # 文章接口
│   ├── _app.js           # 应用入口
│   ├── index.js          # 首页
│   └── admin.js          # 后台管理页
├── components/           # React 组件
│   ├── Header.js
│   ├── Sidebar.js
│   ├── PostList.js
│   ├── LoginModal.js
│   └── CreatePostModal.js
└── public/               # 静态资源
    └── images/
```

#### 1.2 配置 package.json

```json
{
  "name": "5g-forum",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "mongodb": "^6.3.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2"
  }
}
```

#### 1.3 配置 next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 环境变量
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
  },
}

module.exports = nextConfig
```

#### 1.4 创建环境变量示例 .env.example

```
# MongoDB 连接字符串（从 MongoDB Atlas 获取）
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/forum?retryWrites=true&w=majority

# JWT 密钥（用于用户认证，自定义一个长字符串）
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

#### 1.5 创建本地环境变量 .env.local

复制 .env.example 为 .env.local，填入实际值：

```
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/forum?retryWrites=true&w=majority
JWT_SECRET=5g-forum-secret-key-2026-random-string-here
```

⚠️ **重要**：.env.local 文件包含敏感信息，**不要提交到 Git**！

---

### 步骤 2：配置 MongoDB Atlas 数据库

#### 2.1 创建集群

1. 登录 MongoDB Atlas 控制台
2. 点击 "Build a Database"
3. 选择 "M0 Free" 免费套餐
4. 选择云服务提供商（推荐 AWS）
5. 选择地区（推荐亚太地区，如新加坡）
6. 点击 "Create Cluster"

#### 2.2 配置数据库访问

1. 点击左侧 "Database Access"
2. 点击 "Add New Database User"
3. 选择 "Password" 认证方式
4. 设置用户名和密码（**保存好密码**）
5. 权限选择 "Read and write to any database"
6. 点击 "Add User"

#### 2.3 配置网络访问

1. 点击左侧 "Network Access"
2. 点击 "Add IP Address"
3. 选择 "Allow Access from Anywhere" (0.0.0.0/0)
   - 生产环境建议限制为 Vercel 的 IP 段
4. 点击 "Confirm"

#### 2.4 获取连接字符串

1. 点击 "Database" → "Connect"
2. 选择 "Connect your application"
3. 复制连接字符串，替换 `<password>` 为实际密码
4. 将连接字符串填入 .env.local 的 MONGODB_URI

---

### 步骤 3：编写后端 API

#### 3.1 创建 MongoDB 连接模块

创建 `lib/mongodb.js`：

```javascript
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise

if (!process.env.MONGODB_URI) {
  throw new Error('请添加 MONGODB_URI 到环境变量')
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export default clientPromise

export async function getDatabase() {
  const client = await clientPromise
  return client.db('forum')
}

export async function getUsersCollection() {
  const db = await getDatabase()
  return db.collection('users')
}

export async function getPostsCollection() {
  const db = await getDatabase()
  return db.collection('posts')
}
```

#### 3.2 创建认证工具模块

创建 `lib/auth.js`：

```javascript
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export async function hashPassword(password) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function getTokenFromHeader(req) {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  return null
}
```

#### 3.3 创建注册 API

创建 `pages/api/auth/register.js`：

```javascript
import { getUsersCollection } from '../../../lib/mongodb'
import { hashPassword, generateToken } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: '方法不允许' })
  }

  try {
    const { username, email, password } = req.body

    // 验证输入
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '请填写所有字段' 
      })
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: '密码至少6位' 
      })
    }

    const usersCollection = await getUsersCollection()

    // 检查用户是否存在
    const existingUser = await usersCollection.findOne({
      $or: [{ username }, { email }]
    })

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: '用户名或邮箱已存在' 
      })
    }

    // 创建用户
    const hashedPassword = await hashPassword(password)
    const result = await usersCollection.insertOne({
      username,
      email,
      password: hashedPassword,
      points: 0,
      role: 'user',
      createdAt: new Date()
    })

    // 生成 Token
    const token = generateToken({
      userId: result.insertedId.toString(),
      username,
      role: 'user'
    })

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: { userId: result.insertedId.toString(), username, email },
      token
    })

  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
}
```

#### 3.4 创建登录 API

创建 `pages/api/auth/login.js`：

```javascript
import { getUsersCollection } from '../../../lib/mongodb'
import { verifyPassword, generateToken } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: '方法不允许' })
  }

  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: '请填写用户名和密码' 
      })
    }

    const usersCollection = await getUsersCollection()

    // 查找用户
    const user = await usersCollection.findOne({
      $or: [{ username }, { email: username }]
    })

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: '用户名或密码错误' 
      })
    }

    // 验证密码
    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        message: '用户名或密码错误' 
      })
    }

    // 生成 Token
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username,
      role: user.role
    })

    res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        points: user.points,
        role: user.role
      },
      token
    })

  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
}
```

#### 3.5 创建文章 API

创建 `pages/api/posts/index.js`：

```javascript
import { getPostsCollection } from '../../../lib/mongodb'
import { verifyToken, getTokenFromHeader } from '../../../lib/auth'

// 获取文章列表
async function getPosts(req, res) {
  try {
    const { page = 1, limit = 10, category } = req.query
    const postsCollection = await getPostsCollection()

    const query = category ? { category } : {}
    const total = await postsCollection.countDocuments(query)

    const posts = await postsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .toArray()

    res.status(200).json({
      success: true,
      posts: posts.map(post => ({
        id: post._id.toString(),
        title: post.title,
        content: post.content,
        category: post.category,
        author: post.author,
        likes: post.likes || 0,
        comments: post.comments || 0,
        views: post.views || 0,
        createdAt: post.createdAt
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('获取文章错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
}

// 创建文章
async function createPost(req, res) {
  try {
    // 验证登录
    const token = getTokenFromHeader(req)
    if (!token) {
      return res.status(401).json({ success: false, message: '请先登录' })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return res.status(401).json({ success: false, message: '登录已过期' })
    }

    const { title, content, category } = req.body

    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: '标题和内容不能为空' 
      })
    }

    const postsCollection = await getPostsCollection()

    const result = await postsCollection.insertOne({
      title,
      content,
      category: category || '其他',
      author: decoded.username,
      authorId: decoded.userId,
      likes: 0,
      comments: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    res.status(201).json({
      success: true,
      message: '发布成功',
      postId: result.insertedId.toString()
    })

  } catch (error) {
    console.error('创建文章错误:', error)
    res.status(500).json({ success: false, message: '服务器错误' })
  }
}

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getPosts(req, res)
    case 'POST':
      return createPost(req, res)
    default:
      return res.status(405).json({ success: false, message: '方法不允许' })
  }
}
```

---

### 步骤 4：编写前端页面

#### 4.1 创建应用入口

创建 `pages/_app.js`：

```javascript
import { createContext, useState, useEffect } from 'react'

// 创建用户上下文
export const UserContext = createContext()

export default function App({ Component, pageProps }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 从 localStorage 恢复登录状态
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = (userData, token) => {
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  if (loading) {
    return <div>加载中...</div>
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}
```

#### 4.2 创建首页

创建 `pages/index.js`：

```javascript
import { useState, useEffect, useContext } from 'react'
import Head from 'next/head'
import { UserContext } from './_app'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import PostList from '../components/PostList'
import LoginModal from '../components/LoginModal'
import CreatePostModal from '../components/CreatePostModal'

export default function Home() {
  const { user } = useContext(UserContext)
  const [posts, setPosts] = useState([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // 获取文章列表
  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts')
      const data = await res.json()
      if (data.success) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('获取文章失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Head>
        <title>中移互5G消息交流论坛</title>
        <meta name="description" content="5G消息技术交流平台" />
      </Head>

      <Header 
        onLoginClick={() => setShowLoginModal(true)}
        onCreateClick={() => setShowCreateModal(true)}
      />

      <div className="main-container">
        <Sidebar />
        
        <main className="main-content">
          <div className="main-content-header">
            <h2>最新帖子</h2>
            {user && (
              <button 
                className="post-btn"
                onClick={() => setShowCreateModal(true)}
              >
                发布新帖
              </button>
            )}
          </div>
          
          {loading ? (
            <div>加载中...</div>
          ) : (
            <PostList posts={posts} />
          )}
        </main>

        <aside className="sidebar right-sidebar">
          {/* 右侧边栏内容 */}
        </aside>
      </div>

      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false)
            fetchPosts()
          }}
        />
      )}

      {showCreateModal && user && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false)
            fetchPosts()
          }}
        />
      )}
    </div>
  )
}
```

#### 4.3 创建登录弹窗组件

创建 `components/LoginModal.js`：

```javascript
import { useState, useContext } from 'react'
import { UserContext } from '../pages/_app'

export default function LoginModal({ onClose, onSuccess }) {
  const { login } = useContext(UserContext)
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const url = isLogin ? '/api/auth/login' : '/api/auth/register'
      
      // 注册时验证密码
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setError('两次输入的密码不一致')
        setLoading(false)
        return
      }

      const body = isLogin 
        ? { username: formData.username, password: formData.password }
        : { 
            username: formData.username, 
            email: formData.email, 
            password: formData.password 
          }

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()

      if (data.success) {
        login(data.data, data.token)
        onSuccess()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isLogin ? '用户登录' : '用户注册'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-tabs">
          <button 
            className={isLogin ? 'active' : ''}
            onClick={() => setIsLogin(true)}
          >
            登录
          </button>
          <button 
            className={!isLogin ? 'active' : ''}
            onClick={() => setIsLogin(false)}
          >
            注册
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>用户名</label>
            <input
              type="text"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              placeholder="请输入用户名"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>邮箱</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="请输入邮箱"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label>密码</label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="请输入密码"
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>确认密码</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="请再次输入密码"
                required
              />
            </div>
          )}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '处理中...' : (isLogin ? '登录' : '注册')}
          </button>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 400px;
          padding: 20px;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .modal-header h3 {
          margin: 0;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }
        .modal-tabs {
          display: flex;
          margin-bottom: 20px;
          border-bottom: 1px solid #e9ecef;
        }
        .modal-tabs button {
          flex: 1;
          padding: 10px;
          border: none;
          background: none;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }
        .modal-tabs button.active {
          border-bottom-color: #007bff;
          color: #007bff;
        }
        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }
        .form-group input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .submit-btn {
          width: 100%;
          padding: 12px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
```

#### 4.4 创建发布文章弹窗

创建 `components/CreatePostModal.js`：

```javascript
import { useState } from 'react'

export default function CreatePostModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '行业动态'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const categories = [
    '行业动态',
    '招投标信息',
    '产品培训',
    '行业联动',
    'agent交流广场',
    '技术交流',
    '需求发布',
    '活动通知'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success) {
        onSuccess()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('发布失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>发布新帖</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>分类</label>
            <select
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>标题</label>
            <input
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="请输入标题"
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label>内容</label>
            <textarea
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              placeholder="请输入内容"
              required
              rows={10}
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '发布中...' : '发布'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 20px;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .modal-header h3 {
          margin: 0;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }
        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        .form-group textarea {
          resize: vertical;
          min-height: 150px;
        }
        .submit-btn {
          width: 100%;
          padding: 12px;
          background: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}
```

---

### 步骤 5：本地测试

#### 5.1 安装依赖

```bash
npm install
```

#### 5.2 启动开发服务器

```bash
npm run dev
```

#### 5.3 测试功能

1. 访问 http://localhost:3000
2. 点击"注册"按钮，创建测试账号
3. 使用新账号登录
4. 点击"发布新帖"，创建一篇文章
5. 刷新页面，查看文章是否显示

---

### 步骤 6：部署到 Vercel

#### 6.1 推送代码到 GitHub

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit"

# 添加远程仓库（替换为你的 GitHub 仓库地址）
git remote add origin https://github.com/你的用户名/5g-forum.git

# 推送
git push -u origin main
```

#### 6.2 在 Vercel 上部署

**方式一：通过 Vercel 网站（推荐）**

1. 登录 https://vercel.com
2. 点击 "Add New Project"
3. 选择你的 GitHub 仓库 `5g-forum`
4. 点击 "Import"
5. 配置环境变量：
   - 点击 "Environment Variables"
   - 添加 `MONGODB_URI` = 你的 MongoDB 连接字符串
   - 添加 `JWT_SECRET` = 你的 JWT 密钥
6. 点击 "Deploy"

**方式二：通过 Vercel CLI**

```bash
# 登录 Vercel
vercel login

# 部署
vercel

# 配置环境变量
vercel env add MONGODB_URI
vercel env add JWT_SECRET

# 重新部署
vercel --prod
```

#### 6.3 查看部署结果

部署完成后，Vercel 会提供：
- 生产环境链接：`https://5g-forum-xxx.vercel.app`
- 自定义域名配置选项

---

## 五、后台管理方式

### 1. 数据库管理（MongoDB Atlas）

**访问地址**：https://cloud.mongodb.com

**功能**：
- 查看/编辑用户数据
- 查看/编辑文章数据
- 查看数据库统计
- 导出数据备份

**常用操作**：
```javascript
// 查看所有用户
db.users.find()

// 查看所有文章
db.posts.find()

// 删除用户
db.users.deleteOne({ username: "用户名" })

// 删除文章
db.posts.deleteOne({ _id: ObjectId("文章ID") })
```

### 2. Vercel 控制台

**访问地址**：https://vercel.com/dashboard

**功能**：
- 查看部署日志
- 管理环境变量
- 查看访问统计
- 配置自定义域名
- 管理团队成员

### 3. 简单的后台管理页面

创建 `pages/admin.js`：

```javascript
import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Admin() {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({ posts: 0, users: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    // 获取统计数据
    const postsRes = await fetch('/api/posts?limit=1000')
    const postsData = await postsRes.json()
    
    if (postsData.success) {
      setPosts(postsData.posts)
      setStats(prev => ({ ...prev, posts: postsData.pagination.total }))
    }
    
    setLoading(false)
  }

  const deletePost = async (postId) => {
    if (!confirm('确定要删除这篇文章吗？')) return
    
    const token = localStorage.getItem('token')
    const res = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    
    if (res.ok) {
      fetchData()
    }
  }

  if (loading) return <div>加载中...</div>

  return (
    <div>
      <Head>
        <title>后台管理 - 5G消息交流论坛</title>
      </Head>

      <div className="admin-container">
        <h1>后台管理</h1>
        
        <div className="stats-cards">
          <div className="stat-card">
            <h3>总文章数</h3>
            <p>{stats.posts}</p>
          </div>
          <div className="stat-card">
            <h3>总用户数</h3>
            <p>{stats.users}</p>
          </div>
        </div>

        <h2>文章管理</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>标题</th>
              <th>作者</th>
              <th>分类</th>
              <th>发布时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>{post.author}</td>
                <td>{post.category}</td>
                <td>{new Date(post.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => deletePost(post.id)}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .admin-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .stat-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }
        .stat-card h3 {
          margin: 0 0 10px 0;
          color: #666;
        }
        .stat-card p {
          margin: 0;
          font-size: 32px;
          font-weight: bold;
          color: #007bff;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
        }
        .admin-table th,
        .admin-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        .admin-table th {
          background: #f8f9fa;
          font-weight: 600;
        }
        .admin-table button {
          padding: 6px 12px;
          background: #dc3545;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}
```

---

## 六、费用说明

### 免费额度

| 服务 | 免费额度 | 超出费用 |
|------|---------|---------|
| **Vercel** | 100GB 流量/月，无限请求 | $0.40/GB |
| **MongoDB Atlas** | 512MB 存储，共享集群 | $0.10/GB/月 |
| **带宽** | 100GB/月 | $0.12/GB |

### 预估费用

| 用户规模 | 预估月费用 |
|---------|-----------|
| 0-1000 用户 | ¥0（完全免费） |
| 1000-10000 用户 | ¥0-50 |
| 10000+ 用户 | ¥50-200 |

---

## 七、常见问题

### Q1: 如何绑定自定义域名？

1. 在 Vercel 项目设置中找到 "Domains"
2. 添加你的域名
3. 在域名 DNS 中添加 CNAME 记录指向 `cname.vercel-dns.com`
4. 等待 DNS 生效（通常几分钟到几小时）

### Q2: 如何备份数据库？

1. 登录 MongoDB Atlas
2. 点击 "Backup"
3. 可以设置自动备份或手动导出

### Q3: 如何查看错误日志？

1. 登录 Vercel
2. 进入项目 → "Logs" 标签
3. 可以查看实时日志和历史日志

### Q4: 如何更新已部署的网站？

只需推送代码到 GitHub，Vercel 会自动重新部署：

```bash
git add .
git commit -m "更新内容"
git push
```

---

## 八、安全建议

1. **定期更换 JWT_SECRET**
2. **启用 MongoDB Atlas 的 IP 白名单**
3. **使用 HTTPS（Vercel 默认启用）**
4. **对用户输入进行验证和过滤**
5. **定期备份数据库**
6. **启用 Vercel 的 DDoS 保护**

---

**文档版本**: 1.0
**更新日期**: 2026-03-10
