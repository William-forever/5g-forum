/**
 * ========================================
 * 文章列表组件
 * ========================================
 * @description 显示帖子列表和发布按钮
 * @date 2026-03-10
 * @version 1.0.0
 */

export default function PostList({ posts, user, category, onPostClick }) {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // 小于1小时显示分钟
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return minutes < 1 ? '刚刚' : `${minutes}分钟前`;
    }
    // 小于24小时显示小时
    if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}小时前`;
    }
    // 小于7天显示天数
    if (diff < 604800000) {
      return `${Math.floor(diff / 86400000)}天前`;
    }
    // 否则显示日期
    return date.toLocaleDateString('zh-CN');
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

  return (
    <main className="main-content">
      <div className="main-content-header">
        <h2>{category === '首页' ? '全部帖子' : category}</h2>
        {user && (
          <button className="post-btn" onClick={onPostClick}>
            发布新帖
          </button>
        )}
      </div>

      <div className="post-list">
        {posts.length === 0 ? (
          <div className="empty-state">
            <p>暂无帖子，快来发布第一条吧！</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-item" data-post-id={post.id}>
              <div className="post-title">
                <span 
                  className="tag" 
                  style={{ backgroundColor: `${getCategoryColor(post.category)}20`, color: getCategoryColor(post.category) }}
                >
                  {post.category}
                </span>
                <a href={`/post/${post.id}`}>{post.title}</a>
              </div>
              <div className="post-info">
                <div className="post-meta">
                  <span>👍 {post.likes}</span>
                  <span>💬 {post.comments}</span>
                  <span>👁️ {post.views >= 1000 ? (post.views / 1000).toFixed(1) + 'k' : post.views}</span>
                </div>
                <div className="author">
                  <div className="author-avatar">
                    {post.author ? post.author.charAt(0) : '?'}
                  </div>
                  <span>{post.author || '未知用户'}</span>
                  <span className="post-time">{formatTime(post.createdAt)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
