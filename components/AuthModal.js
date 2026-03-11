/**
 * ========================================
 * 登录/注册弹窗组件
 * ========================================
 * @description 用户认证弹窗，包含登录和注册表单
 * @date 2026-03-10
 * @version 1.0.0
 */

import { useState } from 'react';

export default function AuthModal({ initialTab = 'login', onClose, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // 登录表单状态
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  
  // 注册表单状态
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!loginData.username || !loginData.password) {
      showMessage('请填写用户名和密码', 'error');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (data.success) {
        showMessage('登录成功！', 'success');
        onLoginSuccess(data.data, data.token);
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      showMessage('登录失败，请稍后重试', 'error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!registerData.username || !registerData.email || !registerData.password) {
      showMessage('请填写所有必填项', 'error');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      showMessage('两次输入的密码不一致', 'error');
      return;
    }

    if (registerData.password.length < 6) {
      showMessage('密码长度至少为6位', 'error');
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password
        })
      });

      const data = await response.json();

      if (data.success) {
        showMessage('注册成功！请登录', 'success');
        setTimeout(() => setActiveTab('login'), 1500);
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      showMessage('注册失败，请稍后重试', 'error');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>用户认证</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            登录
          </button>
          <button
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            注册
          </button>
        </div>

        {message && (
          <div className={`message ${messageType}`}>{message}</div>
        )}

        {activeTab === 'login' ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>用户名/邮箱</label>
              <input
                type="text"
                value={loginData.username}
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                placeholder="请输入用户名或邮箱"
              />
            </div>
            <div className="form-group">
              <label>密码</label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="请输入密码"
              />
            </div>
            <button type="submit" className="submit-btn">登录</button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label>用户名</label>
              <input
                type="text"
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                placeholder="3-20个字符"
              />
            </div>
            <div className="form-group">
              <label>邮箱</label>
              <input
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                placeholder="请输入有效邮箱"
              />
            </div>
            <div className="form-group">
              <label>密码</label>
              <input
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                placeholder="至少6位"
              />
            </div>
            <div className="form-group">
              <label>确认密码</label>
              <input
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                placeholder="再次输入密码"
              />
            </div>
            <button type="submit" className="submit-btn">注册</button>
          </form>
        )}
      </div>
    </div>
  );
}
