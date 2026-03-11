/**
 * ========================================
 * 发布文章弹窗组件
 * ========================================
 * @description 发布新文章的弹窗表单
 * @date 2026-03-10
 * @version 1.0.0
 */

import { useState } from 'react';

export default function PostModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '行业动态'
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    '行业解决方案',
    '行业动态',
    '招投标信息',
    '产品培训',
    '行业联动',
    'agent交流广场',
    '技术交流',
    '需求发布',
    '活动通知'
  ];

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      showMessage('请填写标题和内容', 'error');
      return;
    }

    if (formData.title.length < 5) {
      showMessage('标题长度至少为5个字符', 'error');
      return;
    }

    if (formData.content.length < 10) {
      showMessage('内容长度至少为10个字符', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        showMessage('发布成功！', 'success');
        setTimeout(() => {
          onSuccess();
        }, 1000);
      } else {
        showMessage(data.message, 'error');
      }
    } catch (error) {
      showMessage('发布失败，请稍后重试', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content post-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>发布新帖</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {message && (
          <div className={`message ${messageType}`}>{message}</div>
        )}

        <form className="post-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>分类</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>标题</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="请输入帖子标题（5-100个字符）"
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label>内容</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="请输入帖子内容（至少10个字符）"
              rows={10}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              取消
            </button>
            <button 
              type="submit" 
              className="submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? '发布中...' : '发布'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
