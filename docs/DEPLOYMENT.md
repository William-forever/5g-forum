# 网站部署指南

## 一、部署方式选择

### 方式1：静态网站托管（推荐，当前项目适用）
适用场景：纯前端项目（HTML/CSS/JS），无后端服务器

**推荐平台：**
| 平台 | 特点 | 费用 |
|------|------|------|
| GitHub Pages | 免费、稳定、与GitHub集成 | 免费 |
| Vercel | 免费、自动部署、全球CDN | 免费额度充足 |
| Netlify | 免费、拖拽部署、表单处理 | 免费 |
| 腾讯云 COS + CDN | 国内访问快、需备案 | 按量付费 |
| 阿里云 OSS + CDN | 国内访问快、需备案 | 按量付费 |

### 方式2：云服务器部署
适用场景：需要后端服务、数据库、动态内容

**推荐平台：**
- 腾讯云轻量应用服务器
- 阿里云ECS
- AWS Lightsail

---

## 二、部署前准备清单

### 1. 域名（可选但推荐）
- **购买渠道**：腾讯云、阿里云、GoDaddy、Namecheap
- **费用**：.com域名约50-80元/年，.cn域名约30元/年
- **备案**：国内服务器必须备案（约7-20个工作日）

### 2. 网站内容检查
- [ ] 所有页面能正常打开
- [ ] 所有图片、CSS、JS文件路径正确
- [ ] 移动端适配正常
- [ ] 各浏览器兼容性测试

### 3. 优化准备
- [ ] 图片压缩（TinyPNG）
- [ ] CSS/JS压缩（去除注释和空格）
- [ ] 启用Gzip压缩
- [ ] 添加SEO meta标签

---

## 三、具体部署步骤（以GitHub Pages为例）

### 步骤1：创建GitHub仓库
1. 注册/登录 [GitHub](https://github.com)
2. 点击 "New Repository"
3. 仓库名填写：`5g-forum`（或你的项目名）
4. 选择 "Public"（免费）
5. 点击 "Create repository"

### 步骤2：上传代码
```bash
# 在项目文件夹中执行
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/5g-forum.git
git push -u origin main
```

### 步骤3：启用GitHub Pages
1. 进入仓库 → Settings → Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 "main"，文件夹选择 "/ (root)"
4. 点击 Save
5. 等待1-2分钟，访问 `https://你的用户名.github.io/5g-forum/`

---

## 四、绑定自定义域名（可选）

### 步骤1：域名解析
在域名管理平台添加DNS记录：
| 记录类型 | 主机记录 | 记录值 |
|---------|---------|--------|
| CNAME | www | 你的用户名.github.io |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |

### 步骤2：配置GitHub Pages
1. 在仓库根目录创建 `CNAME` 文件
2. 文件内容填写：`www.yourdomain.com`
3. 提交并推送

### 步骤3：开启HTTPS
在GitHub Pages设置中勾选 "Enforce HTTPS"

---

## 五、费用预算

| 项目 | 免费方案 | 基础方案 | 企业方案 |
|------|---------|---------|---------|
| **托管** | GitHub Pages：¥0 | 腾讯云COS：¥10-50/月 | 云服务器：¥100-500/月 |
| **域名** | 子域名：¥0 | .com域名：¥60/年 | 品牌域名：¥200+/年 |
| **CDN** | Cloudflare：¥0 | 腾讯云CDN：¥20+/月 | 企业CDN：¥200+/月 |
| **SSL证书** | Let's Encrypt：¥0 | 免费 | 企业证书：¥1000+/年 |
| **总计/年** | **¥0** | **¥300-1000** | **¥5000+** |

---

## 六、部署后维护

### 日常维护
- [ ] 定期备份代码
- [ ] 监控网站访问状态
- [ ] 更新过期内容
- [ ] 检查并修复死链

### 性能优化
- [ ] 使用Google PageSpeed Insights检测
- [ ] 图片懒加载
- [ ] 启用浏览器缓存
- [ ] 使用CDN加速

### 安全建议
- [ ] 定期更新依赖包
- [ ] 启用HTTPS
- [ ] 设置安全响应头
- [ ] 防止XSS攻击

---

## 七、快速部署命令参考

```bash
# 安装 Vercel CLI
npm i -g vercel

# 一键部署到Vercel
vercel --prod

# 安装 Surge CLI
npm i -g surge

# 一键部署到Surge
surge
```

---

## 八、推荐工具

| 用途 | 工具 |
|------|------|
| 图片压缩 | TinyPNG、Squoosh |
| 代码压缩 | Terser、cssnano |
| 性能检测 | Lighthouse、PageSpeed |
| 监控 | UptimeRobot、百度统计 |
| 免费图床 | SM.MS、GitHub |

---

## 九、常见问题

**Q1: 网站打开速度慢怎么办？**
- 使用CDN加速
- 压缩图片和代码
- 启用浏览器缓存
- 选择就近的服务器

**Q2: 如何让别人通过域名访问？**
- 购买域名并解析到服务器IP
- 国内服务器需要备案
- 配置SSL证书启用HTTPS

**Q3: 需要后端和数据库怎么办？**
- 使用云服务器部署
- 或使用Serverless服务（Vercel、Cloudflare Workers）
- 或使用BaaS服务（Firebase、Supabase）

---

*文档版本：1.0*
*更新日期：2026-03-10*
