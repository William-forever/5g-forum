# Railway 部署指南

## 为什么选择 Railway？

- ✅ 支持服务器端渲染（SSR）
- ✅ 支持数据库持久化
- ✅ 免费额度充足（每月 $5 免费额度）
- ✅ 部署简单，支持 GitHub 自动部署
- ✅ 国内访问速度比 Vercel/Netlify 更好

---

## 部署步骤

### 第一步：准备代码

确保你的代码已经推送到 GitHub：

```bash
cd c:\Users\lenovo\WorkBuddy\20260310173333
git add .
git commit -m "Prepare for Railway deployment"
git push
```

### 第二步：注册 Railway 账号

1. 访问 https://railway.app
2. 点击 **"Get Started"**
3. 选择 **"Sign up with GitHub"**（推荐）
4. 授权 Railway 访问你的 GitHub 仓库

### 第三步：创建项目

1. 点击 **"New Project"**
2. 选择 **"Deploy from GitHub repo"**
3. 选择你的仓库 `5g-forum`
4. 点击 **"Add Variables"** 配置环境变量

### 第四步：配置环境变量

添加以下环境变量：

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://dhqoebqzmuktgxpuktyv.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRocW9lYnF6bXVrdGd4cHVrdHl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTM5MDAsImV4cCI6MjA4ODc2OTkwMH0.aiLsQyrLSgs0SSV3aDh8wiIkT_kqf-DXRwV9M8UoLfg` |
| `JWT_SECRET` | `5g-forum-secret-key-2026-abc123` |

### 第五步：部署

1. 点击 **"Deploy"**
2. 等待部署完成（约 2-3 分钟）
3. 部署完成后，点击 **"Settings"** → **"Domains"**
4. 你会获得一个默认域名，如：`5g-forum.up.railway.app`

### 第六步：配置域名（可选）

如果你想使用自定义域名：

1. 在 **Settings** → **Domains** 中添加你的域名
2. 在域名 DNS 中添加 CNAME 记录指向 Railway 提供的域名

---

## 费用说明

| 项目 | 免费额度 | 超出费用 |
|------|---------|---------|
| 执行时间 | 500 小时/月 | $0.0001/秒 |
| 内存 | 512 MB | - |
| 磁盘 | 1 GB | - |
| 出站流量 | 100 GB/月 | $0.10/GB |

**小网站完全免费！**

---

## 与 Vercel/Netlify 对比

| 特性 | Railway | Vercel | Netlify |
|------|---------|--------|---------|
| SSR 支持 | ✅ 完美支持 | ✅ 支持 | ✅ 支持 |
| API 路由 | ✅ 完美支持 | ✅ 支持 | ✅ 支持 |
| 文件持久化 | ✅ 支持 | ❌ 不支持 | ❌ 不支持 |
| 数据库 | ✅ 可安装 | ❌ 需外部 | ❌ 需外部 |
| 国内访问 | ⭐⭐⭐ 快 | ⭐⭐ 一般 | ⭐⭐ 一般 |
| 免费额度 | $5/月 | 100GB/月 | 100GB/月 |

---

## 常见问题

### Q: 部署失败怎么办？

A: 检查以下几点：
1. 环境变量是否正确配置
2. package.json 是否有 build 脚本
3. 查看 Railway 的部署日志

### Q: 如何查看日志？

A: 在 Railway 控制台点击 **"Deployments"** → 选择部署记录 → **"View Logs"**

### Q: 如何更新代码？

A: 直接推送代码到 GitHub，Railway 会自动重新部署

---

## 开始部署

请按以上步骤操作，完成后告诉我你的访问链接！
