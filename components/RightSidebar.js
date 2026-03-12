/**
 * ========================================
 * 右侧边栏组件
 * ========================================
 * @description 积分排行榜、热门作品、热门小组
 * @date 2026-03-10
 * @version 1.0.0
 */

export default function RightSidebar() {
  const rankings = [
    { rank: 1, name: '李明', points: '12,580' },
    { rank: 2, name: '陈强', points: '11,230' },
    { rank: 3, name: '赵丽', points: '10,890' },
    { rank: 4, name: '张伟', points: '9,650' },
    { rank: 5, name: '王芳', points: '8,920' }
  ];

  const hotWorks = [
    { title: '新消息营销自动化系统设计', likes: 238, comments: 156, views: '5.6k' },
    { title: '智能客服机器人接入指南', likes: 192, comments: 134, views: '4.2k' },
    { title: '新消息数据分析平台搭建', likes: 167, comments: 98, views: '3.8k' },
    { title: 'RCS富媒体消息模板库', likes: 145, comments: 87, views: '3.2k' }
  ];

  const hotGroups = [
    { name: '新消息技术交流组', icon: '📱', members: '2,345', posts: '5,678' },
        { name: '金融行业新消息组', icon: '🏦', members: '1,876', posts: '3,456' },
    { name: '创意设计小组', icon: '🎨', members: '1,234', posts: '2,789' },
    { name: 'AI Agent研究组', icon: '🤖', members: '987', posts: '2,134' }
  ];

  return (
    <>
      <aside className="sidebar right-sidebar">
        {/* 积分排行榜 */}
        <div className="widget">
          <h4 className="widget-title">
            <span className="widget-icon">🏆</span>
            积分排行榜
          </h4>
          <ul className="ranking-list">
            {rankings.map((item) => (
              <li key={item.rank}>
                <div className={`rank-number ${item.rank <= 3 ? 'top3' : ''}`}>
                  {item.rank}
                </div>
                <div className="user-info">
                  <div className="user-name">{item.name}</div>
                  <div className="user-points">{item.points} 积分</div>
                </div>
              </li>
            ))}
          </ul>
          <a href="#" className="view-more">查看更多 →</a>
        </div>

        {/* 热门作品 */}
        <div className="widget">
          <h4 className="widget-title">
            <span className="widget-icon">🎨</span>
            热门作品
          </h4>
          <ul className="hot-items">
            {hotWorks.map((work, index) => (
              <li key={index}>
                <a href="#" className="hot-item">
                  <div className="hot-item-title">{work.title}</div>
                  <div className="hot-item-stats">
                    <span>👍 {work.likes}</span>
                    <span>💬 {work.comments}</span>
                    <span>👁️ {work.views}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
          <a href="#" className="view-more">查看更多 →</a>
        </div>

        {/* 热门小组 */}
        <div className="widget">
          <h4 className="widget-title">
            <span className="widget-icon">👥</span>
            热门小组
          </h4>
          <ul className="hot-items">
            {hotGroups.map((group, index) => (
              <li key={index}>
                <a href="#" className="hot-group">
                  <div className="group-info">
                    <span className="group-icon">{group.icon}</span>
                    <span className="group-name">{group.name}</span>
                  </div>
                  <div className="group-stats">
                    <span>👥 {group.members}</span>
                    <span>📝 {group.posts}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
          <a href="#" className="view-more">查看更多 →</a>
        </div>
      </aside>
    </>
  );
}