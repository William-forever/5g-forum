/**
 * ========================================
 * 右侧边栏组件
 * ========================================
 * @description 积分排行榜、热门作品、热门小组
 * @date 2026-03-10
 * @version 2.0.0 - 集成数据库积分系统
 */

import React, { useState, useEffect } from 'react';

export default function RightSidebar() {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [nextUpdate, setNextUpdate] = useState(null);

  // 从API获取排行榜数据
  const fetchRankingsFromAPI = async () => {
    try {
      setLoading(true);
      console.log('正在获取排行榜数据...');
      
      const response = await fetch('/api/users/rankings?limit=10');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        const rankingsData = data.data || [];
        
        // 格式化数据
        const formattedRankings = rankingsData.map(item => ({
          rank: item.rank,
          name: item.username,
          points: item.points ? item.points.toLocaleString() : '0',
          isTop3: item.isTop3,
          avatar: item.avatar
        }));
        
        // 如果没有足够的用户，填充空数据
        while (formattedRankings.length < 5) {
          formattedRankings.push({
            rank: formattedRankings.length + 1,
            name: '暂无数据',
            points: '0',
            isTop3: false
          });
        }
        
        setRankings(formattedRankings);
        
        // 更新时间和下一次更新时间
        if (data.meta) {
          setLastUpdate(new Date(data.meta.timestamp));
          if (data.meta.next_update) {
            setNextUpdate(new Date(data.meta.next_update));
          }
        }
        
        console.log('排行榜数据获取成功:', formattedRankings.length, '条记录');
      } else {
        console.error('API返回错误:', data.message);
        // 使用默认数据
        setDefaultRankings();
      }
    } catch (error) {
      console.error('获取排行榜失败:', error);
      // 使用默认数据
      setDefaultRankings();
    } finally {
      setLoading(false);
    }
  };

  // 设置默认排行榜数据
  const setDefaultRankings = () => {
    const defaultRankings = [
      { rank: 1, name: '系统维护中', points: '0', isTop3: true },
      { rank: 2, name: '请稍后重试', points: '0', isTop3: true },
      { rank: 3, name: '数据加载失败', points: '0', isTop3: true },
      { rank: 4, name: '--', points: '0', isTop3: false },
      { rank: 5, name: '--', points: '0', isTop3: false }
    ];
    setRankings(defaultRankings);
  };

  // 手动刷新排行榜
  const handleRefresh = async () => {
    console.log('手动刷新排行榜...');
    await fetchRankingsFromAPI();
  };

  // 格式化时间显示
  const formatTime = (date) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // 计算距离下次更新的时间
  const getTimeUntilNextUpdate = () => {
    if (!nextUpdate) return '--';
    
    const now = new Date();
    const diffMs = nextUpdate - now;
    
    if (diffMs <= 0) return '即将更新';
    
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffSeconds = Math.floor((diffMs % 60000) / 1000);
    
    return `${diffMinutes.toString().padStart(2, '0')}:${diffSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // 初始加载
    fetchRankingsFromAPI();
    
    // 设置定时刷新（每5分钟检查一次）
    const interval = setInterval(fetchRankingsFromAPI, 5 * 60 * 1000);
    
    // 清理函数
    return () => clearInterval(interval);
  }, []);

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
          <div className="widget-header">
            <h4 className="widget-title">
              <span className="widget-icon">🏆</span>
              积分排行榜
            </h4>
            <div className="widget-actions">
              <button 
                className="refresh-btn" 
                onClick={handleRefresh}
                disabled={loading}
                title="刷新排行榜"
              >
                {loading ? '🔄' : '🔄'}
              </button>
            </div>
          </div>
          
          {/* 时间信息 */}
          <div className="widget-time-info">
            <div className="time-item">
              <span className="time-label">上次更新:</span>
              <span className="time-value">{lastUpdate ? formatTime(lastUpdate) : '--:--:--'}</span>
            </div>
            <div className="time-item">
              <span className="time-label">下次更新:</span>
              <span className="time-value countdown">{getTimeUntilNextUpdate()}</span>
            </div>
          </div>
          
          {/* 积分规则提示 */}
          <div className="points-rules-hint">
            <span className="hint-icon">📊</span>
            <span className="hint-text">发帖+10 点赞+2 收藏+2 评论+1</span>
          </div>
          
          {/* 排行榜列表 */}
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <div className="loading-text">正在加载排行榜...</div>
            </div>
          ) : (
            <ul className="ranking-list">
              {rankings.map((item) => (
                <li key={item.rank}>
                  <div className={`rank-number ${item.isTop3 ? 'top3' : ''}`}>
                    {item.rank}
                  </div>
                  <div className="user-info">
                    <div className="user-name">
                      {item.avatar ? (
                        <img src={item.avatar} alt={item.name} className="user-avatar" />
                      ) : (
                        <div className="user-avatar-placeholder">
                          {item.name.charAt(0)}
                        </div>
                      )}
                      <span className="name-text">{item.name}</span>
                    </div>
                    <div className="user-points">{item.points} 积分</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
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
      
      {/* 添加CSS样式 */}
      <style jsx>{`
        .widget-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .widget-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .refresh-btn {
          background: rgba(0, 123, 255, 0.1);
          border: 1px solid rgba(0, 123, 255, 0.3);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .refresh-btn:hover:not(:disabled) {
          background: rgba(0, 123, 255, 0.2);
          transform: rotate(180deg);
        }
        
        .refresh-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .widget-time-info {
          background: rgba(0, 123, 255, 0.05);
          border-radius: 8px;
          padding: 0.8rem;
          margin-bottom: 1rem;
        }
        
        .time-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.3rem;
        }
        
        .time-item:last-child {
          margin-bottom: 0;
        }
        
        .time-label {
          font-size: 0.85rem;
          color: #6c757d;
        }
        
        .time-value {
          font-size: 0.85rem;
          font-weight: 600;
          color: #007bff;
        }
        
        .time-value.countdown {
          color: #28a745;
        }
        
        .points-rules-hint {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #e7f1ff;
          border-radius: 6px;
          padding: 0.6rem;
          margin-bottom: 1rem;
          font-size: 0.85rem;
          color: #0056b3;
          margin-top: 0.5rem;
        }
        
        .hint-icon {
          font-size: 1rem;
        }
        
        .hint-text {
          flex: 1;
        }
        
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: #6c757d;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e9ecef;
          border-top-color: #007bff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        .loading-text {
          font-size: 0.9rem;
          color: #6c757d;
        }
        
        .user-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .user-avatar-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #007bff, #0056b3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 0.9rem;
        }
        
        .name-text {
          flex: 1;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}