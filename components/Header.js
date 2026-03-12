/**
 * ========================================
 * 头部导航组件
 * ========================================
 * @description 顶部导航栏，包含Logo、搜索、用户操作
 * @date 2026-03-10
 * @version 1.0.0
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Header({ user, onLoginClick, onRegisterClick, onLogout }) {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // 初始化黑暗模式
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

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

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-content">
          <a href="/" className="logo">
            <span className="logo-icon">📡</span>
            中移互新消息交流论坛
          </a>

          <div className="search-box">
            <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%' }}>
              <button type="submit" className="search-button" aria-label="搜索">🔍</button>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索帖子、用户、话题..."
                autoComplete="off"
                aria-label="搜索"
                style={{ flex: 1 }}
              />
            </form>
          </div>

          <div className="header-right">
            <button className="theme-toggle" onClick={toggleDarkMode} title="切换主题">
              {darkMode ? '☀️' : '🌙'}
            </button>
            <div className="datetime">{currentTime}</div>
            
            <div className="auth-buttons">
              {user ? (
                <>
                  <a href="/profile" className="user-avatar-link" title="个人中心">
                    <div className="user-avatar-small">{user.username.charAt(0)}</div>
                  </a>
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
      
      {/* 论坛主题宣言 */}
      <div className="forum-motto-banner">
        <div className="motto-content">
          <span className="motto-icon">🎯</span>
          <span className="motto-text">致力于打造新消息领域的信息发布枢纽、AI Agent 交流中心、生态合作桥梁</span>
        </div>
      </div>
      
      <style jsx>{`
        .forum-motto-banner {
          background: var(--secondary-gradient);
          color: white;
          padding: 12px 0;
          margin-top: var(--header-height);
          text-align: center;
          box-shadow: 0 2px 10px var(--shadow-color);
        }
        
        .motto-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .motto-icon {
          font-size: 18px;
        }
        
        .motto-text {
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
        
        .theme-toggle {
          background: rgba(255,255,255,0.2);
          border: none;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          font-size: 18px;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .theme-toggle:hover {
          background: rgba(255,255,255,0.3);
          transform: scale(1.1);
        }
        
        .user-avatar-link {
          display: flex;
          align-items: center;
          text-decoration: none;
        }
        
        .user-avatar-small {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
          margin-right: 8px;
        }
      `}</style>
    </>
  );
}
