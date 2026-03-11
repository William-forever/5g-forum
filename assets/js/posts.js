/**
 * ========================================
 * 帖子交互模块 - 5G消息交流论坛
 * ========================================
 * @description 处理帖子的交互功能（点赞、评论、收藏等）
 * @author Forum Team
 * @date 2026-03-10
 * @version 1.0.0
 */

// ========================================
// 帖子操作API
// ========================================

/**
 * 点赞帖子
 * @param {number} postId - 帖子ID
 * @returns {Promise} Promise对象
 */
async function likePost(postId) {
    try {
        const response = await fetch('/api/posts/like', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post_id: postId })
        });
        
        const result = await response.json();
        
        if (result.code === 200) {
            return result.data;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('点赞失败:', error);
        throw error;
    }
}

/**
 * 取消点赞帖子
 * @param {number} postId - 帖子ID
 * @returns {Promise} Promise对象
 */
async function unlikePost(postId) {
    try {
        const response = await fetch(`/api/posts/${postId}/unlike`, {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.code === 200) {
            return result.data;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('取消点赞失败:', error);
        throw error;
    }
}

/**
 * 收藏帖子
 * @param {number} postId - 帖子ID
 * @returns {Promise} Promise对象
 */
async function collectPost(postId) {
    try {
        const response = await fetch('/api/collections', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ post_id: postId })
        });
        
        const result = await response.json();
        
        if (result.code === 200) {
            return result.data;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('收藏失败:', error);
        throw error;
    }
}

/**
 * 取消收藏帖子
 * @param {number} postId - 帖子ID
 * @returns {Promise} Promise对象
 */
