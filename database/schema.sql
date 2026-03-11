-- ========================================
-- 数据库表结构 - 5G消息交流论坛
-- ========================================
-- @description 包含所有数据库表的创建语句
-- @author Forum Team
-- @date 2026-03-10
-- @version 1.0.0
-- @database forum_db
-- ========================================

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS forum_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE forum_db;

-- ========================================
-- 1. 用户表
-- ========================================
-- 用途：存储用户基本信息
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    `password` VARCHAR(255) NOT NULL COMMENT '密码（加密）',
    `email` VARCHAR(100) UNIQUE COMMENT '邮箱',
    `phone` VARCHAR(20) COMMENT '手机号',
    `nickname` VARCHAR(50) COMMENT '昵称',
    `avatar` VARCHAR(255) COMMENT '头像URL',
    `signature` VARCHAR(200) COMMENT '个性签名',
    `gender` TINYINT DEFAULT 0 COMMENT '性别：0未知 1男 2女',
    `birthday` DATE COMMENT '生日',
    `location` VARCHAR(100) COMMENT '所在地',
    `points` INT UNSIGNED DEFAULT 0 COMMENT '积分',
    `level` TINYINT DEFAULT 1 COMMENT '等级',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0禁用 1正常',
    `role` TINYINT DEFAULT 0 COMMENT '角色：0普通用户 1版主 2管理员',
    `register_ip` VARCHAR(45) COMMENT '注册IP',
    `last_login_ip` VARCHAR(45) COMMENT '最后登录IP',
    `last_login_time` DATETIME COMMENT '最后登录时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_username (`username`),
    INDEX idx_email (`email`),
    INDEX idx_points (`points` DESC),
    INDEX idx_created_at (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ========================================
-- 2. 论坛板块表
-- ========================================
-- 用途：存储论坛板块信息
CREATE TABLE IF NOT EXISTS `sections` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '板块ID',
    `name` VARCHAR(50) NOT NULL COMMENT '板块名称',
    `icon` VARCHAR(50) COMMENT '板块图标',
    `description` VARCHAR(200) COMMENT '板块描述',
    `parent_id` INT UNSIGNED DEFAULT 0 COMMENT '父板块ID',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用',
    `post_count` INT UNSIGNED DEFAULT 0 COMMENT '帖子数量',
    `moderator_id` INT UNSIGNED COMMENT '版主ID',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_parent_id (`parent_id`),
    INDEX idx_sort_order (`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='论坛板块表';

-- ========================================
-- 3. 帖子表
-- ========================================
-- 用途：存储帖子信息
CREATE TABLE IF NOT EXISTS `posts` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '帖子ID',
    `section_id` INT UNSIGNED NOT NULL COMMENT '所属板块ID',
    `user_id` INT UNSIGNED NOT NULL COMMENT '发帖人ID',
    `title` VARCHAR(200) NOT NULL COMMENT '帖子标题',
    `content` TEXT NOT NULL COMMENT '帖子内容',
    `tags` VARCHAR(200) COMMENT '标签，逗号分隔',
    `type` TINYINT DEFAULT 0 COMMENT '类型：0普通帖 1精华帖 2置顶帖',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0隐藏 1正常 2锁定 3删除',
    `view_count` INT UNSIGNED DEFAULT 0 COMMENT '浏览次数',
    `like_count` INT UNSIGNED DEFAULT 0 COMMENT '点赞数',
    `comment_count` INT UNSIGNED DEFAULT 0 COMMENT '评论数',
    `collect_count` INT UNSIGNED DEFAULT 0 COMMENT '收藏数',
    `share_count` INT UNSIGNED DEFAULT 0 COMMENT '分享数',
    `last_reply_user_id` INT UNSIGNED COMMENT '最后回复用户ID',
    `last_reply_time` DATETIME COMMENT '最后回复时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_section_id (`section_id`),
    INDEX idx_user_id (`user_id`),
    INDEX idx_created_at (`created_at` DESC),
    INDEX idx_like_count (`like_count` DESC),
    INDEX idx_comment_count (`comment_count` DESC),
    INDEX idx_view_count (`view_count` DESC),
    INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='帖子表';

-- ========================================
-- 4. 评论表
-- ========================================
-- 用途：存储帖子评论信息
CREATE TABLE IF NOT EXISTS `comments` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '评论ID',
    `post_id` INT UNSIGNED NOT NULL COMMENT '帖子ID',
    `user_id` INT UNSIGNED NOT NULL COMMENT '评论人ID',
    `parent_id` INT UNSIGNED DEFAULT 0 COMMENT '父评论ID（用于楼中楼）',
    `content` TEXT NOT NULL COMMENT '评论内容',
    `like_count` INT UNSIGNED DEFAULT 0 COMMENT '点赞数',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0隐藏 1正常 2删除',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_post_id (`post_id`),
    INDEX idx_user_id (`user_id`),
    INDEX idx_parent_id (`parent_id`),
    INDEX idx_created_at (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- ========================================
-- 5. 点赞表
-- ========================================
-- 用途：记录点赞关系
CREATE TABLE IF NOT EXISTS `likes` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '点赞ID',
    `user_id` INT UNSIGNED NOT NULL COMMENT '点赞用户ID',
    `target_id` INT UNSIGNED NOT NULL COMMENT '目标ID（帖子或评论）',
    `target_type` TINYINT NOT NULL COMMENT '目标类型：1帖子 2评论',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY `uk_user_target` (`user_id`, `target_id`, `target_type`),
    INDEX idx_target_id (`target_id`),
    INDEX idx_created_at (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='点赞表';

-- ========================================
-- 6. 收藏表
-- ========================================
-- 用途：记录用户收藏的帖子
CREATE TABLE IF NOT EXISTS `collections` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '收藏ID',
    `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
    `post_id` INT UNSIGNED NOT NULL COMMENT '帖子ID',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY `uk_user_post` (`user_id`, `post_id`),
    INDEX idx_post_id (`post_id`),
    INDEX idx_created_at (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='收藏表';

-- ========================================
-- 7. 消息通知表
-- ========================================
-- 用途：存储用户消息通知
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '通知ID',
    `user_id` INT UNSIGNED NOT NULL COMMENT '接收用户ID',
    `sender_id` INT UNSIGNED COMMENT '发送用户ID',
    `type` TINYINT NOT NULL COMMENT '类型：1评论 2点赞 3收藏 4系统 5关注',
    `content` VARCHAR(500) COMMENT '通知内容',
    `target_id` INT UNSIGNED COMMENT '目标ID（帖子或评论）',
    `is_read` TINYINT DEFAULT 0 COMMENT '是否已读：0未读 1已读',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (`user_id`),
    INDEX idx_is_read (`is_read`),
    INDEX idx_created_at (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='消息通知表';

-- ========================================
-- 8. 小组表
-- ========================================
-- 用途：存储论坛小组信息
CREATE TABLE IF NOT EXISTS `groups` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '小组ID',
    `name` VARCHAR(50) NOT NULL COMMENT '小组名称',
    `description` VARCHAR(200) COMMENT '小组描述',
    `icon` VARCHAR(50) COMMENT '小组图标',
    `owner_id` INT UNSIGNED NOT NULL COMMENT '组长ID',
    `member_count` INT UNSIGNED DEFAULT 0 COMMENT '成员数量',
    `post_count` INT UNSIGNED DEFAULT 0 COMMENT '帖子数量',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0禁用 1启用',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_owner_id (`owner_id`),
    INDEX idx_member_count (`member_count` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='小组表';

-- ========================================
-- 9. 小组成员表
-- ========================================
-- 用途：记录小组成员关系
CREATE TABLE IF NOT EXISTS `group_members` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '成员ID',
    `group_id` INT UNSIGNED NOT NULL COMMENT '小组ID',
    `user_id` INT UNSIGNED NOT NULL COMMENT '用户ID',
    `role` TINYINT DEFAULT 0 COMMENT '角色：0普通成员 1管理员',
    `join_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '加入时间',
    UNIQUE KEY `uk_group_user` (`group_id`, `user_id`),
    INDEX idx_user_id (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='小组成员表';

-- ========================================
-- 10. 作品表
-- ========================================
-- 用途：存储用户发布的作品
CREATE TABLE IF NOT EXISTS `works` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '作品ID',
    `user_id` INT UNSIGNED NOT NULL COMMENT '作者ID',
    `title` VARCHAR(200) NOT NULL COMMENT '作品标题',
    `description` TEXT COMMENT '作品描述',
    `cover_image` VARCHAR(255) COMMENT '封面图URL',
    `images` TEXT COMMENT '作品图片，JSON格式',
    `category` VARCHAR(50) COMMENT '作品分类',
    `view_count` INT UNSIGNED DEFAULT 0 COMMENT '浏览次数',
    `like_count` INT UNSIGNED DEFAULT 0 COMMENT '点赞数',
    `comment_count` INT UNSIGNED DEFAULT 0 COMMENT '评论数',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0隐藏 1正常 2删除',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_user_id (`user_id`),
    INDEX idx_category (`category`),
    INDEX idx_like_count (`like_count` DESC),
    INDEX idx_created_at (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='作品表';

-- ========================================
-- 11. 文件上传表
-- ========================================
-- 用途：记录用户上传的文件信息
CREATE TABLE IF NOT EXISTS `files` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '文件ID',
    `user_id` INT UNSIGNED NOT NULL COMMENT '上传用户ID',
    `original_name` VARCHAR(255) NOT NULL COMMENT '原始文件名',
    `stored_name` VARCHAR(255) NOT NULL COMMENT '存储文件名',
    `file_path` VARCHAR(500) NOT NULL COMMENT '文件路径',
    `file_size` BIGINT UNSIGNED NOT NULL COMMENT '文件大小（字节）',
    `file_type` VARCHAR(50) NOT NULL COMMENT '文件类型',
    `mime_type` VARCHAR(100) COMMENT 'MIME类型',
    `usage` VARCHAR(50) COMMENT '用途：avatar, post, comment, work等',
    `status` TINYINT DEFAULT 1 COMMENT '状态：0删除 1正常',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (`user_id`),
    INDEX idx_usage (`usage`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文件上传表';

-- ========================================
-- 12. 系统配置表
-- ========================================
-- 用途：存储系统配置信息
CREATE TABLE IF NOT EXISTS `configs` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '配置ID',
    `key` VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    `value` TEXT COMMENT '配置值',
    `description` VARCHAR(200) COMMENT '配置描述',
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- ========================================
-- 13. 日志表
-- ========================================
-- 用途：记录系统操作日志
CREATE TABLE IF NOT EXISTS `logs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '日志ID',
    `user_id` INT UNSIGNED COMMENT '操作用户ID',
    `action` VARCHAR(50) NOT NULL COMMENT '操作类型',
    `module` VARCHAR(50) COMMENT '操作模块',
    `description` TEXT COMMENT '操作描述',
    `ip` VARCHAR(45) COMMENT '操作IP',
    `user_agent` VARCHAR(500) COMMENT '用户代理',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_user_id (`user_id`),
    INDEX idx_action (`action`),
    INDEX idx_created_at (`created_at` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='日志表';

-- ========================================
-- 14. 关注/粉丝表
-- ========================================
-- 用途：记录用户关注关系
CREATE TABLE IF NOT EXISTS `follows` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '关注ID',
    `follower_id` INT UNSIGNED NOT NULL COMMENT '关注者ID',
    `following_id` INT UNSIGNED NOT NULL COMMENT '被关注者ID',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY `uk_follower_following` (`follower_id`, `following_id`),
    INDEX idx_following_id (`following_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='关注/粉丝表';

-- ========================================
-- 15. 标签表
-- ========================================
-- 用途：存储帖子标签
CREATE TABLE IF NOT EXISTS `tags` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '标签ID',
    `name` VARCHAR(50) NOT NULL UNIQUE COMMENT '标签名称',
    `post_count` INT UNSIGNED DEFAULT 0 COMMENT '使用次数',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    INDEX idx_name (`name`),
    INDEX idx_post_count (`post_count` DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- ========================================
-- 16. 帖子标签关联表
-- ========================================
-- 用途：记录帖子与标签的多对多关系
CREATE TABLE IF NOT EXISTS `post_tags` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '关联ID',
    `post_id` INT UNSIGNED NOT NULL COMMENT '帖子ID',
    `tag_id` INT UNSIGNED NOT NULL COMMENT '标签ID',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    UNIQUE KEY `uk_post_tag` (`post_id`, `tag_id`),
    INDEX idx_tag_id (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='帖子标签关联表';
