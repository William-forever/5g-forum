# 中移互5G消息交流论坛

一个基于 Next.js + MongoDB 的现代化论坛系统，支持用户注册登录、文章发布管理等功能。

## 技术栈

- **前端**: Next.js 14 + React 18
- **后端**: Next.js API Routes (Serverless)
- **数据库**: MongoDB Atlas
- **部署**: Vercel
- **认证**: JWT

## 功能特性

- ✅ 用户注册/登录/登出
- ✅ JWT Token 认证
- ✅ 文章发布/列表/详情
- ✅ 文章分类标签
- ✅ 响应式设计
- ✅ 积分系统
- ✅ 实时时间显示

## 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd 5g-forum
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
# MongoDB Atlas 连接字符串
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/forum?retryWrites=true&w=majority

# JWT 密钥（生产环境请使用强密码）
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 部署到 Vercel

### 方式一：通过 Git 部署（推荐）

1. 在 GitHub 上创建仓库并推送代码
2. 登录 [Vercel](https://vercel.com)
3. 点击 "New Project"
4. 导入 GitHub 仓库
5. 配置环境变量（MONGODB_URI 和 JWT_SECRET）
6. 点击 Deploy

### 方式二：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

## MongoDB Atlas 设置

1. 访问 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. 注册账号并创建免费集群
3. 创建数据库用户
4. 添加 IP 白名单（或允许所有 IP: `0.0.0.0/0`）
5. 获取连接字符串并替换密码

## 项目结构

```
├── components/          # React 组件
│   ├── Header.js       # 头部导航
│   ├── Sidebar.js      # 左侧边栏
│   ├── RightSidebar.js # 右侧边栏
│   ├── PostList.js     # 文章列表
│   ├── AuthModal.js    # 登录注册弹窗
│   └── PostModal.js    # 发布文章弹窗
├── pages/              # 页面和 API
│   ├── index.js        # 首页
│   └── api/            # API 路由
│       ├── auth/       # 认证相关
│       └── posts/      # 文章相关
├── lib/                # 工具库
│   ├── mongodb.js      # MongoDB 连接
│   └── auth.js         # 认证工具
├── styles/             # 样式文件
│   └── globals.css     # 全局样式
├── package.json
└── next.config.js
```

## API 接口

### 认证

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 文章

- `GET /api/posts` - 获取文章列表
- `POST /api/posts` - 创建文章（需登录）

## 免费额度

- **Vercel**: 100GB 流量/月，无限请求
- **MongoDB Atlas**: 512MB 存储，共享集群
- **总成本**: ¥0/月

## 注意事项

1. 生产环境请修改 JWT_SECRET 为强密码
2. 建议启用 MongoDB Atlas 的备份功能
3. 定期更新依赖包以确保安全

## License

MIT
