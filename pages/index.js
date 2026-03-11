import Head from 'next/head';
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import PostList from '../components/PostList';
import RightSidebar from '../components/RightSidebar';
import AuthModal from '../components/AuthModal';
import PostModal from '../components/PostModal';

/**
 * ========================================
 * 论坛首页
 * ========================================
 * @description 5G消息交流论坛主页面
 * @date 2026-03-10
 * @version 1.0.0
 */

export default function Home() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [authTab, setAuthTab] = useState('login');

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    fetchPosts();
  }, []);

  // 获取文章列表
  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      if (data.success) {
        setPosts(data.data.posts);
      }
    } catch (error) {
      console.error('获取文章失败:', error);
    }
  };

  // 处理登录成功
  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setShowAuthModal(false);
  };

  // 处理登出
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // 处理发布文章成功
  const handlePostSuccess = () => {
    setShowPostModal(false);
    fetchPosts();
  };

  return (
    <div className="container">
      <Head>
        <title>中移互5G消息交流论坛</title>
        <meta name="description" content="专业的5G消息技术交流平台" />
      </Head>

      <Header 
        user={user} 
        onLoginClick={() => { setAuthTab('login'); setShowAuthModal(true); }}
        onRegisterClick={() => { setAuthTab('register'); setShowAuthModal(true); }}
        onLogout={handleLogout}
      />

      <main className="main-container">
        <Sidebar />
        
        <PostList 
          posts={posts}
          user={user}
          onPostClick={() => setShowPostModal(true)}
        />
        
        <RightSidebar />
      </main>

      <footer className="footer">
        <p>&copy; 2026 中移互5G消息交流论坛. 保留所有权利.</p>
        <p className="slogan">让5G消息连接一切，共建行业生态</p>
      </footer>

      {showAuthModal && (
        <AuthModal 
          initialTab={authTab}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showPostModal && (
        <PostModal 
          onClose={() => setShowPostModal(false)}
          onSuccess={handlePostSuccess}
        />
      )}
    </div>
  );
}
