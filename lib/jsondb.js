/**
 * ========================================
 * JSON 文件数据库 - Netlify 兼容版
 * ========================================
 * @description 使用内存存储，适配 Serverless 环境
 * @date 2026-03-10
 * @version 2.0.0
 */

// 内存存储（Serverless 环境下文件写入受限）
let usersData = [];
let postsData = [];

// 初始化示例数据
function initSampleData() {
  if (usersData.length === 0) {
    usersData = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@5gforum.com',
        password: '$2a$10$YourHashedPasswordHere',
        points: 1000,
        role: 'admin',
        createdAt: new Date().toISOString()
      }
    ];
  }

  if (postsData.length === 0) {
    postsData = [
      {
        id: '1',
        title: '5G消息在金融行业的应用实践与案例分析',
        content: '本文详细介绍了5G消息在银行业的应用场景...',
        category: '行业动态',
        author: '李明',
        authorId: '2',
        likes: 128,
        comments: 56,
        views: 2300,
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '2',
        title: '如何优化5G消息的推送到达率？经验分享',
        content: '在实际项目中，我们发现以下方法可以有效提升到达率...',
        category: '技术交流',
        author: '张伟',
        authorId: '3',
        likes: 96,
        comments: 42,
        views: 1800,
        createdAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: '3',
        title: '2026年第一季度5G消息服务采购项目招标公告',
        content: '招标单位：中国移动通信集团...',
        category: '招投标信息',
        author: '王芳',
        authorId: '4',
        likes: 67,
        comments: 38,
        views: 1500,
        createdAt: new Date(Date.now() - 259200000).toISOString()
      },
      {
        id: '4',
        title: 'AI Agent在5G消息场景下的创新应用探讨',
        content: '随着大模型技术的发展，AI Agent与5G消息的结合...',
        category: 'agent交流广场',
        author: '陈强',
        authorId: '5',
        likes: 145,
        comments: 89,
        views: 3200,
        createdAt: new Date(Date.now() - 345600000).toISOString()
      }
    ];
  }
}

/**
 * 用户相关操作
 */
export const usersDB = {
  getAll() {
    initSampleData();
    return usersData;
  },

  findByUsername(username) {
    initSampleData();
    return usersData.find(u => u.username === username);
  },

  findByEmail(email) {
    initSampleData();
    return usersData.find(u => u.email === email);
  },

  findById(id) {
    initSampleData();
    return usersData.find(u => u.id === id);
  },

  create(user) {
    initSampleData();
    user.id = Date.now().toString();
    user.createdAt = new Date().toISOString();
    usersData.push(user);
    return user;
  },

  update(id, updates) {
    initSampleData();
    const index = usersData.findIndex(u => u.id === id);
    if (index !== -1) {
      usersData[index] = { ...usersData[index], ...updates };
      return usersData[index];
    }
    return null;
  }
};

/**
 * 文章相关操作
 */
export const postsDB = {
  getAll() {
    initSampleData();
    return postsData;
  },

  findById(id) {
    initSampleData();
    return postsData.find(p => p.id === id);
  },

  findByCategory(category) {
    initSampleData();
    return postsData.filter(p => p.category === category);
  },

  create(post) {
    initSampleData();
    post.id = Date.now().toString();
    post.likes = 0;
    post.comments = 0;
    post.views = 0;
    post.createdAt = new Date().toISOString();
    post.updatedAt = new Date().toISOString();
    postsData.unshift(post);
    return post;
  },

  update(id, updates) {
    initSampleData();
    const index = postsData.findIndex(p => p.id === id);
    if (index !== -1) {
      postsData[index] = { ...postsData[index], ...updates, updatedAt: new Date().toISOString() };
      return postsData[index];
    }
    return null;
  },

  delete(id) {
    initSampleData();
    const filtered = postsData.filter(p => p.id !== id);
    const deleted = filtered.length < postsData.length;
    postsData = filtered;
    return deleted;
  },

  getPage(page = 1, limit = 10, category = null) {
    initSampleData();
    let posts = [...postsData];
    if (category) {
      posts = posts.filter(p => p.category === category);
    }
    const total = posts.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      posts: posts.slice(start, end),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  incrementViews(id) {
    const post = this.findById(id);
    if (post) {
      post.views = (post.views || 0) + 1;
      this.update(id, { views: post.views });
    }
    return post;
  },

  incrementLikes(id) {
    const post = this.findById(id);
    if (post) {
      post.likes = (post.likes || 0) + 1;
      this.update(id, { likes: post.likes });
    }
    return post;
  }
};

export { initSampleData };
