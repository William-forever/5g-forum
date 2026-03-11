# 数据库说明文档

## 📚 概述

本文档详细说明了5G消息交流论坛的数据库结构、表设计规范以及使用方法。

## 📊 数据库基本信息

- **数据库名称**: `forum_db`
- **字符集**: `utf8mb4`
- **排序规则**: `utf8mb4_unicode_ci`
- **存储引擎**: `InnoDB`
- **版本**: 1.0.0

## 📋 表结构说明

### 1. users（用户表）

**用途**: 存储用户基本信息和账号数据

| 字段名 | 类型 | 说明 | 索引 |
|--------|------|------|------|
| id | INT UNSIGNED | 用户ID（主键） | PRIMARY |
| username | VARCHAR(50) | 用户名 | UNIQUE |
| password | VARCHAR(255) | 密码（加密） | - |
| email | VARCHAR(100) | 邮箱 | UNIQUE |
| phone | VARCHAR(20) | 手机号 | - |
| nickname | VARCHAR(50) | 昵称 | - |
| avatar | VARCHAR(255) | 头像URL | - |
| signature | VARCHAR(200) | 个性签名 | - |
| points | INT UNSIGNED | 积分 | INDEX |
| level | TINYINT | 等级 | - |
| status | TINYINT | 状态：0禁用 1正常 | - |
| role | TINYINT | 角色：0普通 1版主 2管理员 | - |
| created_at | DATETIME | 创建时间 | INDEX |

**索引设计**:
- `idx_username`: 用户名索引，用于登录查询
- `idx_email`: 邮箱索引，用于邮箱验证
- `idx_points`: 积分索引，用于排行榜查询

---

### 2. sections（论坛板块表）

**用途**: 存储论坛板块信息

| 字段名 | 类型 | 说明 | 索引 |
|--------|------|------|------|
| id | INT UNSIGNED | 板块ID（主键） | PRIMARY |
| name | VARCHAR(50) | 板块名称 | - |
| icon | VARCHAR(50) | 板块图标（emoji） | - |
| parent_id | INT UNSIGNED | 父板块ID | INDEX |
| sort_order | INT | 排序 | INDEX |
| post_count | INT UNSIGNED | 帖子数量 | - |

---

### 3. posts（帖子表）

**用途**: 存储帖子的所有信息

| 字段名 | 类型 | 说明 | 索引 |
|--------|------|------|------|
| id | INT UNSIGNED | 帖子ID（主键） | PRIMARY |
| section_id | INT UNSIGNED | 所属板块ID | INDEX |
| user_id | INT UNSIGNED | 发帖人ID | INDEX |
| title | VARCHAR(200) | 帖子标题 | - |
| content | TEXT | 帖子内容 | - |
| type | TINYINT | 类型：0普通 1精华 2置顶 | - |
| status | TINYINT | 状态：0隐藏 1正常 2锁定 | INDEX |
| view_count | INT UNSIGNED | 浏览次数 | INDEX |
| like_count | INT UNSIGNED | 点赞数 | INDEX |
| comment_count | INT UNSIGNED | 评论数 | INDEX |
| created_at | DATETIME | 创建时间 | INDEX |

**索引设计**:
- `idx_section_id`: 板块索引，用于板块内帖子查询
- `idx_created_at`: 创建时间索引，用于时间排序
- `idx_like_count`: 点赞数索引，用于热门排序
- `idx_comment_count`: 评论数索引，用于热门排序

---

### 4. comments（评论表）

**用途**: 存储帖子的评论信息

| 字段名 | 类型 | 说明 | 索引 |
|--------|------|------|------|
| id | INT UNSIGNED | 评论ID（主键） | PRIMARY |
| post_id | INT UNSIGNED | 帖子ID | INDEX |
| user_id | INT UNSIGNED | 评论人ID | INDEX |
| parent_id | INT UNSIGNED | 父评论ID（楼中楼） | INDEX |
| content | TEXT | 评论内容 | - |
| like_count | INT UNSIGNED | 点赞数 | - |
| created_at | DATETIME | 创建时间 | INDEX |

---

### 5. likes（点赞表）

