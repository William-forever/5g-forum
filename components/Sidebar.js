/**
 * ========================================
 * 左侧边栏组件
 * ========================================
 * @description 论坛板块导航
 * @date 2026-03-10
 * @version 1.0.0
 */

export default function Sidebar() {
  const sections = [
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
            <a href="#" title={section.name}>
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
    </aside>
  );
}
