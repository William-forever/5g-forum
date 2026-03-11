# API接口文档

## 📚 概述

本文档详细说明了新消息交流论坛的前后端API接口规范。

## 🔗 基础信息

- **基础URL**: `http://localhost:8000/api`
- **数据格式**: JSON
- **字符编码**: UTF-8
- **时间格式**: `YYYY-MM-DD HH:mm:ss`

## 📋 通用规范

### 请求格式

```json
{
  "data": {},
  "timestamp": 1700000000
}
```

### 响应格式

#### 成功响应

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

#### 错误响应

```json
{
  "code": 400,
  "message": "error message",
  "data": null
}
```

### 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 👤 用户模块

### 1. 用户注册

**接口**: `POST /auth/register`

**请求参数**:
```json
{
  "username": "testuser",
  "password": "password123",
  "email": "test@example.com",
  "phone": "13800138000"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "user_id": 1,
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

---

### 2. 用户登录

**接口**: `POST /auth/login`

**请求参数**:
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "testuser",
      "nickname": "测试用户",
      "avatar": "/uploads/avatars/1.jpg"
    }
  }
}
```

---

### 3. 获取用户信息

**接口**: `GET /user/info`

**请求头**:
```
Authorization: Bearer {token}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "testuser",
    "nickname": "测试用户",
    "email": "test@example.com",
    "phone": "13800138000",
    "avatar": "/uploads/avatars/1.jpg",
    "signature": "个性签名",
    "points": 12580,
    "level": 5,
    "created_at": "2026-01-01 10:00:00"
  }
}
```

---

### 4. 更新用户信息

**接口**: `PUT /user/update`

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "nickname": "新昵称",
  "signature": "新签名",
  "gender": 1
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "更新成功",
  "data": null
}
```

---

## 📝 帖子模块

### 1. 获取帖子列表

**接口**: `GET /posts`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认1 |
| limit | int | 否 | 每页数量，默认10 |
| section_id | int | 否 | 板块ID |
| type | int | 否 | 类型：0普通 1精华 2置顶 |
| sort | string | 否 | 排序：latest, hot, popular |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "list": [
      {
        "id": 1,
        "title": "新消息在金融行业的应用实践",
        "content": "帖子内容...",
        "section_id": 1,
        "section_name": "行业动态",
        "user_id": 1,
        "user": {
          "id": 1,
          "username": "testuser",
          "nickname": "测试用户",
          "avatar": "/uploads/avatars/1.jpg"
        },
        "view_count": 2300,
        "like_count": 128,
        "comment_count": 56,
        "created_at": "2026-03-10 10:00:00"
      }
    ]
  }
}
```

---

### 2. 获取帖子详情

**接口**: `GET /posts/{id}`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "新消息在金融行业的应用实践",
    "content": "帖子内容...",
    "section_id": 1,
    "user_id": 1,
    "user": {
      "id": 1,
      "username": "testuser",
      "nickname": "测试用户",
      "avatar": "/uploads/avatars/1.jpg"
    },
    "view_count": 2300,
    "like_count": 128,
    "comment_count": 56,
    "is_liked": false,
    "is_collected": false,
    "created_at": "2026-03-10 10:00:00",
    "updated_at": "2026-03-10 11:00:00"
  }
}
```

---

### 3. 发布帖子

**接口**: `POST /posts`

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "section_id": 1,
  "title": "帖子标题",
  "content": "帖子内容",
  "tags": "新消息,金融行业"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "发布成功",
  "data": {
    "post_id": 100
  }
}
```

---

### 4. 更新帖子

**接口**: `PUT /posts/{id}`

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "title": "新标题",
  "content": "新内容",
  "tags": "新标签"
}
```

---

### 5. 删除帖子

**接口**: `DELETE /posts/{id}`

**请求头**:
```
Authorization: Bearer {token}
```

---

## 💬 评论模块

### 1. 获取评论列表

**接口**: `GET /posts/{post_id}/comments`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认1 |
| limit | int | 否 | 每页数量，默认20 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "list": [
      {
        "id": 1,
        "post_id": 1,
        "content": "评论内容",
        "parent_id": 0,
        "user_id": 1,
        "user": {
          "id": 1,
          "username": "testuser",
          "nickname": "测试用户",
          "avatar": "/uploads/avatars/1.jpg"
        },
        "like_count": 10,
        "created_at": "2026-03-10 10:30:00"
      }
    ]
  }
}
```

---

### 2. 发表评论

**接口**: `POST /posts/{post_id}/comments`

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "content": "评论内容",
  "parent_id": 0
}
```

---

### 3. 删除评论

**接口**: `DELETE /comments/{id}`

**请求头**:
```
Authorization: Bearer {token}
```

---

## 👍 点赞模块

### 1. 点赞帖子/评论

**接口**: `POST /likes`

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "target_id": 1,
  "target_type": 1
}
```

