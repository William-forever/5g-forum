/**
 * ========================================
 * 个人中心页面
 * ========================================
 * @description 用户个人中心，查看帖子、收藏、消息、积分等
 * @date 2026-03-12
 * @version 1.0.0
 */

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import RightSidebar from '../components/RightSidebar';
import AuthModal from '../components/AuthModal';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [myPosts, setMyPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // 检查登录状态
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
          fetchMyPosts(userData.username);
          fetchNotifications();
        } catch (e) {
          console.error('解析用户数据失败:', e);
          router.push('/');
        }
      } else {
        router.push('/');
      }
    }
  }, []);

  const fetchMyPosts = async (username) => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      if (data.success) {
        const posts = (data.posts || []).filter(post => post.author === username);
        setMyPosts(posts);
      }
    } catch (error) {
      console.error('获取帖子失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    // 模拟通知数据
    setNotifications([
      { id: 1, type: 'like', content: '您的帖子获得了点赞', time: '10 分钟前', read: false },
      { id: 2, type: 'comment', content: '有人评论了您的帖子', time: '1 小时前', read: false },
      { id: 3, type: 'like', content: '您的帖子获得了点赞', time: '2 小时前', read: true },
    ]);
  };

  const handleLogout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    router.push('/');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="container">
        <Header 
          user={user} 
          onLoginClick={() => setShowAuthModal(true)}
          onRegisterClick={() => setShowAuthModal(true)}
          onLogout={handleLogout}
        />
        <div className="loading-container">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="container">
        <Head>
          <title>个人中心 - {user.username} - 中移互新消息交流论坛</title>
          <meta name="description" content="个人中心" />
        </Head>

        <Header 
          user={user} 
          onLoginClick={() => setShowAuthModal(true)}
          onRegisterClick={() => setShowAuthModal(true)}
          onLogout={handleLogout}
        />

        <main className="profile-container">
          {/* 左侧导航 */}
          <aside className="profile-sidebar">
            <div className="profile-user-card">
              <div className="profile-avatar">{user.username.charAt(0)}</div>
              <h3 className="profile-username">{user.username}</h3>
              <p className="profile-email">{user.email}</p>
              <div className="profile-points">
                <span className="points-label">积分</span>
                <span className="points-value">{user.points || 0}</span>
              </div>
            </div>

            <nav className="profile-nav">
              <button 
                className={`nav-item ${activeTab === 'posts' ? 'active' : ''}`}
                onClick={() => setActiveTab('posts')}
              >
                📝 我的帖子
              </button>
              <button 
                className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
                onClick={() => setActiveTab('favorites')}
              >
                ⭐ 我的收藏
              </button>
              <button 
                className={`nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                🔔 消息通知
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
              </button>
              <button 
                className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                ⚙️ 账号设置
              </button>
            </nav>
          </aside>

          {/* 主内容区 */}
          <div className="profile-content">
            {activeTab === 'posts' && (
              <div className="profile-section">
                <h2 className="section-title">📝 我的帖子</h2>
                {myPosts.length === 0 ? (
                  <div className="empty-state">
                    <p>暂无帖子</p>
                    <button className="post-btn" onClick={() => router.push('/')}>去发帖</button>
                  </div>
                ) : (
                  <div className="posts-list">
                    {myPosts.map(post => (
                      <div key={post.id} className="post-card" onClick={() => router.push(`/post/${post.id}`)}>
                        <h3 className="post-title">{post.title}</h3>
                        <div className="post-meta">
                          <span className="category-tag">{post.category}</span>
                          <span>👁️ {post.views}</span>
                          <span>💬 {post.comments}</span>
                          <span>👍 {post.likes}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="profile-section">
                <h2 className="section-title">⭐ 我的收藏</h2>
                <div className="empty-state">
                  <p>暂无收藏</p>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="profile-section">
                <h2 className="section-title">🔔 消息通知</h2>
                {notifications.length === 0 ? (
                  <div className="empty-state">
                    <p>暂无新消息</p>
                  </div>
                ) : (
                  <div className="notifications-list">
                    {notifications.map(notice => (
                      <div key={notice.id} className={`notification-item ${!notice.read ? 'unread' : ''}`}>
                        <div className="notification-icon">
                          {notice.type === 'like' ? '👍' : '💬'}
                        </div>
                        <div className="notification-content">
                          <p className="notification-text">{notice.content}</p>
                          <span className="notification-time">{notice.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="profile-section">
                <h2 className="section-title">⚙️ 账号设置</h2>
                <div className="settings-form">
                  <div className="form-group">
                    <label>用户名</label>
                    <input type="text" value={user.username} disabled />
                  </div>
                  <div className="form-group">
                    <label>邮箱</label>
                    <input type="email" value={user.email} />
                  </div>
                  <button className="submit-btn">保存修改</button>
                </div>
              </div>
            )}
          </div>

          <RightSidebar />
        </main>

        <footer className="footer">
          <p>&copy; 2026 中移互新消息交流论坛。保留所有权利.</p>
          <p className="slogan">让新消息连接一切，共建行业生态</p>
        </footer>

        {showAuthModal && (
          <AuthModal 
            initialTab="login"
            onClose={() => setShowAuthModal(false)}
            onLoginSuccess={(userData, token) => {
              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
              localStorage.setItem('token', token);
              setShowAuthModal(false);
            }}
          />
        )}
      </div>

      <style jsx>{`
        .profile-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: calc(var(--header-height) + 60px) 2rem 2rem;
          display: grid;
          grid-template-columns: 280px 1fr 280px;
          gap: 20px;
          min-height: calc(100vh - var(--header-height) - 140px);
        }

        .profile-sidebar {
          background: var(--bg-card);
          border-radius: var(--border-radius);
          box-shadow: 0 2px 10px var(--shadow-color);
          padding: 1.5rem;
          height: fit-content;
          position: sticky;
          top: calc(var(--header-height) + 20px);
        }

        .profile-user-card {
          text-align: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 1rem;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--primary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 32px;
          margin: 0 auto 1rem;
        }

        .profile-username {
          font-size: 1.2rem;
          color: var(--text-color);
          margin-bottom: 0.5rem;
        }

        .profile-email {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .profile-points {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: var(--secondary-gradient);
          border-radius: 20px;
          color: white;
        }

        .points-label {
          font-size: 0.85rem;
          opacity: 0.9;
        }

        .points-value {
          font-weight: bold;
          font-size: 1.1rem;
          margin-left: 0.5rem;
        }

        .profile-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 0.8rem 1rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          text-align: left;
          cursor: pointer;
          border-radius: var(--border-radius-sm);
          transition: var(--transition);
          font-size: 0.95rem;
          position: relative;
        }

        .nav-item:hover {
          background: var(--bg-color);
          color: var(--primary-color);
        }

        .nav-item.active {
          background: var(--primary-gradient);
          color: white;
        }

        .badge {
          position: absolute;
          right: 1rem;
          background: #ff4757;
          color: white;
          font-size: 0.75rem;
          padding: 0.2rem 0.5rem;
          border-radius: 10px;
          font-weight: bold;
        }

        .profile-content {
          background: var(--bg-card);
          border-radius: var(--border-radius);
          box-shadow: 0 2px 10px var(--shadow-color);
          padding: 1.5rem;
        }

        .section-title {
          font-size: 1.3rem;
          color: var(--text-color);
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--border-color);
        }

        .posts-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .post-card {
          padding: 1.2rem;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          cursor: pointer;
          transition: var(--transition);
        }

        .post-card:hover {
          background: var(--bg-color);
          transform: translateX(5px);
        }

        .post-title {
          font-size: 1.1rem;
          color: var(--text-color);
          margin-bottom: 0.8rem;
        }

        .post-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        .category-tag {
          padding: 0.2rem 0.6rem;
          background: var(--secondary-gradient);
          color: white;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .notification-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          transition: var(--transition);
        }

        .notification-item.unread {
          background: rgba(0,123,255,0.05);
          border-color: var(--primary-color);
        }

        .notification-icon {
          font-size: 1.5rem;
        }

        .notification-content {
          flex: 1;
        }

        .notification-text {
          color: var(--text-color);
          margin-bottom: 0.3rem;
        }

        .notification-time {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .settings-form {
          max-width: 500px;
        }

        .form-group {
          margin-bottom: 1.2rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.8rem;
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-sm);
          font-size: 0.95rem;
          background: var(--bg-color);
          color: var(--text-color);
        }

        .submit-btn {
          padding: 0.8rem 2rem;
          background: var(--primary-gradient);
          color: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          transition: var(--transition);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,123,255,0.3);
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 400px;
          color: var(--text-secondary);
        }

        @media (max-width: 992px) {
          .profile-container {
            grid-template-columns: 200px 1fr;
          }
        }

        @media (max-width: 768px) {
          .profile-container {
            grid-template-columns: 1fr;
            padding: calc(var(--header-height) + 60px) 1rem 1rem;
          }

          .profile-sidebar {
            position: static;
          }
        }
      `}</style>
    </>
  );
}