**用途**: 记录用户对帖子和评论的点赞关系

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | INT UNSIGNED | 点赞ID（主键） | PRIMARY |
| user_id | INT UNSIGNED | 点赞用户ID | UNIQUE |
| target_id | INT UNSIGNED | 目标ID | UNIQUE |
| target_type | TINYINT | 目标类型：1帖子 2评论 | UNIQUE |

**唯一索引**: `uk_user_target(user_id, target_id, target_type)` 防止重复点赞

---

### 6. collections（收藏表）

**用途**: 记录用户收藏的帖子

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | INT UNSIGNED | 收藏ID（主键） | PRIMARY |
| user_id | INT UNSIGNED | 用户ID | UNIQUE |
| post_id | INT UNSIGNED | 帖子ID | UNIQUE |

---

### 7. notifications（消息通知表）

**用途**: 存储用户的系统通知

| 字段名 | 类型 | 说明 | 索引 |
|--------|------|------|------|
| id | INT UNSIGNED | 通知ID（主键） | PRIMARY |
| user_id | INT UNSIGNED | 接收用户ID | INDEX |
| sender_id | INT UNSIGNED | 发送用户ID | - |
| type | TINYINT | 通知类型 | - |
| content | VARCHAR(500) | 通知内容 | - |
| is_read | TINYINT | 是否已读：0未读 1已读 | INDEX |
| created_at | DATETIME | 创建时间 | INDEX |

---

### 8. groups（小组表）

**用途**: 存储论坛小组信息

| 字段名 | 类型 | 说明 | 索引 |
|--------|------|------|------|
| id | INT UNSIGNED | 小组ID（主键） | PRIMARY |
| name | VARCHAR(50) | 小组名称 | - |
| description | VARCHAR(200) | 小组描述 | - |
| owner_id | INT UNSIGNED | 组长ID | INDEX |
| member_count | INT UNSIGNED | 成员数量 | INDEX |
| post_count | INT UNSIGNED | 帖子数量 | - |

---

### 9. group_members（小组成员表）

**用途**: 记录小组成员关系

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | INT UNSIGNED | 成员ID（主键） | PRIMARY |
| group_id | INT UNSIGNED | 小组ID | UNIQUE |
| user_id | INT UNSIGNED | 用户ID | UNIQUE |
| role | TINYINT | 角色：0普通成员 1管理员 | - |

---

### 10. works（作品表）

**用途**: 存储用户发布的作品

| 字段名 | 类型 | 说明 | 索引 |
|--------|------|------|------|
| id | INT UNSIGNED | 作品ID（主键） | PRIMARY |
| user_id | INT UNSIGNED | 作者ID | INDEX |
| title | VARCHAR(200) | 作品标题 | - |
| description | TEXT | 作品描述 | - |
| cover_image | VARCHAR(255) | 封面图URL | - |
| category | VARCHAR(50) | 作品分类 | INDEX |
| view_count | INT UNSIGNED | 浏览次数 | - |
| like_count | INT UNSIGNED | 点赞数 | INDEX |
| comment_count | INT UNSIGNED | 评论数 | - |

---

### 11. files（文件上传表）

**用途**: 记录用户上传的文件信息

| 字段名 | 类型 | 说明 | 索引 |
|--------|------|------|------|
| id | INT UNSIGNED | 文件ID（主键） | PRIMARY |
| user_id | INT UNSIGNED | 上传用户ID | INDEX |
| original_name | VARCHAR(255) | 原始文件名 | - |
| stored_name | VARCHAR(255) | 存储文件名 | - |
| file_path | VARCHAR(500) | 文件路径 | - |
| file_size | BIGINT | 文件大小（字节） | - |
| file_type | VARCHAR(50) | 文件类型 | - |
| usage | VARCHAR(50) | 用途：avatar, post等 | INDEX |

---

### 12. configs（系统配置表）

**用途**: 存储系统配置信息

| 字段名 | 类型 | 说明 | 索引 |
|--------|------|------|------|
| id | INT UNSIGNED | 配置ID（主键） | PRIMARY |
| key | VARCHAR(100) | 配置键 | UNIQUE |
| value | TEXT | 配置值 | - |
| description | VARCHAR(200) | 配置描述 | - |