**说明**: target_type: 1帖子 2评论

---

### 2. 取消点赞

**接口**: `DELETE /likes`

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "target_id": 1,
  "target_type": 1
}
```

---

## ⭐ 收藏模块

### 1. 收藏帖子

**接口**: `POST /collections`

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
```json
{
  "post_id": 1
}
```

---

### 2. 取消收藏

**接口**: `DELETE /collections/{post_id}`

**请求头**:
```
Authorization: Bearer {token}
```

---

### 3. 获取收藏列表

**接口**: `GET /collections`

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认1 |
| limit | int | 否 | 每页数量，默认20 |

---

## 📊 板块模块

### 1. 获取板块列表

**接口**: `GET /sections`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "name": "行业动态",
      "icon": "📰",
      "description": "新消息行业最新动态和新闻资讯",
      "parent_id": 0,
      "post_count": 100
    }
  ]
}
```

---

### 2. 获取板块详情

**接口**: `GET /sections/{id}`

---

## 🔔 通知模块

### 1. 获取通知列表

**接口**: `GET /notifications`

**请求头**:
```
Authorization: Bearer {token}
```

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | int | 否 | 页码，默认1 |
| limit | int | 否 | 每页数量，默认20 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 50,
    "unread_count": 10,
    "list": [
      {
        "id": 1,
        "type": 1,
        "content": "用户A评论了你的帖子",
        "target_id": 1,
        "is_read": false,
        "created_at": "2026-03-10 10:00:00"
      }
    ]
  }
}
```

---

### 2. 标记已读

**接口**: `PUT /notifications/{id}/read`

**请求头**:
```
Authorization: Bearer {token}
```

---

### 3. 全部标记已读

**接口**: `PUT /notifications/read-all`

**请求头**:
```
Authorization: Bearer {token}
```

---

## 🔍 搜索模块

### 1. 搜索帖子

**接口**: `GET /search/posts`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 是 | 搜索关键词 |
| page | int | 否 | 页码，默认1 |
| limit | int | 否 | 每页数量，默认10 |

---

### 2. 搜索用户

**接口**: `GET /search/users`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| keyword | string | 是 | 搜索关键词 |
| page | int | 否 | 页码，默认1 |
| limit | int | 否 | 每页数量，默认10 |

---

## 📤 文件上传模块

### 1. 上传文件

**接口**: `POST /upload`

**请求头**:
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | file | 是 | 上传的文件 |
| usage | string | 否 | 用途：avatar, post, comment |

**响应示例**:
```json
{
  "code": 200,
  "message": "上传成功",
  "data": {
    "file_id": 1,
    "file_path": "/uploads/2026/03/10/xxx.jpg",
    "url": "http://localhost:8000/uploads/2026/03/10/xxx.jpg"
  }
}
```

---

## 📈 统计模块

### 1. 获取排行榜

**接口**: `GET /statistics/ranking`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 否 | 类型：points, posts, likes |
| limit | int | 否 | 数量，默认10 |

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "user_id": 1,
      "username": "testuser",
      "nickname": "测试用户",
      "avatar": "/uploads/avatars/1.jpg",
      "value": 12580
    }
  ]
}
```

---

## 🏷️ 标签模块

### 1. 获取热门标签

**接口**: `GET /tags/hot`

**请求参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| limit | int | 否 | 数量，默认20 |

---

## 👥 小组模块

### 1. 获取小组列表

**接口**: `GET /groups`

---

### 2. 获取小组详情

**接口**: `GET /groups/{id}`

---

### 3. 加入小组

**接口**: `POST /groups/{id}/join`

**请求头**:
```
Authorization: Bearer {token}
```

---

### 4. 退出小组

**接口**: `POST /groups/{id}/leave`

**请求头**:
```
Authorization: Bearer {token}
```

---

## 🔐 错误码说明

| 错误码 | 说明 |
|--------|------|
| 1000 | 参数错误 |
| 1001 | 用户名已存在 |
| 1002 | 邮箱已存在 |
| 1003 | 用户名或密码错误 |
| 1004 | 未登录 |
| 1005 | 无权限 |
| 1006 | 资源不存在 |
| 2000 | 帖子不存在 |
| 2001 | 不能重复点赞 |
| 2002 | 不能重复收藏 |
| 3000 | 文件上传失败 |
| 3001 | 文件类型不允许 |
| 3002 | 文件大小超限 |

---

## 📞 技术支持

如有API相关问题，请联系技术团队。

---

## © 版权信息

Copyright © 2026 中移互新消息交流论坛. All rights reserved.
