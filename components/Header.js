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
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索帖子、用户、话题..."
                autoComplete="off"
                aria-label="搜索"
              />
              <button type="submit" className="search-btn">
                🔍
              </button>
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
      
      <style jsx>{`
        
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
        
        .header-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .search-box {
          flex: 1;
          max-width: 500px;
          margin: 0 2rem;
        }
        
        .search-form {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.95);
          border-radius: 25px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.15);
          transition: var(--transition);
        }
        
        .search-form:focus-within {
          box-shadow: 0 4px 20px rgba(0,123,255,0.3);
          transform: translateY(-1px);
        }
        
        .search-form input {
          flex: 1;
          border: none;
          outline: none;
          padding: 0.7rem 1.2rem 0.7rem 1.5rem;
          border-radius: 25px;
          font-size: 0.95rem;
          background: transparent;
          color: var(--text-color);
        }
        
        .search-btn {
          background: var(--primary-gradient);
          border: none;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          margin: 3px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition);
          font-size: 16px;
          flex-shrink: 0;
        }
        
        .search-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(0,123,255,0.4);
        }
        
        .search-button {
          display: none;
        }
      `}</style>
    </>
  );
}