---

### 13. logs（日志表）

**用途**: 记录系统操作日志

| 字段名 | 类型 | 说明 | 索引 |
|--------|------|------|------|
| id | BIGINT UNSIGNED | 日志ID（主键） | PRIMARY |
| user_id | INT UNSIGNED | 操作用户ID | INDEX |
| action | VARCHAR(50) | 操作类型 | INDEX |
| module | VARCHAR(50) | 操作模块 | - |
| description | TEXT | 操作描述 | - |
| ip | VARCHAR(45) | 操作IP | - |
| created_at | DATETIME | 创建时间 | INDEX |

---

### 14. follows（关注/粉丝表）

**用途**: 记录用户关注关系

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | INT UNSIGNED | 关注ID（主键） | PRIMARY |
| follower_id | INT UNSIGNED | 关注者ID | UNIQUE |
| following_id | INT UNSIGNED | 被关注者ID | UNIQUE |

---

### 15. tags（标签表）

**用途**: 存储帖子标签

| 字段名 | 类型 | 说明 | 索引 |
|--------|------|------|------|
| id | INT UNSIGNED | 标签ID（主键） | PRIMARY |
| name | VARCHAR(50) | 标签名称 | UNIQUE, INDEX |
| post_count | INT UNSIGNED | 使用次数 | INDEX |

---

### 16. post_tags（帖子标签关联表）

**用途**: 记录帖子与标签的多对多关系

| 字段名 | 类型 | 说明 | 约束 |
|--------|------|------|------|
| id | INT UNSIGNED | 关联ID（主键） | PRIMARY |
| post_id | INT UNSIGNED | 帖子ID | UNIQUE |
| tag_id | INT UNSIGNED | 标签ID | UNIQUE |

---

## 🚀 使用方法

### 1. 创建数据库

```bash
# 登录MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE forum_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 退出
exit;
```

### 2. 导入表结构

```bash
# 导入表结构
mysql -u root -p forum_db < database/schema.sql
```

### 3. 导入初始数据

```bash
# 导入测试数据
mysql -u root -p forum_db < database/data.sql
```

### 4. 一键导入

```bash
# 同时导入表结构和数据
mysql -u root -p forum_db < database/schema.sql
mysql -u root -p forum_db < database/data.sql
```

---

## 📝 数据库维护

### 备份数据库

```bash
# 备份整个数据库
mysqldump -u root -p forum_db > backup_$(date +%Y%m%d).sql

# 仅备份数据
mysqldump -u root -p --no-create-info forum_db > data_backup.sql

# 仅备份结构
mysqldump -u root -p --no-data forum_db > schema_backup.sql
```

### 恢复数据库

```bash
# 恢复数据库
mysql -u root -p forum_db < backup_20260310.sql
```

### 更新统计数据

```sql
-- 更新板块帖子数
UPDATE sections s 
SET post_count = (SELECT COUNT(*) FROM posts p WHERE p.section_id = s.id AND p.status = 1);

-- 更新标签使用次数
UPDATE tags t 
SET post_count = (SELECT COUNT(*) FROM post_tags pt WHERE pt.tag_id = t.id);
```

---

## 🔧 性能优化建议

1. **索引优化**: 已为常用查询字段添加索引，定期检查索引使用情况
2. **分表分库**: 当数据量较大时，考虑按时间或用户ID进行分表
3. **缓存**: 对热门数据（如热门帖子、排行榜）使用Redis缓存
4. **读写分离**: 使用主从复制，查询走从库，写操作走主库

---

## 📊 数据库设计原则

1. **规范化**: 遵循第三范式，避免数据冗余
2. **索引**: 为常用查询字段添加合适的索引
3. **约束**: 使用外键约束保证数据完整性
4. **字符集**: 统一使用utf8mb4，支持emoji等特殊字符
5. **时间字段**: 所有表都包含created_at和updated_at字段

---

## 📞 技术支持

如有数据库相关问题，请联系技术团队。

---

## © 版权信息

Copyright © 2026 中移互5G消息交流论坛. All rights reserved.
