# 免费数据库方案对比

## 一、MongoDB Atlas 替代方案

### 1. **Supabase** ⭐ 强烈推荐
- **网址**: https://supabase.com
- **类型**: PostgreSQL
- **免费额度**: 
  - 500MB 存储
  - 2GB 带宽/月
  - 无限请求
- **优点**: 
  - 支持邮箱/手机号注册
  - 国内访问速度好
  - 自带认证、存储、实时功能
  - 有中文社区
- **缺点**: 数据存储在海外

### 2. **PlanetScale**
- **网址**: https://planetscale.com
- **类型**: MySQL
- **免费额度**:
  - 5GB 存储
  - 10亿次读取/月
  - 1000万次写入/月
- **优点**: 
  - 无需信用卡
  - GitHub 账号直接登录
  - 分支管理（像 Git 一样管理数据库）
- **缺点**: 只支持 MySQL

### 3. **CockroachDB Serverless**
- **网址**: https://www.cockroachlabs.com
- **类型**: PostgreSQL
- **免费额度**:
  - 5GB 存储
  - 250M 请求/月
- **优点**: 
  - 分布式数据库
  - 高可用
- **缺点**: 配置稍复杂

### 4. **Firebase Firestore**
- **网址**: https://firebase.google.com
- **类型**: NoSQL 文档数据库
- **免费额度**:
  - 1GB 存储
  - 5万次读取/天
  - 2万次写入/天
- **优点**: 
  - Google 出品，稳定
  - 实时同步
  - 自带认证、存储
- **缺点**: 国内访问不稳定

### 5. **Neon**
- **网址**: https://neon.tech
- **类型**: PostgreSQL
- **免费额度**:
  - 3GB 存储
  - 无限连接
- **优点**: 
  - 分支功能
  - 自动休眠（省钱）
  - 速度快
- **缺点**: 新项目，生态较小

---

## 二、推荐方案：Supabase

### 为什么选择 Supabase？
1. ✅ 注册简单，支持邮箱
2. ✅ 国内访问速度快
3. ✅ 免费额度够用
4. ✅ 功能全面（数据库+认证+存储）
5. ✅ 文档完善

### 注册步骤

1. 访问 https://supabase.com
2. 点击 **"Start your project"**
3. 选择 **"Continue with GitHub"** 或邮箱注册
4. 创建新项目：
   - Name: `5g-forum`
   - Database Password: 设置密码
   - Region: **Singapore (Southeast Asia)**
5. 等待数据库创建（约1分钟）

### 获取连接信息

1. 进入项目 → **Settings** → **Database**
2. 找到 **Connection string** (URI)
3. 格式如下：
   ```
   postgresql://postgres:密码@db.xxxxx.supabase.co:5432/postgres
   ```

---

## 三、代码修改（使用 Supabase）

如果使用 Supabase，需要修改数据库连接代码：

### 安装依赖
```bash
npm install @supabase/supabase-js
```

### 创建连接文件 `lib/supabase.js`
```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 环境变量 `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## 四、快速对比

| 数据库 | 类型 | 免费存储 | 国内访问 | 注册难度 | 推荐度 |
|--------|------|---------|---------|---------|--------|
| **Supabase** | PostgreSQL | 500MB | ⭐⭐⭐ 快 | ⭐ 简单 | ⭐⭐⭐ 强烈推荐 |
| **PlanetScale** | MySQL | 5GB | ⭐⭐ 较快 | ⭐ 简单 | ⭐⭐⭐ 推荐 |
| **Neon** | PostgreSQL | 3GB | ⭐⭐ 较快 | ⭐ 简单 | ⭐⭐ 推荐 |
| **CockroachDB** | PostgreSQL | 5GB | ⭐⭐ 较快 | ⭐⭐ 中等 | ⭐⭐ 可选 |
| **Firebase** | NoSQL | 1GB | ⭐ 较慢 | ⭐ 简单 | ⭐ 备选 |

---

## 五、我的建议

### 方案 1：Supabase（推荐）
- 注册最简单
- 国内访问快
- 功能全面
- 免费额度够用

### 方案 2：PlanetScale
- 存储空间更大（5GB）
- GitHub 直接登录
- 分支管理功能强大

### 方案 3：Neon
- 新技术，体验好
- 自动休眠省钱

---

**请选择你想用的数据库，我帮你配置！**
