/**
 * ========================================
 * LeanCloud 核心模块
 * ========================================
 * @description 封装 LeanCloud SDK 常用操作
 * @date 2026-03-10
 * @version 1.0.0
 */

// LeanCloud 配置
const LEANCLOUD_CONFIG = {
    appId: 'YOUR_APP_ID',      // 请替换为你的 App ID
    appKey: 'YOUR_APP_KEY',    // 请替换为你的 App Key
    serverURL: 'https://YOUR_APP_ID.lc-cn-n1-shared.com'
};

/**
 * 初始化 LeanCloud
 */
function initLeanCloud() {
    if (typeof AV === 'undefined') {
        console.error('LeanCloud SDK 未加载');
        return false;
    }
    
    AV.init({
        appId: LEANCLOUD_CONFIG.appId,
        appKey: LEANCLOUD_CONFIG.appKey,
        serverURL: LEANCLOUD_CONFIG.serverURL
    });
    
    console.log('LeanCloud 初始化成功');
    return true;
}

/**
 * 用户注册
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @param {string} email - 邮箱
 * @returns {Promise} - 返回注册结果
 */
async function registerUser(username, password, email) {
    try {
        const user = new AV.User();
        user.setUsername(username);
        user.setPassword(password);
        user.setEmail(email);
        
        const result = await user.signUp();
        return {
            success: true,
            user: {
                id: result.id,
                username: result.getUsername(),
                email: result.getEmail()
            }
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

/**
 * 用户登录
 * @param {string} username - 用户名
 * @param {string} password - 密码
 * @returns {Promise} - 返回登录结果
 */
async function loginUser(username, password) {
    try {
        const user = await AV.User.logIn(username, password);
        return {
            success: true,
            user: {
                id: user.id,
                username: user.getUsername(),
                email: user.getEmail()
            }
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

/**
 * 用户登出
 */
function logoutUser() {
    AV.User.logOut();
}

/**
 * 获取当前登录用户
 * @returns {Object|null} - 返回当前用户信息或 null
 */
function getCurrentUser() {
    const user = AV.User.current();
    if (user) {
        return {
            id: user.id,
            username: user.getUsername(),
            email: user.getEmail()
        };
    }
    return null;
}

/**
 * 检查用户是否已登录
 * @returns {boolean}
 */
function isLoggedIn() {
    return AV.User.current() !== null;
}

/**
 * 创建文章
 * @param {Object} postData - 文章数据
 * @returns {Promise} - 返回创建结果
 */
async function createPost(postData) {
    try {
        const Post = AV.Object.extend('Post');
        const post = new Post();
        
        post.set('title', postData.title);
        post.set('content', postData.content);
        post.set('category', postData.category);
        post.set('author', AV.User.current());
        post.set('likes', 0);
        post.set('comments', 0);
        post.set('views', 0);
        
        const result = await post.save();
        return {
            success: true,
            postId: result.id
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

/**
 * 获取文章列表
 * @param {number} page - 页码
 * @param {number} limit - 每页数量
 * @returns {Promise} - 返回文章列表
 */
async function getPosts(page = 1, limit = 10) {
    try {
        const query = new AV.Query('Post');
        query.descending('createdAt');
        query.include('author');
        query.limit(limit);
        query.skip((page - 1) * limit);
        
        const posts = await query.find();
        return {
            success: true,
            posts: posts.map(post => ({
                id: post.id,
                title: post.get('title'),
                content: post.get('content'),
                category: post.get('category'),
                likes: post.get('likes') || 0,
                comments: post.get('comments') || 0,
                views: post.get('views') || 0,
                author: post.get('author') ? post.get('author').get('username') : '未知用户',
                createdAt: post.get('createdAt')
            }))
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

/**
 * 获取单篇文章
 * @param {string} postId - 文章ID
 * @returns {Promise} - 返回文章详情
 */
async function getPost(postId) {
    try {
        const query = new AV.Query('Post');
        query.include('author');
        const post = await query.get(postId);
        
        // 增加浏览量
        post.increment('views');
        post.save();
        
        return {
            success: true,
            post: {
                id: post.id,
                title: post.get('title'),
                content: post.get('content'),
                category: post.get('category'),
                likes: post.get('likes') || 0,
                comments: post.get('comments') || 0,
                views: post.get('views') || 0,
                author: post.get('author') ? post.get('author').get('username') : '未知用户',
                createdAt: post.get('createdAt')
            }
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

/**
 * 删除文章
 * @param {string} postId - 文章ID
 * @returns {Promise} - 返回删除结果
 */
async function deletePost(postId) {
    try {
        const post = AV.Object.createWithoutData('Post', postId);
        await post.destroy();
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

/**
 * 点赞文章
 * @param {string} postId - 文章ID
 * @returns {Promise} - 返回点赞结果
 */
async function likePost(postId) {
    try {
        const post = AV.Object.createWithoutData('Post', postId);
        post.increment('likes');
        await post.save();
        return {
            success: true
        };
    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AV !== 'undefined') {
        initLeanCloud();
    }
});
