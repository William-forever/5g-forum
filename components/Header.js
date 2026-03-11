/**
 * ========================================
 * 头部导航组件
 * ========================================
 * @description 顶部导航栏，包含Logo、搜索、用户操作
 * @date 2026-03-10
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';

export default function Header({ user, onLoginClick, onRegisterClick, onLogout }) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      const timeStr = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      });
      setCurrentTime(`${dateStr} ${timeStr}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <header className="header">
        <div className="header-content">
          <a href="/" className="logo">
          <span className="logo-icon">📡</span>
          中移互新消息交流论坛
        </a>
        
        <div className="platform-motto">
          致力于打造新消息领域的信息发布枢纽、AI Agent交流中心、生态合作桥梁
        </div>

          <div className="search-box">
            <button className="search-button" aria-label="搜索">🔍</button>
            <input
              type="text"
              placeholder="搜索帖子、用户、话题..."
              autoComplete="off"
              aria-label="搜索"
            />
          </div>

          <div className="header-right">
            <div className="datetime">{currentTime}</div>
            
            <div className="auth-buttons">
              {user ? (
                <>
                  <span className="user-welcome">欢迎，{user.username}</span>
                  <button className="btn-logout" onClick={onLogout}>退出</button>
                </>
              ) : (
                <>
                  <button className="btn-login" onClick={onLoginClick}>登录</button>
                  <button className="btn-register" onClick={onRegisterClick}>注册</button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <style jsx>{`
        .platform-motto {
          font-size: 14px;
          color: #666;
          margin: 10px 0;
          text-align: center;
          font-weight: 500;
          line-height: 1.4;
        }
      `}</style>
    </>
  );
}
