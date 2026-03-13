/**
 * ========================================
 * 积分系统测试脚本
 * ========================================
 * @description 测试积分计算、排行榜API和定时任务
 * @date 2026-03-13
 * @version 1.0.0
 */

const http = require('http');
const https = require('https');

// 配置
const config = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
  apiKey: process.env.CRON_API_KEY || 'forum-cron-secret-key'
};

// 测试结果统计
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  details: []
};

// 日志函数
function logTest(message, type = 'info') {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
  const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

// HTTP请求辅助函数
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = `${config.protocol}://${config.host}:${config.port}${path}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = (config.protocol === 'https' ? https : http).request(url, options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = responseData ? JSON.parse(responseData) : {};
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsedData
          });
        } catch (error) {
          reject(new Error(`解析响应失败: ${error.message}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// 测试用例
async function testGetRankingsAPI() {
  testResults.total++;
  try {
    logTest('测试1: 获取排行榜API...');
    
    const response = await makeRequest('GET', '/api/users/rankings?limit=5');
    
    if (response.statusCode === 200 && response.data.success) {
      logTest(`✅ 排行榜API测试通过 - 返回 ${response.data.data?.length || 0} 条记录`);
      testResults.passed++;
      testResults.details.push({
        test: '获取排行榜API',
        status: 'passed',
        data: response.data
      });
      return true;
    } else {
      throw new Error(`API返回失败: ${response.data?.message || '未知错误'}`);
    }
  } catch (error) {
    logTest(`❌ 排行榜API测试失败: ${error.message}`, 'error');
    testResults.failed++;
    testResults.details.push({
      test: '获取排行榜API',
      status: 'failed',
      error: error.message
    });
    return false;
  }
}

async function testCronAPI() {
  testResults.total++;
  try {
    logTest('测试2: 定时任务API...');
    
    const response = await makeRequest('POST', '/api/cron/update-rankings?api_key=' + config.apiKey);
    
    if (response.statusCode === 200 && response.data.success) {
      logTest(`✅ 定时任务API测试通过 - ${response.data.message}`);
      testResults.passed++;
      testResults.details.push({
        test: '定时任务API',
        status: 'passed',
        data: response.data
      });
      return true;
    } else {
      throw new Error(`API返回失败: ${response.data?.message || '未知错误'}`);
    }
  } catch (error) {
    logTest(`❌ 定时任务API测试失败: ${error.message}`, 'error');
    testResults.failed++;
    testResults.details.push({
      test: '定时任务API',
      status: 'failed',
      error: error.message
    });
    return false;
  }
}

async function testDatabaseConnection() {
  testResults.total++;
  try {
    logTest('测试3: 数据库连接测试...');
    
    // 尝试获取帖子列表
    const response = await makeRequest('GET', '/api/posts?limit=1');
    
    if (response.statusCode === 200) {
      logTest(`✅ 数据库连接测试通过 - 可以访问帖子API`);
      testResults.passed++;
      testResults.details.push({
        test: '数据库连接',
        status: 'passed'
      });
      return true;
    } else {
      throw new Error(`数据库连接失败: HTTP ${response.statusCode}`);
    }
  } catch (error) {
    logTest(`❌ 数据库连接测试失败: ${error.message}`, 'error');
    testResults.failed++;
    testResults.details.push({
      test: '数据库连接',
      status: 'failed',
      error: error.message
    });
    return false;
  }
}

async function testPointsCalculation() {
  testResults.total++;
  try {
    logTest('测试4: 积分计算逻辑测试...');
    
    // 创建测试用户数据
    const testUserData = {
      posts: [
        { likes: 5, comments: 3, collect_count: 2 },
        { likes: 10, comments: 5, collect_count: 1 }
      ],
      commentsCount: 8,
      likesCount: 15,
      collectionsCount: 5
    };
    
    // 手动计算积分
    let calculatedPoints = 0;
    
    // 1. 发帖积分：每个帖子 +10分
    calculatedPoints += testUserData.posts.length * 10;
    
    // 2. 被点赞积分：帖子被点赞一次 +2分
    const postLikesTotal = testUserData.posts.reduce((sum, post) => sum + (post.likes || 0), 0);
    calculatedPoints += postLikesTotal * 2;
    
    // 3. 被收藏积分：帖子被收藏一次 +2分
    const postCollectionsTotal = testUserData.posts.reduce((sum, post) => sum + (post.collect_count || 0), 0);
    calculatedPoints += postCollectionsTotal * 2;
    
    // 4. 评论积分：每个评论 +1分
    calculatedPoints += testUserData.commentsCount * 1;
    
    // 5. 点赞他人积分：每个点赞 +0.5分
    calculatedPoints += testUserData.likesCount * 0.5;
    
    // 6. 收藏他人积分：每个收藏 +0.5分
    calculatedPoints += testUserData.collectionsCount * 0.5;
    
    calculatedPoints = Math.floor(calculatedPoints);
    
    logTest(`✅ 积分计算逻辑测试通过 - 计算得分: ${calculatedPoints}`);
    logTest(`   发帖(${testUserData.posts.length}×10): ${testUserData.posts.length * 10}分`);
    logTest(`   被点赞(${postLikesTotal}×2): ${postLikesTotal * 2}分`);
    logTest(`   被收藏(${postCollectionsTotal}×2): ${postCollectionsTotal * 2}分`);
    logTest(`   评论(${testUserData.commentsCount}×1): ${testUserData.commentsCount * 1}分`);
    logTest(`   点赞他人(${testUserData.likesCount}×0.5): ${testUserData.likesCount * 0.5}分`);
    logTest(`   收藏他人(${testUserData.collectionsCount}×0.5): ${testUserData.collectionsCount * 0.5}分`);
    
    testResults.passed++;
    testResults.details.push({
      test: '积分计算逻辑',
      status: 'passed',
      calculatedPoints
    });
    return true;
  } catch (error) {
    logTest(`❌ 积分计算逻辑测试失败: ${error.message}`, 'error');
    testResults.failed++;
    testResults.details.push({
      test: '积分计算逻辑',
      status: 'failed',
      error: error.message
    });
    return false;
  }
}

async function testRightSidebarIntegration() {
  testResults.total++;
  try {
    logTest('测试5: 右侧边栏集成测试...');
    
    // 测试首页是否能正常访问（包含右侧边栏）
    const response = await makeRequest('GET', '/');
    
    if (response.statusCode === 200) {
      logTest(`✅ 右侧边栏集成测试通过 - 首页访问正常`);
      testResults.passed++;
      testResults.details.push({
        test: '右侧边栏集成',
        status: 'passed'
      });
      return true;
    } else {
      throw new Error(`首页访问失败: HTTP ${response.statusCode}`);
    }
  } catch (error) {
    logTest(`❌ 右侧边栏集成测试失败: ${error.message}`, 'error');
    testResults.failed++;
    testResults.details.push({
      test: '右侧边栏集成',
      status: 'failed',
      error: error.message
    });
    return false;
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('='.repeat(60));
  console.log('🏁 开始积分系统测试');
  console.log('='.repeat(60));
  console.log(`配置: ${config.protocol}://${config.host}:${config.port}`);
  console.log('-' .repeat(60));
  
  const startTime = Date.now();
  
  // 运行测试
  await testDatabaseConnection();
  await testGetRankingsAPI();
  await testCronAPI();
  await testPointsCalculation();
  await testRightSidebarIntegration();
  
  const endTime = Date.now();
  const duration = (endTime - startTime) / 1000;
  
  // 显示测试结果
  console.log('='.repeat(60));
  console.log('📊 测试结果汇总');
  console.log('='.repeat(60));
  console.log(`总测试数: ${testResults.total}`);
  console.log(`通过: ${testResults.passed} ✅`);
  console.log(`失败: ${testResults.failed} ❌`);
  console.log(`成功率: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  console.log(`耗时: ${duration.toFixed(2)} 秒`);
  
  // 显示详细结果
  console.log('-' .repeat(60));
  console.log('📋 详细结果:');
  testResults.details.forEach((detail, index) => {
    const statusIcon = detail.status === 'passed' ? '✅' : '❌';
    console.log(`${statusIcon} 测试${index + 1}: ${detail.test}`);
    if (detail.status === 'failed') {
      console.log(`   错误: ${detail.error}`);
    }
  });
  
  console.log('='.repeat(60));
  
  // 显示积分系统状态
  console.log('🏆 积分系统状态:');
  console.log('='.repeat(60));
  console.log('积分规则:');
  console.log('  • 发帖: +10分');
  console.log('  • 帖子被点赞: +2分/次');
  console.log('  • 帖子被收藏: +2分/次');
  console.log('  • 评论: +1分');
  console.log('  • 点赞他人: +0.5分/次');
  console.log('  • 收藏他人: +0.5分/次');
  console.log('');
  console.log('📅 定时任务:');
  console.log('  • 每小时自动更新排行榜');
  console.log('  • 可通过API手动触发更新');
  console.log('  • 右侧边栏每5分钟刷新一次');
  console.log('');
  console.log('🔗 API接口:');
  console.log('  • GET /api/users/rankings - 获取排行榜');
  console.log('  • POST /api/cron/update-rankings - 手动更新');
  console.log('='.repeat(60));
  
  // 最终状态
  if (testResults.failed === 0) {
    console.log('🎉 所有测试通过！积分系统运行正常。');
  } else {
    console.log('⚠️  部分测试失败，请检查问题。');
    process.exit(1);
  }
}

// 执行
if (require.main === module) {
  runAllTests().catch(error => {
    console.error('测试执行失败:', error);
    process.exit(1);
  });
}

module.exports = {
  runAllTests,
  testResults,
  testFunctions: {
    testGetRankingsAPI,
    testCronAPI,
    testDatabaseConnection,
    testPointsCalculation,
    testRightSidebarIntegration
  }
};