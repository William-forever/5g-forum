/**
 * ========================================
 * 主脚本文件 - 新消息交流论坛
 * ========================================
 * @description 包含页面初始化、事件绑定、通用功能
 * @author Forum Team
 * @date 2026-03-10
 * @version 1.0.0
 */

// ========================================
// 应用配置
// ========================================
const CONFIG = {
    API_BASE_URL: '/api',                    // API基础URL
    WEBSITE_NAME: '中移互新消息交流论坛',     // 网站名称
    UPDATE_INTERVAL: 1000,                   // 更新间隔（毫秒）
    POSTS_PER_PAGE: 10,                      // 每页显示帖子数
    MAX_FILE_SIZE: 5 * 1024 * 1024,          // 最大文件大小（5MB）
};

// ========================================
// 应用状态管理
// ========================================
const AppState = {
    currentUser: null,       // 当前登录用户
    currentPage: 1,          // 当前页码
    posts: [],               // 帖子列表
    isLoading: false,        // 加载状态
};

// ========================================
// 工具函数库
// ========================================

/**
 * 检查元素是否存在
 * @param {string} selector - CSS选择器
 * @returns {boolean} 是否存在
 */
function exists(selector) {
    return document.querySelector(selector) !== null;
}

/**
 * 获取元素
 * @param {string} selector - CSS选择器
 * @returns {HTMLElement|null} DOM元素
 */
function getEl(selector) {
    return document.querySelector(selector);
}

/**
 * 获取所有元素
 * @param {string} selector - CSS选择器
 * @returns {NodeList} DOM元素列表
 */
function getEls(selector) {
    return document.querySelectorAll(selector);
}

/**
 * 添加事件监听
 * @param {string} selector - CSS选择器
 * @param {string} event - 事件类型
 * @param {Function} callback - 回调函数
 */
function on(selector, event, callback) {
    const element = getEl(selector);
    if (element) {
        element.addEventListener(event, callback);
    }
}

/**
 * 委托事件监听
 * @param {string} parentSelector - 父元素选择器
 * @param {string} childSelector - 子元素选择器
 * @param {string} event - 事件类型
 * @param {Function} callback - 回调函数
 */
function delegate(parentSelector, childSelector, event, callback) {
    const parent = getEl(parentSelector);
    if (parent) {
        parent.addEventListener(event, (e) => {
            if (e.target.matches(childSelector) || 
                e.target.closest(childSelector)) {
                callback(e);
            }
        });
    }
}

/**
 * 显示提示消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型（success, error, warning, info）
 * @param {number} duration - 显示时长（毫秒）
 */
function showMessage(message, type = 'info', duration = 3000) {
    // 创建消息元素
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    
    // 设置样式
    Object.assign(messageEl.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        animation: 'fadeInRight 0.3s ease',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    });
    
    // 根据类型设置背景色
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8',
    };
    messageEl.style.background = colors[type] || colors.info;
    
    // 添加到页面
    document.body.appendChild(messageEl);
    
    // 自动移除
    setTimeout(() => {
        messageEl.style.animation = 'fadeOutRight 0.3s ease';
        setTimeout(() => {
            messageEl.remove();
        }, 300);
    }, duration);
}

/**
 * 格式化数字（添加千分位）
 * @param {number} num - 要格式化的数字
 * @returns {string} 格式化后的字符串
 */
function formatNumber(num) {
    if (typeof num !== 'number') return num;
    return num.toLocaleString('zh-CN');
}

/**
 * 格式化时间
 * @param {Date|string} date - 日期对象或日期字符串
 * @returns {string} 格式化后的时间字符串
 */
function formatTime(date) {
    const now = new Date();
    const target = new Date(date);
    const diff = now - target;
    
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;
    
    if (diff < minute) {
        return '刚刚';
    } else if (diff < hour) {
        return `${Math.floor(diff / minute)}分钟前`;
    } else if (diff < day) {
        return `${Math.floor(diff / hour)}小时前`;
    } else if (diff < week) {
        return `${Math.floor(diff / day)}天前`;
    } else if (diff < month) {
        return `${Math.floor(diff / week)}周前`;
    } else if (diff < year) {
        return `${Math.floor(diff / month)}个月前`;
    } else {
        return `${Math.floor(diff / year)}年前`;
    }
}

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 节流后的函数
 */
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            func.apply(this, args);
            lastCall = now;
        }
    };
}

