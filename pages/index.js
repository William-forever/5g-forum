import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
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
 * @description 新消息交流论坛主页面
 * @date 2026-03-10
 * @version 1.0.0
 */

export default function Home() {
  const router = useRouter();
  const { category, search } = router.query;
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(category || '首页');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [searchQuery, setSearchQuery] = useState('');

  // 检查登录状态
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error('解析用户数据失败:', e);
        }
      }
    }
    fetchPosts();
  }, []);

  // 监听搜索参数变化
  useEffect(() => {
    if (search) {
      setSearchQuery(search);
      // 搜索逻辑：在标题和内容中查找
      const filtered = allPosts.filter(post => 
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase()) ||
        post.author.toLowerCase().includes(search.toLowerCase())
      );
      setPosts(filtered);
      setActiveCategory('搜索结果');
    }
  }, [search, allPosts]);

  // 监听 category 参数变化
  useEffect(() => {
    if (category && !search) {
      setActiveCategory(category);
      // 当 category 参数变化时，重新过滤帖子
      if (category === '首页') {
        setPosts(allPosts);
      } else {
        const filtered = allPosts.filter(post => post.category === category);
        setPosts(filtered);
      }
    } else if (!search) {
      setActiveCategory(category || '首页');
    }
  }, [category, allPosts, search]);

  // 监听URL变化，确保category参数变化时重新获取帖子
  useEffect(() => {
    if (category) {
      // 如果allPosts为空，重新获取帖子
      if (allPosts.length === 0) {
        fetchPosts();
      }
    }
  }, [category]);

  // 获取文章列表
  const fetchPosts = async () => {
    try {
      console.log('开始获取帖子列表...');
      const response = await fetch('/api/posts');
      console.log('API响应状态:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API返回数据:', data);
      
      if (data.success) {
        console.log('帖子数据:', data.posts);
        const postsData = data.posts || [];
        setAllPosts(postsData);
        // 根据当前URL参数中的category过滤帖子
        if (category === '首页' || !category) {
          setPosts(postsData);
        } else {
          const filtered = postsData.filter(post => post.category === category);
          setPosts(filtered);
        }
      } else {
        console.error('获取帖子失败:', data.message);
      }
    } catch (error) {
      console.error('获取文章失败:', error);
    }
  };

  // 处理板块切换
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    // 导航到带category参数的首页
    if (category === '首页') {
      router.push('/');
    } else {
      router.push(`/?category=${encodeURIComponent(category)}`);
    }
  };

  // 处理登录成功
  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
    }
    setShowAuthModal(false);
  };

  // 处理登出
  const handleLogout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  // 处理发布文章成功
  const handlePostSuccess = () => {
    setShowPostModal(false);
    fetchPosts();
  };

  return (
    <div className="container">
      <Head>
        <title>中移互新消息交流论坛</title>
        <meta name="description" content="专业的新消息技术交流平台" />
      </Head>

      <Header 
        user={user} 
        onLoginClick={() => { setAuthTab('login'); setShowAuthModal(true); }}
        onRegisterClick={() => { setAuthTab('register'); setShowAuthModal(true); }}
        onLogout={handleLogout}
      />

      <main className="main-container">
        <Sidebar 
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
        
        <PostList 
          posts={posts}
          user={user}
          category={activeCategory}
          onPostClick={() => setShowPostModal(true)}
        />
        
        <RightSidebar />
      </main>

      <footer className="footer">
        <p>&copy; 2026 中移互新消息交流论坛. 保留所有权利.</p>
        <p className="slogan">让新消息连接一切，共建行业生态</p>
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
