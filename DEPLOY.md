# 快速部署指南

## 方案：Vercel + MongoDB Atlas（完全免费）

### 第一步：准备 MongoDB 数据库

1. 访问 https://www.mongodb.com/cloud/atlas
2. 注册账号（可用 Google/GitHub 快捷登录）
3. 创建免费集群（M0 Free Tier）
4. 创建数据库用户（记住用户名和密码）
5. 在 Network Access 中添加 IP: `0.0.0.0/0`（允许所有IP访问）
6. 点击 "Connect" → "Drivers" → 复制连接字符串
7. 将连接字符串中的 `<username>` 和 `<password>` 替换为实际值

示例连接字符串：
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/forum?retryWrites=true&w=majority
```

### 第二步：部署到 Vercel

#### 方式A：使用 Vercel CLI（推荐）

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录 Vercel
vercel login

# 3. 进入项目目录
cd 5g-forum

# 4. 部署（首次会提示配置）
vercel --prod

# 5. 配置环境变量
vercel env add MONGODB_URI
vercel env add JWT_SECRET

# 6. 重新部署
vercel --prod
```

#### 方式B：通过 GitHub 部署（最简单）

1. 在 GitHub 创建新仓库
2. 上传代码到 GitHub：
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/5g-forum.git
git push -u origin main
```

3. 访问 https://vercel.com
4. 点击 "Add New Project"
5. 导入 GitHub 仓库
6. 配置环境变量：
   - `MONGODB_URI`: 你的 MongoDB 连接字符串
   - `JWT_SECRET`: 任意随机字符串（如：`my-secret-key-123456`）
7. 点击 Deploy

### 第三步：访问网站

部署完成后，Vercel 会提供类似这样的链接：
```
https://5g-forum-xxx.vercel.app
```

这就是你的网站访问地址！

---

## 后台管理

当前版本没有独立的后台管理界面，可以通过以下方式管理：

### 方式1：MongoDB Atlas 控制台
1. 登录 https://cloud.mongodb.com
2. 进入你的集群 → Browse Collections
3. 可以直接查看和编辑数据

### 方式2：MongoDB Compass（桌面客户端）
1. 下载 https://www.mongodb.com/products/compass
2. 用连接字符串连接数据库
3. 可视化管理数据

---

## 费用说明

| 服务 | 免费额度 | 是否够用 |
|------|---------|---------|
| **Vercel** | 100GB流量/月，无限请求 | ✅ 小型论坛完全够用 |
| **MongoDB Atlas** | 512MB存储，共享集群 | ✅ 初期完全够用 |
| **总计** | **¥0/月** | - |

---

## 常见问题

**Q: 如何绑定自己的域名？**
1. 在 Vercel 项目设置中找到 "Domains"
2. 添加你的域名
3. 在域名管理平台添加 CNAME 记录指向 Vercel

**Q: 网站访问慢怎么办？**
- Vercel 自动有全球 CDN
- 如果国内慢，可以考虑腾讯云/阿里云

**Q: 如何备份数据？**
- MongoDB Atlas 每天自动备份
- 也可手动导出：Atlas → Backup → Download

---

## 需要帮助？

1. 查看 Vercel 文档：https://vercel.com/docs
2. 查看 MongoDB 文档：https://docs.mongodb.com
3. 在 GitHub 提交 Issue
