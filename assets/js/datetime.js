/**
 * ========================================
 * 日期时间模块 - 5G消息交流论坛
 * ========================================
 * @description 提供日期时间显示和更新功能
 * @author Forum Team
 * @date 2026-03-10
 * @version 1.0.0
 */

// ========================================
// 配置
// ========================================
const DATETIME_CONFIG = {
    updateInterval: 1000,          // 更新间隔（毫秒）
    format: 'full',               // 显示格式：full, date, time, datetime
    locale: 'zh-CN',              // 语言区域
    showSeconds: true              // 是否显示秒数
};

// ========================================
// 工具函数
// ========================================

/**
 * 获取当前日期时间的完整字符串
 * @param {boolean} showSeconds - 是否显示秒数
 * @returns {string} 格式化的日期时间字符串
 */
function getCurrentDateTime(showSeconds = true) {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
    };
    
    if (showSeconds) {
        options.second = '2-digit';
    }
    
    return now.toLocaleString(DATETIME_CONFIG.locale, options);
}

/**
 * 获取当前日期
 * @returns {string} 格式化的日期字符串
 */
function getCurrentDate() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    };
    
    return now.toLocaleDateString(DATETIME_CONFIG.locale, options);
}

/**
 * 获取当前时间
 * @param {boolean} showSeconds - 是否显示秒数
 * @returns {string} 格式化的时间字符串
 */
function getCurrentTime(showSeconds = true) {
    const now = new Date();
    const options = {
        hour: '2-digit',
        minute: '2-digit'
    };
    
    if (showSeconds) {
        options.second = '2-digit';
    }
    
    return now.toLocaleTimeString(DATETIME_CONFIG.locale, options);
}

/**
 * 格式化时间差（相对时间）
 * @param {Date|string} date - 目标日期
 * @returns {string} 相对时间字符串（如：2小时前）
 */
function formatRelativeTime(date) {
    const now = new Date();
    const target = new Date(date);
    const diff = now - target;
    
    const second = 1000;
    const minute = 60 * second;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;
    
    if (diff < minute) {
        return '刚刚';
    } else if (diff < hour) {
        const minutes = Math.floor(diff / minute);
        return `${minutes}分钟前`;
    } else if (diff < day) {
        const hours = Math.floor(diff / hour);
        return `${hours}小时前`;
    } else if (diff < week) {
        const days = Math.floor(diff / day);
        return `${days}天前`;
    } else if (diff < month) {
        const weeks = Math.floor(diff / week);
        return `${weeks}周前`;
    } else if (diff < year) {
        const months = Math.floor(diff / month);
        return `${months}个月前`;
    } else {
        const years = Math.floor(diff / year);
        return `${years}年前`;
    }
}

/**
 * 格式化日期
 * @param {Date|string} date - 日期对象或字符串
 * @param {string} format - 格式类型（date, datetime, full）
 * @returns {string} 格式化的日期字符串
 */
function formatDate(date, format = 'date') {
    const target = new Date(date);
    
    switch (format) {
        case 'date':
            return target.toLocaleDateString(DATETIME_CONFIG.locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        case 'datetime':
            return target.toLocaleString(DATETIME_CONFIG.locale, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        case 'full':
            return target.toLocaleString(DATETIME_CONFIG.locale, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
                hour: '2-digit',
                minute: '2-digit'
            });
        default:
            return target.toLocaleDateString(DATETIME_CONFIG.locale);
    }
}

/**
 * 判断是否是今天
 * @param {Date|string} date - 日期对象或字符串
 * @returns {boolean} 是否是今天
 */
function isToday(date) {
    const now = new Date();
    const target = new Date(date);
    
    return now.getFullYear() === target.getFullYear() &&
           now.getMonth() === target.getMonth() &&
           now.getDate() === target.getDate();
}

/**
 * 判断是否是本周
 * @param {Date|string} date - 日期对象或字符串
 * @returns {boolean} 是否是本周
 */
function isThisWeek(date) {
    const now = new Date();
    const target = new Date(date);
    
    const nowDay = now.getDay();
    const nowDate = now.getDate();
    const targetDate = target.getDate();
    
    // 计算本周的开始日期（周日为开始）
    const weekStart = nowDate - nowDay;
    
    return targetDate >= weekStart && targetDate < weekStart + 7;
}

/**
 * 获取日期的友好显示
 * @param {Date|string} date - 日期对象或字符串
 * @returns {string} 友好的日期显示
 */
function getFriendlyDate(date) {
    const target = new Date(date);
    
    if (isToday(target)) {
        return `今天 ${formatRelativeTime(date)}`;
    } else if (isThisWeek(target)) {
        const weekday = target.toLocaleDateString(DATETIME_CONFIG.locale, { weekday: 'long' });
        return `星期${weekday.slice(-1)} ${target.toLocaleTimeString(DATETIME_CONFIG.locale, {
            hour: '2-digit',
            minute: '2-digit'
        })}`;
    } else {
        return formatDate(date, 'datetime');
    }
}

// ========================================
// 更新功能
// ========================================

/**
 * 更新页面上的日期时间显示
 */
function updateDateTimeDisplay() {
    const dateTimeElement = document.getElementById('datetime');
    
    if (dateTimeElement) {
        const dateTimeStr = getCurrentDateTime(DATETIME_CONFIG.showSeconds);
        dateTimeElement.textContent = dateTimeStr;
    }
}

/**
 * 更新所有相对时间显示
 */
function updateRelativeTime() {
    // 更新帖子发布时间
    document.querySelectorAll('[data-relative-time]').forEach(element => {
        const datetime = element.getAttribute('data-relative-time');
        if (datetime) {
            element.textContent = formatRelativeTime(datetime);
        }
    });
}

/**
 * 启动日期时间自动更新
 * @param {number} interval - 更新间隔（毫秒）
 * @returns {number} 定时器ID
 */
function startDateTimeUpdate(interval = DATETIME_CONFIG.updateInterval) {
    updateDateTimeDisplay();
    updateRelativeTime();
    
    return setInterval(() => {
        updateDateTimeDisplay();
        updateRelativeTime();
    }, interval);
}

/**
 * 停止日期时间更新
 * @param {number} timerId - 定时器ID
 */
function stopDateTimeUpdate(timerId) {
    if (timerId) {
        clearInterval(timerId);
    }
}

// ========================================
// 初始化
// ========================================

/**
 * 初始化日期时间模块
 */
function initDateTime() {
    console.log('初始化日期时间模块...');
    
    // 检查是否有日期时间元素
    if (document.getElementById('datetime')) {
        // 启动自动更新
        const timerId = startDateTimeUpdate();
        
        // 保存定时器ID，方便后续停止
        window.dateTimeTimerId = timerId;
        
        console.log('日期时间模块初始化完成，定时器ID:', timerId);
    } else {
        console.log('未找到日期时间显示元素，跳过初始化');
    }
}

// ========================================
// 页面加载完成后执行
// ========================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDateTime);
} else {
    initDateTime();
}

// ========================================
// 导出（如果需要被其他模块引用）
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getCurrentDateTime,
        getCurrentDate,
        getCurrentTime,
        formatRelativeTime,
        formatDate,
        isToday,
        isThisWeek,
        getFriendlyDate,
        startDateTimeUpdate,
        stopDateTimeUpdate
    };
}
