/**
 * ========================================
 * 右侧边栏组件
 * ========================================
 * @description 积分排行榜、热门作品、热门小组
 * @date 2026-03-10
 * @version 1.0.0
 */

import React, { useState, useEffect } from 'react';

export default function RightSidebar() {
  const [rankings, setRankings] = useState([
    { rank: 1, name: '加载中...', points: '0' },
    { rank: 2, name: '加载中...', points: '0' },
    { rank: 3, name: '加载中...', points: '0' },
    { rank: 4, name: '加载中...', points: '0' },
    { rank: 5, name: '加载中...', points: '0' }
  ]);

  // 获取实际的用户积分数据
  const fetchUserRankings = async () => {
    try {
      // 获取所有帖子
      const postsResponse = await fetch('/api/posts?limit=1000');
      const postsData = await postsResponse.json();
      
      if (postsData.success) {
        const posts = postsData.posts || [];
        
        // 计算每个用户的积分
        const userPoints = {};
        
        // 积分规则：发帖 +10，评论 +1，点赞 +2，收藏 +2
        posts.forEach(post => {
          // 发帖积分
          if (post.author) {
            userPoints[post.author] = (userPoints[post.author] || 0) + 10;
            // 点赞积分
            userPoints[post.author] += (post.likes || 0) * 2;
            // 评论积分
            userPoints[post.author] += (post.comments || 0) * 1;
            // 收藏积分（模拟数据，实际项目中应该从数据库获取）
            const bookmarkCount = Math.floor(Math.random() * 5); // 模拟0-4个收藏
            userPoints[post.author] += bookmarkCount * 2;
          }
        });
        
        // 转换为排行榜格式并排序
        const rankingList = Object.entries(userPoints)
          .map(([name, points]) => ({ name, points }))
          .sort((a, b) => b.points - a.points)
          .slice(0, 5)
          .map((item, index) => ({
            rank: index + 1,
            name: item.name,
            points: item.points.toLocaleString()
          }));
        
        // 如果没有足够的用户，填充空数据
        while (rankingList.length < 5) {
          rankingList.push({
            rank: rankingList.length + 1,
            name: '暂无数据',
            points: '0'
          });
        }
        
        setRankings(rankingList);
      }
    } catch (error) {
      console.error('获取积分排行榜失败:', error);
    }
  };

  useEffect(() => {
    // 初始加载
    fetchUserRankings();
    
    // 每小时更新一次排行榜
    const interval = setInterval(fetchUserRankings, 60 * 60 * 1000);
    
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