// ========================================
// 初始化函数
// ========================================

/**
 * 页面初始化
 */
function init() {
    console.log(`${CONFIG.WEBSITE_NAME} 正在初始化...`);
    
    // 初始化各个模块
    initHeader();
    initSidebar();
    initPosts();
    initFooter();
    
    // 绑定全局事件
    bindGlobalEvents();
    
    console.log(`${CONFIG.WEBSITE_NAME} 初始化完成`);
}

/**
 * 初始化头部
 */
function initHeader() {
    // 搜索框功能
    const searchInput = getEl('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
}

/**
 * 初始化侧边栏
 */
function initSidebar() {
    // 侧边栏链接点击效果
    delegate('.sidebar', '.forum-section a', 'click', function(e) {
        e.preventDefault();
        const sectionName = this.textContent.trim();
        console.log('点击了板块:', sectionName);
        // TODO: 加载对应板块的帖子
    });
}

/**
 * 初始化帖子列表
 */
function initPosts() {
    // 为每个帖子项添加点击效果
    delegate('.post-list', '.post-item', 'click', function() {
        const postTitle = this.querySelector('.post-title').textContent.trim();
        console.log('点击了帖子:', postTitle);
        // TODO: 跳转到帖子详情页
    });
    
    // 发布按钮点击事件
    on('.post-btn', 'click', function() {
        console.log('点击了发布新帖按钮');
        // TODO: 打开发帖编辑器
    });
}

/**
 * 初始化页脚
 */
function initFooter() {
    // 页脚链接点击事件
    delegate('footer', 'a', 'click', function(e) {
        e.preventDefault();
        const linkText = this.textContent.trim();
        console.log('点击了页脚链接:', linkText);
        // TODO: 处理页脚链接点击
    });
}

/**
 * 绑定全局事件
 */
function bindGlobalEvents() {
    // 页面滚动事件（使用节流）
    window.addEventListener('scroll', throttle(handleScroll, 100));
    
    // 窗口大小改变事件（使用防抖）
    window.addEventListener('resize', debounce(handleResize, 300));
}

// ========================================
// 事件处理函数
// ========================================

/**
 * 处理搜索
 * @param {Event} e - 输入事件
 */
function handleSearch(e) {
    const query = e.target.value.trim();
    console.log('搜索:', query);
    
    if (query.length === 0) {
        // 清空搜索结果
        return;
    }
    
    // TODO: 调用搜索API
}

/**
 * 处理页面滚动
 */
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 可以在这里实现滚动时的一些效果
    // 例如：显示回到顶部按钮
}

/**
 * 处理窗口大小改变
 */
function handleResize() {
    console.log('窗口大小改变:', window.innerWidth, window.innerHeight);
    // 可以在这里处理响应式调整
}

// ========================================
// API请求封装
// ========================================

/**
 * 发送GET请求
 * @param {string} url - 请求URL
 * @param {Object} params - 查询参数
 * @returns {Promise} Promise对象
 */
async function get(url, params = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = `${CONFIG.API_BASE_URL}${url}${queryString ? '?' + queryString : ''}`;
        
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        return await response.json();
    } catch (error) {
        console.error('GET请求失败:', error);
        throw error;
    }
}

/**
 * 发送POST请求
 * @param {string} url - 请求URL
 * @param {Object} data - 请求数据
 * @returns {Promise} Promise对象
 */
async function post(url, data = {}) {
    try {
        const response = await fetch(`${CONFIG.API_BASE_URL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        return await response.json();
    } catch (error) {
        console.error('POST请求失败:', error);
        throw error;
    }
}

// ========================================
// 页面加载完成后执行
// ========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
