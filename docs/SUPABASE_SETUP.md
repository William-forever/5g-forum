# Supabase 使用指南

## 第一步：创建 Supabase 项目

1. 访问 https://supabase.com
2. 点击 **"Start your project"**
3. 选择 **"Continue with GitHub"**（推荐）或邮箱注册
4. 创建新项目：
   - **Name**: `5g-forum`
   - **Database Password**: 设置一个强密码（记住它！）
   - **Region**: 选择 **Singapore（新加坡）**（国内访问快）
5. 点击 **Create new project**

## 第二步：获取连接信息

创建完成后（约 1-2 分钟）：

1. 点击左侧 **Project Settings**（齿轮图标）
2. 选择 **Database**
3. 找到 **Connection string** 部分
4. 复制 **URI** 格式的连接字符串：
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```

## 第三步：创建数据表

1. 点击左侧 **Table Editor**
2. 创建 `users` 表：
   ```sql
   CREATE TABLE users (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     username VARCHAR(50) UNIQUE NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     password VARCHAR(255) NOT NULL,
     points INTEGER DEFAULT 0,
     role VARCHAR(20) DEFAULT 'user',
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. 创建 `posts` 表：
   ```sql
   CREATE TABLE posts (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title VARCHAR(200) NOT NULL,
     content TEXT NOT NULL,
     category VARCHAR(50) NOT NULL,
     author VARCHAR(50) NOT NULL,
     author_id UUID REFERENCES users(id),
     likes INTEGER DEFAULT 0,
     comments INTEGER DEFAULT 0,
     views INTEGER DEFAULT 0,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

4. 创建 `comments` 表：
   ```sql
   CREATE TABLE comments (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
     content TEXT NOT NULL,
     author VARCHAR(50) NOT NULL,
     author_id UUID REFERENCES users(id),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

## 第四步：配置环境变量

在 Netlify 中添加环境变量：
- `SUPABASE_URL`: 你的 Supabase URL
- `SUPABASE_ANON_KEY`: 你的 Supabase Anon Key
- `JWT_SECRET`: 任意密钥（用于 JWT 签名）

## 第五步：修改代码

我会帮你修改代码，使用 Supabase 替代内存存储。

---

完成第一步后，把连接字符串发给我！
