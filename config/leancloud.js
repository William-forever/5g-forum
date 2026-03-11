/**
 * ========================================
 * LeanCloud 配置文件
 * ========================================
 * @description LeanCloud 应用配置信息
 * @date 2026-03-10
 * @version 1.0.0
 * 
 * 使用说明：
 * 1. 访问 https://leancloud.cn 注册账号
 * 2. 创建新应用，获取 App ID 和 App Key
 * 3. 将下面的配置替换为你的实际信息
 * ========================================
 */

const LEANCLOUD_CONFIG = {
    // 应用 ID - 从 LeanCloud 控制台获取
    appId: 'YOUR_APP_ID',
    
    // 应用 Key - 从 LeanCloud 控制台获取
    appKey: 'YOUR_APP_KEY',
    
    // 服务器地址 - 国内节点
    serverURL: 'https://YOUR_APP_ID.lc-cn-n1-shared.com',
    
    // 应用名称
    appName: '5G消息交流论坛'
};

// 导出配置（供其他文件使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LEANCLOUD_CONFIG;
}
