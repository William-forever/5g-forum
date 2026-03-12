/**
 * ========================================
 * 左侧边栏组件
 * ========================================
 * @description 论坛板块导航
 * @date 2026-03-10
 * @version 1.1.0
 */

import React, { useState, useEffect } from 'react';

export default function Sidebar({ activeCategory, onCategoryChange }) {
  const [sections, setSections] = useState([
    { name: '首页', icon: '🏠', count: '全部', color: '#007bff' },
    { name: '行业解决方案', icon: '💡', count: '0', color: '#9c27b0' },
    { name: 'agent 交流广场', icon: '🤖', count: '0', color: '#6f42c1' },
    { name: '行业动态', icon: '📰', count: '0', color: '#007bff' },
    { name: '招投标信息', icon: '📋', count: '0', color: '#28a745' },
    { name: '产品培训', icon: '📚', count: '0', color: '#ffc107' },
    { name: '行业联动', icon: '🤝', count: '0', color: '#17a2b8' },
    { name: '技术交流', icon: '💬', count: '0', color: '#dc3545' },
    { name: '需求发布', icon: '🎯', count: '0', color: '#fd7e14' },
    { name: '活动通知', icon: '📅', count: '0', color: '#20c997' }
  ]);

  useEffect(() => {
    // 获取实际的帖子数量
    const fetchPostCounts = async () => {
      try {
        const response = await fetch('/api/posts?limit=1000');
        const data = await response.json();
        if (data.success) {
          const posts = data.posts || [];
          
          // 计算每个板块的帖子数量
          const categoryCounts = {};
          posts.forEach(post => {
            const category = post.category;
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          });
          
          // 更新板块的帖子数量
          setSections(prevSections => prevSections.map(section => {
            if (section.name === '首页') {
              return { ...section, count: posts.length };
            }
            // 处理板块名称空格问题
            const sectionNameWithoutSpace = section.name.replace(/\s/g, '');
            const matchingCategory = Object.keys(categoryCounts).find(cat => 
              cat === section.name || cat.replace(/\s/g, '') === sectionNameWithoutSpace
            );
            return {
              ...section,
              count: matchingCategory ? categoryCounts[matchingCategory] : 0
            };
          }));
        }
      } catch (error) {
        console.error('获取帖子数量失败:', error);
      }
    };

    fetchPostCounts();
  }, []);

  const getActiveStyle = (sectionName) => {
    const section = sections.find(s => s.name === sectionName);
    const color = section?.color || '#007bff';
    return {
      background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
      color: 'white',
      boxShadow: `0 2px 8px ${color}40`
    };
  };

  return (
    <>
      <aside className="sidebar">
        <h3 className="sidebar-title">论坛板块</h3>

        <ul className="forum-section">
          {sections.map((section) => (
            <li key={section.name}>
              <a 
                href="#" 
                title={section.name}
                className={activeCategory === section.name ? 'active' : ''}
                style={activeCategory === section.name ? getActiveStyle(section.name) : {}}
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
              <img src="/images/new-5G-RCS.png" alt="新5G消息公众号" style={{ width: '120px', height: '120px' }} />
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
    </>
  );
}
