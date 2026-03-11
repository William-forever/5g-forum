/**
 * ========================================
 * 测试帖子种子脚本
 * ========================================
 * 向数据库中添加一些测试帖子
 */

import { supabase } from '../lib/supabase';

async function seedTestPosts() {
  try {
    console.log('开始添加测试帖子...');

    // 测试帖子数据
    const testPosts = [
      {
        title: '让每个企业都拥有智能消息服务 - 5G消息行业解决方案',
        content: `# 让每个企业都拥有智能消息服务

## 解决方案背景

随着5G技术的普及，企业消息服务正在经历革命性的变化。传统的短信服务已经无法满足企业的需求，5G消息作为一种全新的消息形态，为企业提供了更加丰富、智能的消息服务能力。

## 解决方案架构

### 1. 系统架构

- **消息接入层**：支持多种消息渠道接入，包括5G消息、短信、微信等
- **消息处理层**：负责消息的路由、转换和处理
- **业务逻辑层**：实现各种业务功能，如智能客服、营销推广等
- **数据存储层**：存储消息数据和用户数据

### 2. 核心功能

1. **智能消息卡片**：支持富媒体消息展示，包括图片、视频、按钮等
2. **AI 智能客服**：基于大模型的智能问答系统
3. **消息模板管理**：灵活的消息模板配置
4. **数据分析**：详细的消息发送和交互数据分析

## 行业应用场景

### 1. 金融行业
- 账户变动通知
- 理财产品推荐
- 智能客服

### 2. 零售行业
- 订单状态通知
- 促销活动推送
- 会员积分管理

### 3. 物流行业
- 包裹状态追踪
- 配送提醒
- 异常情况通知

## 技术优势

1. **全渠道覆盖**：支持5G消息、短信、微信等多种渠道
2. **智能交互**：基于AI的智能问答和推荐
3. **快速部署**：模块化设计，支持快速集成
4. **安全可靠**：端到端加密，确保消息安全

## 部署方案

### 1. 云服务部署
- 支持公有云、私有云部署
- 弹性扩展，按需付费

### 2. 本地化部署
- 适合对数据安全有特殊要求的企业
- 完全自主可控

## 成功案例

### 案例1：某大型银行
- 实现了智能客服系统
- 客户满意度提升30%
- 客服成本降低40%

### 案例2：某电商平台
- 实现了个性化营销推送
- 转化率提升25%
- 复购率提升15%

## 未来展望

随着5G网络的全面覆盖和AI技术的不断发展，5G消息行业解决方案将在以下方面持续演进：

1. **更智能的交互体验**：基于大模型的自然语言处理
2. **更丰富的消息形态**：支持更多类型的富媒体内容
3. **更广泛的行业应用**：覆盖更多行业场景
4. **更深度的业务集成**：与企业现有系统的无缝集成

---

## 联系我们

如果您对我们的5G消息行业解决方案感兴趣，欢迎联系我们获取更多信息：

- 官网：https://www.example.com
- 电话：400-123-4567
- 邮箱：contact@example.com

让我们一起探索5G消息为企业带来的无限可能！`,
        category: '行业解决方案',
        author: '技术专家',
        author_id: 'system',
        likes: 156,
        comments: 32,
        views: 1234,
        is_top: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        title: '5G消息技术最新进展',
        content: `# 5G消息技术最新进展

## 技术发展现状

5G消息技术在过去一年取得了显著进展，各大运营商和技术提供商都在积极推进相关标准和应用的落地。

## 关键技术突破

1. **消息交互能力**：支持更丰富的富媒体内容和交互方式
2. **AI集成**：与大语言模型的深度融合
3. **安全保障**：端到端加密和身份认证
4. **跨平台兼容**：与现有消息系统的无缝对接

## 应用案例

- 金融行业：智能客服和交易通知
- 零售行业：个性化营销和订单管理
- 政务服务：便民信息和在线办理

## 未来趋势

5G消息将成为企业数字化转型的重要工具，为用户提供更加智能、便捷的消息服务体验。`,
        category: '行业动态',
        author: '行业分析师',
        author_id: 'system',
        likes: 89,
        comments: 23,
        views: 789,
        is_top: false,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        title: '5G消息开发实战教程',
        content: `# 5G消息开发实战教程

## 开发环境搭建

1. **SDK安装**：获取最新的5G消息开发SDK
2. **环境配置**：设置开发环境和测试环境
3. **模拟器**：使用5G消息模拟器进行测试

## 核心功能开发

1. **消息卡片设计**：创建富媒体消息卡片
2. **交互逻辑**：实现用户与消息的交互
3. **后台集成**：与企业后台系统的对接
4. **数据分析**：消息发送和交互数据的收集分析

## 测试与部署

1. **功能测试**：确保所有功能正常运行
2. **兼容性测试**：测试不同设备和运营商的兼容性
3. **上线部署**：提交应用到运营商平台

## 最佳实践

- 保持消息内容简洁明了
- 优化用户交互体验
- 确保消息送达率
- 定期更新和维护`,
        category: '技术交流',
        author: '技术专家',
        author_id: 'system',
        likes: 234,
        comments: 45,
        views: 1890,
        is_top: false,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        updated_at: new Date(Date.now() - 172800000).toISOString(),
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        updatedAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        title: '招聘5G消息开发工程师',
        content: `# 招聘5G消息开发工程师

## 岗位职责

1. 负责5G消息应用的设计和开发
2. 与产品团队合作，实现产品需求
3. 优化系统性能和用户体验
4. 解决开发过程中的技术问题

## 任职要求

1. 本科及以上学历，计算机相关专业
2. 3年以上前端开发经验
3. 熟悉5G消息开发技术
4. 良好的团队合作能力
5. 较强的学习能力和解决问题的能力

## 薪资待遇

- 薪资：20-40K
- 福利：五险一金、带薪年假、年终奖
- 工作地点：北京、上海、深圳

## 联系方式

- 邮箱：hr@example.com
- 电话：400-123-4567`,
        category: '需求发布',
        author: 'HR小姐姐',
        author_id: 'system',
        likes: 56,
        comments: 18,
        views: 678,
        is_top: false,
        created_at: new Date(Date.now() - 259200000).toISOString(),
        updated_at: new Date(Date.now() - 259200000).toISOString(),
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        updatedAt: new Date(Date.now() - 259200000).toISOString()
      }
    ];

    // 批量插入帖子数据
    for (const post of testPosts) {
      const { data, error } = await supabase
        .from('posts')
        .insert([post])
        .select()
        .single();

      if (error) {
        console.error('添加帖子失败:', error);
      } else {
        console.log('帖子添加成功:', data.title);
      }
    }

    console.log('测试帖子添加完成！');

  } catch (error) {
    console.error('脚本执行错误:', error);
  }
}

// 运行脚本
seedTestPosts();
