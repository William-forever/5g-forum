/**
 * ========================================
 * 左侧边栏组件
 * ========================================
 * @description 论坛板块导航
 * @date 2026-03-10
 * @version 1.1.0
 */

export default function Sidebar({ activeCategory, onCategoryChange }) {
  const sections = [
    { name: '首页', icon: '🏠', count: '全部' },
    { name: '行业解决方案', icon: '💡', count: '80+' },
    { name: '行业动态', icon: '📰', count: '100+' },
    { name: '招投标信息', icon: '📋', count: '50+' },
    { name: '产品培训', icon: '📚', count: '80+' },
    { name: '行业联动', icon: '🤝', count: '60+' },
    { name: 'agent交流广场', icon: '🤖', count: '120+' },
    { name: '技术交流', icon: '💬', count: '200+' },
    { name: '需求发布', icon: '🎯', count: '40+' },
    { name: '活动通知', icon: '📅', count: '30+' }
  ];

  return (
    <aside className="sidebar">
      <h3 className="sidebar-title">论坛板块</h3>

      <ul className="forum-section">
        {sections.map((section) => (
          <li key={section.name}>
            <a 
              href="#" 
              title={section.name}
              className={activeCategory === section.name ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                onCategoryChange(section.name);
              }}
            >
              <span className="icon">{section.icon}</span>
              <span className="name">{section.name}</span>
              <span className="count">{section.count}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="sidebar-stats">
        <div className="stat-item">
          <span className="stat-label">今日发帖</span>
          <span className="stat-value">28</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">今日回复</span>
          <span className="stat-value">156</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">在线人数</span>
          <span className="stat-value">1,234</span>
        </div>
      </div>

      {/* 微信公众号 */}
      <div className="widget widget-wechat">
        <div className="wechat-content">
          <div className="wechat-logo">
            <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=QR code with 5G logo in the center, black and white, clear, professional&image_size=square" alt="新5G消息公众号" style={{ width: '120px', height: '120px' }} />
          </div>
          <h4 className="wechat-name">新5G消息公众号</h4>
          <p className="wechat-desc">关注获取最新5G消息资讯</p>
        </div>
      </div>
    </aside>

    <style jsx>{`
      .widget-wechat {
        margin-top: 20px;
        background: linear-gradient(135deg, #07C160 0%, #00A86B 100%);
        color: white;
        border-radius: 8px;
        overflow: hidden;
      }
      
      .wechat-content {
        padding: 20px;
        text-align: center;
      }
      
      .wechat-logo {
        margin-bottom: 10px;
      }
      
      .wechat-name {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 5px;
        margin-top: 0;
      }
      
      .wechat-desc {
        font-size: 12px;
        opacity: 0.9;
        margin: 0;
      }
    `}</style>
  );
}
