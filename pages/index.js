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
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10; // 每页显示 10 条帖子

  // 计算总页数
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // 获取当前页的帖子
  const getCurrentPagePosts = () => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return posts.slice(startIndex, endIndex);
  };

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
      setCurrentPage(1); // 重置到第一页
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
        // 处理板块名称空格问题
        const categoryWithoutSpace = category.replace(/\s/g, '');
        const filtered = allPosts.filter(post => 
          post.category === category || 
          post.category.replace(/\s/g, '') === categoryWithoutSpace
        );
        setPosts(filtered);
      }
      setCurrentPage(1); // 重置到第一页
    } else if (!search) {
      setActiveCategory('首页');
      setPosts(allPosts);
      setCurrentPage(1); // 重置到第一页
    }
  }, [category, allPosts, search]);

  // 监听 URL 变化，确保 category 参数变化时重新获取帖子
  useEffect(() => {
    // 如果 allPosts 为空，重新获取帖子
    if (allPosts.length === 0) {
      fetchPosts();
    }
  }, [category, search]);

  // 获取文章列表
  const fetchPosts = async () => {
    try {
      console.log('开始获取帖子列表...');
      // 获取所有帖子，不分页
      const response = await fetch('/api/posts?limit=1000');
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
          // 处理板块名称空格问题
          const categoryWithoutSpace = category.replace(/\s/g, '');
          const filtered = postsData.filter(post => 
            post.category === category || 
            post.category.replace(/\s/g, '') === categoryWithoutSpace
          );
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
        
        <div className="content-wrapper">
          <PostList 
            posts={getCurrentPagePosts()}
            user={user}
            category={activeCategory}
            onPostClick={() => setShowPostModal(true)}
          />
          
          {/* 翻页组件 */}
          <div className="pagination-container">
            <div className="pagination">
              <button 
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                上一页
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                // 只显示当前页附近的页码
                if (pageNum === 1 || pageNum === totalPages || 
                    (pageNum >= currentPage - 2 && pageNum <= currentPage + 2)) {
                  return (
                    <button
                      key={pageNum}
                      className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === currentPage - 3 || pageNum === currentPage + 3) {
                  return <span key={pageNum} className="page-ellipsis">...</span>;
                }
                return null;
              })}
              
              <button 
                className="page-btn"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                下一页
              </button>
            </div>
            <div className="page-info">
              共 {posts.length} 条帖子，第 {currentPage}/{totalPages} 页
            </div>
          </div>
        </div>
        
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

// 添加样式
const styles = `
  .pagination-container {
    background: var(--bg-card);
    border-radius: var(--border-radius);
    box-shadow: 0 2px 10px var(--shadow-color);
    padding: 1.5rem;
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .pagination {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .page-btn {
    min-width: 40px;
    height: 40px;
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-color);
    background: var(--bg-card);
    color: var(--text-color);
    border-radius: 8px;
    cursor: pointer;
    transition: var(--transition);
    font-size: 0.95rem;
    font-weight: 500;
  }
  
  .page-btn:hover:not(:disabled) {
    background: var(--primary-gradient);
    color: white;
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,123,255,0.3);
  }
  
  .page-btn.active {
    background: var(--primary-gradient);
    color: white;
    border-color: transparent;
  }
  
  .page-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .page-ellipsis {
    padding: 0 0.5rem;
    color: var(--text-muted);
  }
  
  .page-info {
    font-size: 0.9rem;
    color: var(--text-secondary);
  }
`;

// 在组件中注入样式
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  if (!document.getElementById('pagination-styles')) {
    styleSheet.id = 'pagination-styles';
    document.head.appendChild(styleSheet);
  }
}
