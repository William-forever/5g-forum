# Serverless 部署快速指南

## 一、什么是 Serverless？

Serverless（无服务器）是一种云计算模式，你只需要写代码，不需要管理服务器。云服务商会自动帮你分配资源、处理扩容、维护服务器。

### 核心优势
- ✅ **零服务器维护** - 不用配置、升级、监控服务器
- ✅ **自动扩缩容** - 流量大时自动扩容，小时自动缩容
- ✅ **按需付费** - 代码运行时才收费，空闲时不花钱
- ✅ **快速部署** - 秒级部署，全球 CDN 加速

---

## 二、推荐方案：Vercel + Next.js + MongoDB Atlas

```
┌─────────────────────────────────────┐
│         Vercel (托管平台)            │
│   - 自动部署 + 全球 CDN              │
│   - 免费额度：100GB/月              │
└─────────────────────────────────────┘
                  │
┌─────────────────────────────────────┐
│         Next.js (全栈框架)           │
│   - React 前端 + API 后端            │
│   - 一个项目搞定前后端               │
└─────────────────────────────────────┘
                  │
┌─────────────────────────────────────┐
│      MongoDB Atlas (云数据库)        │
│   - 免费额度：512MB 存储            │
│   - 无需维护数据库服务器             │
└─────────────────────────────────────┘
```

---

## 三、部署步骤

### 步骤 1：注册账号

| 平台 | 网址 | 用途 |
|------|------|------|
| GitHub | github.com | 代码托管 |
| Vercel | vercel.com | 网站托管 |
| MongoDB Atlas | mongodb.com/cloud/atlas | 数据库 |

### 步骤 2：创建 MongoDB 数据库

1. 登录 MongoDB Atlas
2. 点击 "Build a Database"
3. 选择 "M0 Free" 免费套餐
4. 选择地区：Singapore（新加坡，离中国近）
5. 创建数据库用户（记住密码）
6. 网络访问设置：Allow Access from Anywhere
7. 复制连接字符串，格式如下：
   ```
   mongodb+srv://用户名:密码@cluster0.xxx.mongodb.net/forum?retryWrites=true&w=majority
   ```

### 步骤 3：准备项目代码

项目文件结构：
```
5g-forum/
├── package.json          # 项目配置
├── next.config.js        # Next.js 配置
├── .env.local            # 本地环境变量
├── lib/
│   ├── mongodb.js        # 数据库连接
│   └── auth.js           # 认证工具
├── pages/
│   ├── api/              # API 接口
│   │   ├── auth/
│   │   │   ├── login.js  # 登录接口
│   │   │   └── register.js # 注册接口
│   │   └── posts.js      # 文章接口
│   ├── _app.js           # 应用入口
│   ├── index.js          # 首页
│   └── admin.js          # 后台管理
└── components/           # 组件
```

### 步骤 4：配置环境变量

创建 `.env.local` 文件：
```
MONGODB_URI=mongodb+srv://你的用户名:你的密码@cluster0.xxx.mongodb.net/forum?retryWrites=true&w=majority
JWT_SECRET=你的密钥随便写一串字母数字
```

### 步骤 5：本地测试

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 访问 http://localhost:3000
```

### 步骤 6：部署到 Vercel

**方式 A：网页部署（推荐）**
1. 把代码推送到 GitHub
2. 登录 vercel.com
3. 点击 "Add New Project"
4. 选择你的 GitHub 仓库
5. 添加环境变量（MONGODB_URI 和 JWT_SECRET）
6. 点击 Deploy

**方式 B：命令行部署**
```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 添加环境变量
vercel env add MONGODB_URI
vercel env add JWT_SECRET

# 生产部署
vercel --prod
```

---

## 四、后台管理方式

### 1. 数据库管理
- 网址：https://cloud.mongodb.com
- 功能：查看/编辑用户、文章数据，导出备份

### 2. 网站管理
- 网址：https://vercel.com/dashboard
- 功能：查看日志、统计、配置域名

### 3. 管理页面
- 访问：`https://你的域名/admin`
- 功能：文章管理、用户统计

---

## 五、费用说明

| 服务 | 免费额度 | 超出费用 |
|------|---------|---------|
| Vercel | 100GB/月 | $0.40/GB |
| MongoDB | 512MB 存储 | $0.10/GB/月 |

**结论**：小网站完全免费，大网站也很便宜。

---

## 六、核心代码示例

### 用户注册 API
```javascript
// pages/api/auth/register.js
import { getUsersCollection } from '../../lib/mongodb'
import { hashPassword, generateToken } from '../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' })
  }

  const { username, email, password } = req.body
  const users = await getUsersCollection()
  
  // 检查用户是否存在
  const exists = await users.findOne({ $or: [{ username }, { email }] })
  if (exists) {
    return res.status(400).json({ error: '用户已存在' })
  }

  // 创建用户
  const hashedPassword = await hashPassword(password)
  const result = await users.insertOne({
    username, email, password: hashedPassword,
    createdAt: new Date()
  })

  // 生成 Token
  const token = generateToken({ userId: result.insertedId, username })

  res.status(201).json({ success: true, token })
}
```

### 前端调用示例
```javascript
// 注册
const register = async (username, email, password) => {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  })
  const data = await res.json()
  if (data.success) {
    localStorage.setItem('token', data.token)
  }
}

// 发布文章（需要登录）
const createPost = async (title, content) => {
  const token = localStorage.getItem('token')
  const res = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ title, content })
  })
  return res.json()
}
```

---

## 七、常见问题

**Q: 如何绑定自己的域名？**
A: 在 Vercel 项目设置 → Domains → 添加域名 → 按提示配置 DNS

**Q: 如何更新网站？**
A: 推送代码到 GitHub，Vercel 自动重新部署

**Q: 数据安全吗？**
A: MongoDB Atlas 有自动备份，Vercel 有 DDoS 防护

**Q: 访问速度慢怎么办？**
A: Vercel 自动全球 CDN 加速，国内访问建议绑定国内 CDN

---

**需要我帮你完成具体代码实现吗？**