async function uncollectPost(postId) {
    try {
        const response = await fetch(`/api/collections/${postId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.code === 200) {
            return result.data;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('取消收藏失败:', error);
        throw error;
    }
}

/**
 * 增加浏览量
 * @param {number} postId - 帖子ID
 * @returns {Promise} Promise对象
 */
async function incrementViewCount(postId) {
    try {
        const response = await fetch(`/api/posts/${postId}/view`, {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (result.code === 200) {
            return result.data;
        }
    } catch (error) {
        console.error('增加浏览量失败:', error);
    }
}

// ========================================
// 帖子UI操作
// ========================================

/**
 * 切换点赞状态
 * @param {HTMLElement} likeButton - 点赞按钮元素
 * @param {number} postId - 帖子ID
 */
async function toggleLike(likeButton, postId) {
    const isLiked = likeButton.classList.contains('liked');
    const likeCountElement = likeButton.querySelector('.like-count');
    let likeCount = parseInt(likeCountElement.textContent.replace(/,/g, ''));
    
    try {
        if (isLiked) {
            // 取消点赞
            await unlikePost(postId);
            likeButton.classList.remove('liked');
            likeCount--;
        } else {
            // 点赞
            await likePost(postId);
            likeButton.classList.add('liked');
            likeCount++;
        }
        
        // 更新显示的点赞数
        likeCountElement.textContent = likeCount.toLocaleString();
        
        // 添加动画效果
        likeButton.classList.add('animate');
        setTimeout(() => {
            likeButton.classList.remove('animate');
        }, 300);
        
    } catch (error) {
        showMessage(error.message || '操作失败，请重试', 'error');
    }
}

/**
 * 切换收藏状态
 * @param {HTMLElement} collectButton - 收藏按钮元素
 * @param {number} postId - 帖子ID
 */
async function toggleCollect(collectButton, postId) {
    const isCollected = collectButton.classList.contains('collected');
    
    try {
        if (isCollected) {
            // 取消收藏
            await uncollectPost(postId);
            collectButton.classList.remove('collected');
            showMessage('已取消收藏', 'success');
        } else {
            // 收藏
            await collectPost(postId);
            collectButton.classList.add('collected');
            showMessage('收藏成功', 'success');
        }
        
        // 添加动画效果
        collectButton.classList.add('animate');
        setTimeout(() => {
            collectButton.classList.remove('animate');
        }, 300);
        
    } catch (error) {
        showMessage(error.message || '操作失败，请重试', 'error');
    }
}

/**
 * 分享帖子
 * @param {number} postId - 帖子ID
 * @param {string} title - 帖子标题
 */
function sharePost(postId, title) {
    const url = `${window.location.origin}/posts/${postId}`;
    const shareText = `${title} - ${url}`;
    
    // 检测是否支持分享API
    if (navigator.share) {
        navigator.share({
            title: title,
            text: shareText,
            url: url
        }).catch(console.error);
    } else {
        // 复制到剪贴板
        navigator.clipboard.writeText(shareText).then(() => {
            showMessage('链接已复制到剪贴板', 'success');
        }).catch(() => {
            // 降级处理：使用prompt
            prompt('请复制以下链接分享：', shareText);
        });
    }
}

// ========================================
// 帖子列表操作
// ========================================

/**
 * 加载更多帖子
 * @param {number} page - 页码
 * @param {number} limit - 每页数量
 * @param {Object} filters - 过滤条件
 * @returns {Promise} Promise对象
 */
async function loadMorePosts(page, limit = 10, filters = {}) {
    try {
        const params = new URLSearchParams({
            page: page,
            limit: limit,
            ...filters
        });
        
        const response = await fetch(`/api/posts?${params.toString()}`);
        const result = await response.json();
        
        if (result.code === 200) {
            return result.data;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('加载帖子失败:', error);
        throw error;
    }
}

/**
 * 渲染帖子列表
 * @param {Array} posts - 帖子数组
 * @param {HTMLElement} container - 容器元素
 */
function renderPosts(posts, container) {
    posts.forEach(post => {
        const postElement = createPostElement(post);
        container.appendChild(postElement);
    });
}

/**
 * 创建帖子元素
 * @param {Object} post - 帖子数据
 * @returns {HTMLElement} 帖子元素
 */
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-item';
    postDiv.dataset.postId = post.id;
    
    postDiv.innerHTML = `
        <div class="post-title">
            ${post.tag ? `<span class="tag">${post.tag}</span>` : ''}
            <a href="/posts/${post.id}">${post.title}</a>
        </div>
        <div class="post-info">
            <div class="post-meta">
                <span>👍 <span class="like-count">${post.like_count.toLocaleString()}</span></span>
                <span>💬 <span class="comment-count">${post.comment_count.toLocaleString()}</span></span>
                <span>👁️ <span class="view-count">${post.view_count.toLocaleString()}</span></span>
            </div>
            <div class="author">
                <div class="author-avatar">${post.user.nickname.charAt(0)}</div>
                <span>${post.user.nickname}</span>
                <span class="post-time" data-relative-time="${post.created_at}"></span>
            </div>
        </div>
    `;
    
    // 绑定点击事件
    postDiv.addEventListener('click', (e) => {
        if (!e.target.closest('a')) {
            window.location.href = `/posts/${post.id}`;
        }
    });
    
    return postDiv;
}

/**
 * 绑定帖子事件
 */
function bindPostEvents() {
    // 点赞按钮
    document.querySelectorAll('.like-button').forEach(button => {
        const postId = parseInt(button.closest('[data-post-id]').dataset.postId);
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleLike(button, postId);
        });
    });
    
    // 收藏按钮
    document.querySelectorAll('.collect-button').forEach(button => {
        const postId = parseInt(button.closest('[data-post-id]').dataset.postId);
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleCollect(button, postId);
        });
    });
    
    // 分享按钮
    document.querySelectorAll('.share-button').forEach(button => {
        const postId = parseInt(button.closest('[data-post-id]').dataset.postId);
        const title = button.closest('[data-post-id]').querySelector('.post-title a').textContent;
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            sharePost(postId, title);
        });
    });
}

/**
 * 初始化帖子加载
 * @param {Object} options - 配置选项
 */
function initPosts(options = {}) {
    const {
        containerSelector = '.post-list',
        loadMoreSelector = '.load-more-button',
        initialPage = 1,
        pageSize = 10
    } = options;
    
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    let currentPage = initialPage;
    let isLoading = false;
    
    // 加载帖子
    async function loadPosts(page) {
        if (isLoading) return;
        
        isLoading = true;
        const loadMoreButton = document.querySelector(loadMoreSelector);
        if (loadMoreButton) {
            loadMoreButton.textContent = '加载中...';
            loadMoreButton.disabled = true;
        }
        
        try {
            const data = await loadMorePosts(page, pageSize);
            renderPosts(data.list, container);
            
            // 检查是否还有更多
            if (data.list.length < pageSize) {
                if (loadMoreButton) {
                    loadMoreButton.textContent = '没有更多了';
                    loadMoreButton.disabled = true;
                }
            } else {
                if (loadMoreButton) {
                    loadMoreButton.textContent = '加载更多';
                    loadMoreButton.disabled = false;
                }
            }
            
            // 绑定新帖子的事件
            bindPostEvents();
            
            currentPage++;
        } catch (error) {
            showMessage('加载失败，请重试', 'error');
            if (loadMoreButton) {
                loadMoreButton.textContent = '加载更多';
                loadMoreButton.disabled = false;
            }
        } finally {
            isLoading = false;
        }
    }
    
    // 加载更多按钮点击事件
    const loadMoreButton = document.querySelector(loadMoreSelector);
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', () => {
            loadPosts(currentPage);
        });
    }
    
    // 初始加载
    loadPosts(initialPage);
}

// ========================================
// 评论功能
// ========================================

/**
 * 加载评论列表
 * @param {number} postId - 帖子ID
 * @param {number} page - 页码
 * @returns {Promise} Promise对象
 */
async function loadComments(postId, page = 1) {
    try {
        const response = await fetch(`/api/posts/${postId}/comments?page=${page}`);
        const result = await response.json();
        
        if (result.code === 200) {
            return result.data;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('加载评论失败:', error);
        throw error;
    }
}

/**
 * 发表评论
 * @param {number} postId - 帖子ID
 * @param {string} content - 评论内容
 * @param {number} parentId - 父评论ID（可选）
 * @returns {Promise} Promise对象
 */
async function postComment(postId, content, parentId = 0) {
    try {
        const response = await fetch(`/api/posts/${postId}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
                parent_id: parentId
            })
        });
        
        const result = await response.json();
        
        if (result.code === 200) {
            return result.data;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('发表评论失败:', error);
        throw error;
    }
}

// ========================================
// 初始化
// ========================================

/**
 * 初始化帖子模块
 */
function initPostsModule() {
    console.log('初始化帖子模块...');
    
    // 绑定帖子事件
    bindPostEvents();
    
    // 初始化帖子加载
    initPosts();
    
    console.log('帖子模块初始化完成');
}

// ========================================
// 页面加载完成后执行
// ========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPostsModule);
} else {
    initPostsModule();
}

// ========================================
// 导出（如果需要被其他模块引用）
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        likePost,
        unlikePost,
        collectPost,
        uncollectPost,
        incrementViewCount,
        toggleLike,
        toggleCollect,
        sharePost,
        loadMorePosts,
        renderPosts,
        loadComments,
        postComment,
        initPosts
    };
}
