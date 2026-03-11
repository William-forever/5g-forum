/**
 * ========================================
 * 用户认证模块
 * ========================================
 * @description 处理用户登录、注册、登出等认证相关功能
 * @date 2026-03-10
 * @version 1.0.0
 */

/**
 * 显示登录弹窗
 */
function showLoginModal() {
    const modal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    
    if (modal) {
        modal.style.display = 'flex';
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    }
}

/**
 * 显示注册弹窗
 */
function showRegisterModal() {
    const modal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    
    if (modal) {
        modal.style.display = 'flex';
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
    }
}

/**
 * 关闭认证弹窗
 */
function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

/**
 * 切换登录/注册标签
 * @param {string} tab - 'login' 或 'register'
 */
function switchAuthTab(tab) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    
    if (tab === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
    }
}

/**
 * 处理登录表单提交
 */
async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showAuthMessage('请填写用户名和密码', 'error');
        return;
    }
    
    const result = await loginUser(username, password);
    
    if (result.success) {
        showAuthMessage('登录成功！', 'success');
        updateUIForLoggedInUser(result.user);
        setTimeout(() => {
            closeAuthModal();
        }, 1000);
    } else {
        showAuthMessage('登录失败：' + result.message, 'error');
    }
}

/**
 * 处理注册表单提交
 */
async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // 表单验证
    if (!username || !email || !password) {
        showAuthMessage('请填写所有必填项', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAuthMessage('两次输入的密码不一致', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAuthMessage('密码长度至少6位', 'error');
        return;
    }
    
    const result = await registerUser(username, password, email);
    
    if (result.success) {
        showAuthMessage('注册成功！请登录', 'success');
        setTimeout(() => {
            switchAuthTab('login');
        }, 1500);
    } else {
        showAuthMessage('注册失败：' + result.message, 'error');
    }
}

/**
 * 处理用户登出
 */
function handleLogout() {
    logoutUser();
    updateUIForLoggedOutUser();
    showAuthMessage('已登出', 'info');
}

/**
 * 显示认证消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型：success/error/info
 */
function showAuthMessage(message, type = 'info') {
    const messageEl = document.getElementById('authMessage');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = 'auth-message ' + type;
        messageEl.style.display = 'block';
        
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
}

/**
 * 更新 UI 为已登录状态
 * @param {Object} user - 用户信息
 */
function updateUIForLoggedInUser(user) {
    // 更新头部导航
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <span class="user-welcome">欢迎，${user.username}</span>
            <button class="btn-logout" onclick="handleLogout()">退出</button>
        `;
    }
    
    // 显示发布按钮
    const postBtn = document.querySelector('.post-btn');
    if (postBtn) {
        postBtn.style.display = 'block';
    }
    
    // 保存登录状态到本地存储
    localStorage.setItem('currentUser', JSON.stringify(user));
}

/**
 * 更新 UI 为未登录状态
 */
function updateUIForLoggedOutUser() {
    // 更新头部导航
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <button class="btn-login" onclick="showLoginModal()">登录</button>
            <button class="btn-register" onclick="showRegisterModal()">注册</button>
        `;
    }
    
    // 隐藏发布按钮
    const postBtn = document.querySelector('.post-btn');
    if (postBtn) {
        postBtn.style.display = 'none';
    }
    
    // 清除本地存储
    localStorage.removeItem('currentUser');
}

/**
 * 检查并恢复登录状态
 */
function checkLoginStatus() {
    const user = getCurrentUser();
    if (user) {
        updateUIForLoggedInUser(user);
    } else {
        updateUIForLoggedOutUser();
    }
}

// 页面加载时检查登录状态
document.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});
