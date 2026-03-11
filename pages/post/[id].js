/**
 * ========================================
 * 帖子详情页面
 * ========================================
 * @description 显示单个帖子的详细内容
 * @date 2026-03-10
 * @version 1.0.0
 */

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import RightSidebar from '../../components/RightSidebar';
import AuthModal from '../../components/AuthModal';

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState([]);

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // 获取帖子详情
  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${id}`);
      const data = await response.json();
      if (data.success) {
        setPost(data.post);
        setComments(data.comments || []);
      } else {
        alert('帖子不存在或已被删除');
        router.push('/');
      }
    } catch (error) {
      console.error('获取帖子失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const handleLike = async () => {
    if (!user) {
      setAuthTab('login');
      setShowAuthModal(true);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/posts/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success && post) {
        setPost({ ...post, likes: data.likes });
      }
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      setAuthTab('login');
      setShowAuthModal(true);
      return;
    }

    if (!commentContent.trim()) {
      alert('请输入评论内容');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/posts/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentContent })
      });
      const data = await response.json();
      if (data.success) {
        setComments([data.comment, ...comments]);
        setCommentContent('');
        if (post) {
          setPost({ ...post, comments: (post.comments || 0) + 1 });
        }
      }
    } catch (error) {
      console.error('评论失败:', error);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '未知时间';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '未知时间';
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      '行业动态': '#007bff',
      '招投标信息': '#28a745',
      '产品培训': '#ffc107',
      '行业联动': '#17a2b8',
      'agent交流广场': '#6f42c1',
      '技术交流': '#dc3545',
      '需求发布': '#fd7e14',
      '活动通知': '#20c997'
    };
    return colors[category] || '#6c757d';
  };

  if (loading) {
    return (
      <div className="container">
        <Header 
          user={user} 
          onLoginClick={() => { setAuthTab('login'); setShowAuthModal(true); }}
          onRegisterClick={() => { setAuthTab('register'); setShowAuthModal(true); }}
          onLogout={handleLogout}
        />
        <main className="main-container">
          <Sidebar />
          <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <p>加载中...</p>
          </div>
          <RightSidebar />
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container">
        <Header 
          user={user} 
          onLoginClick={() => { setAuthTab('login'); setShowAuthModal(true); }}
          onRegisterClick={() => { setAuthTab('register'); setShowAuthModal(true); }}
          onLogout={handleLogout}
        />
        <main className="main-container">
          <Sidebar />
          <div className="main-content" style={{ textAlign: 'center', padding: '50px' }}>
            <h2>帖子不存在</h2>
            <p>该帖子可能已被删除或不存在</p>
            <button className="post-btn" onClick={() => router.push('/')}>返回首页</button>
          </div>
          <RightSidebar />
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <Head>
        <title>{post.title} - 中移互5G消息交流论坛</title>
        <meta name="description" content={post.content.substring(0, 100)} />
      </Head>

      <Header 
        user={user} 
        onLoginClick={() => { setAuthTab('login'); setShowAuthModal(true); }}
        onRegisterClick={() => { setAuthTab('register'); setShowAuthModal(true); }}
        onLogout={handleLogout}
      />

      <main className="main-container">
        <Sidebar />
        
        <div className="main-content">
          {/* 帖子头部 */}
          <div className="post-detail-header">
            <div className="post-category" style={{ 
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '4px',
              backgroundColor: `${getCategoryColor(post.category)}20`,
              color: getCategoryColor(post.category),
              fontSize: '14px',
              marginBottom: '16px'
            }}>
              {post.category}
            </div>
            <h1 className="post-detail-title">{post.title}</h1>
            <div className="post-detail-meta">
              <div className="author">
                <div className="author-avatar">{post.author ? post.author.charAt(0) : '?'}</div>
                <span>{post.author || '未知用户'}</span>
              </div>
              <span className="post-time">{formatTime(post.createdAt)}</span>
              <span className="post-views">👁️ {post.views} 浏览</span>
            </div>
          </div>

          {/* 帖子内容 */}
          <div className="post-detail-content">
            {post.content}
          </div>

          {/* 操作按钮 */}
          <div className="post-actions-bar">
            <button className="action-btn like-btn" onClick={handleLike}>
              👍 点赞 ({post.likes})
            </button>
            <button className="action-btn comment-btn">
              💬 评论 ({post.comments})
            </button>
            <button className="action-btn share-btn">
              📤 分享
            </button>
          </div>

          {/* 评论区 */}
          <div className="comments-section">
            <h3>评论 ({comments.length})</h3>
            
            {/* 评论输入框 */}
            <form className="comment-form" onSubmit={handleSubmitComment}>
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder={user ? "写下你的评论..." : "请先登录后评论"}
                disabled={!user}
                rows={4}
              />
              <button type="submit" className="submit-btn" disabled={!user}>
                发表评论
              </button>
            </form>

            {/* 评论列表 */}
            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="no-comments">暂无评论，快来抢沙发吧！</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <div className="author">
                        <div className="author-avatar">{comment.author ? comment.author.charAt(0) : '?'}</div>
                        <span>{comment.author || '匿名用户'}</span>
                      </div>
                      <span className="comment-time">{formatTime(comment.createdAt)}</span>
                    </div>
                    <div className="comment-content">{comment.content}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        
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

      <style jsx>{`
        .post-detail-header {
          background: white;
          padding: 24px;
          border-radius: 8px;
          margin-bottom: 16px;
        }
        
        .post-detail-title {
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 16px 0;
          color: #333;
        }
        
        .post-detail-meta {
          display: flex;
          align-items: center;
          gap: 16px;
          color: #666;
          font-size: 14px;
        }
        
        .post-detail-content {
          background: white;
          padding: 24px;
          border-radius: 8px;
          margin-bottom: 16px;
          line-height: 1.8;
          font-size: 16px;
          color: #333;
          white-space: pre-wrap;
        }
        
        .post-actions-bar {
          background: white;
          padding: 16px 24px;
          border-radius: 8px;
          margin-bottom: 16px;
          display: flex;
          gap: 16px;
        }
        
        .action-btn {
          padding: 8px 20px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          background: white;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }
        
        .action-btn:hover {
          background: #f5f5f5;
        }
        
        .like-btn:hover {
          background: #fff5f5;
          border-color: #ff6b6b;
          color: #ff6b6b;
        }
        
        .comments-section {
          background: white;
          padding: 24px;
          border-radius: 8px;
        }
        
        .comments-section h3 {
          margin: 0 0 20px 0;
          font-size: 18px;
          color: #333;
        }
        
        .comment-form {
          margin-bottom: 24px;
        }
        
        .comment-form textarea {
          width: 100%;
          padding: 12px;
          border: 1px solid #e0e0e0;
          border-radius: 4px;
          resize: vertical;
          font-family: inherit;
          font-size: 14px;
          margin-bottom: 12px;
        }
        
        .comment-form textarea:focus {
          outline: none;
          border-color: #007bff;
        }
        
        .comment-form textarea:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }
        
        .submit-btn {
          padding: 10px 24px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .submit-btn:hover:not(:disabled) {
          background: #0056b3;
        }
        
        .submit-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
        
        .no-comments {
          text-align: center;
          color: #999;
          padding: 40px;
        }
        
        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .comment-item {
          padding: 16px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        
        .comment-time {
          font-size: 12px;
          color: #999;
        }
        
        .comment-content {
          line-height: 1.6;
          color: #333;
        }
      `}</style>
    </div>
  );
}
