# E视界 (DongguaTV Enhanced Edition)

现代流媒体聚合播放器，基于 Node.js 和 Vue 3 构建。原版项目：[Minerchu/dongguaTV](https://github.com/Minerchu/dongguaTV)

## 演示

https://ednovas-test.vercel.app （不包含任何数据）

<img width="2547" height="1226" alt="image" src="https://github.com/user-attachments/assets/15392a90-9078-45b6-828d-829402669950" />

<img width="2547" height="1227" alt="image" src="https://github.com/user-attachments/assets/d03543f5-34a4-414b-a131-62eda0af21b2" />

<img width="2547" height="1229" alt="image" src="https://github.com/user-attachments/assets/e8bd4e14-dbd2-4d49-a1fc-7979c1ca22a4" />

---

## 📚 目录

- [✨ 核心特性](#-核心特性)
- [🎨 界面升级](#-界面升级)
- [🛠️ 技术栈](#️-技术栈)
- [🔧 前置准备](#-前置准备)
- [📦 安装与运行](#-安装与运行)
- [🚀 部署](#-部署)
  - [Docker 部署](#-docker-部署推荐)
  - [Vercel 部署](#-vercel-部署)
  - [PM2 部署](#️-linux-服务器部署-pm2)
  - [宝塔面板部署](#-宝塔面板-aapanel-部署)
- [🔒 安全与高级功能](#-安全与高级功能)
- [🛡️ 广告过滤](#️-广告过滤)
- [📺 TV 模式](#-tv-模式)
- [🎛️ 偏好设置](#️-偏好设置)
- [🤖 Android APP](#-android-app)
- [💾 数据维护与备份](#-数据维护与备份)
- [⚠️ 免责声明](#️-免责声明)

---

## ✨ 核心特性

### 🎬 双引擎数据驱动
- **TMDb**：高质量电影/剧集元数据（海报、背景图、评分、简介、演职员表）
- **CMS 聚合源 (Maccms)**：集成多个自定义第三方资源站 API，自动**全网测速**，智能过滤失效源

### 🔍 智能搜索与聚合
- **实时流式搜索 (SSE)**：结果边搜边显，即时反馈
- **智能关键词匹配**：自动生成搜索变体（去除副标题、季数后缀等），同时搜索中英文名
- **自动英中翻译**：检测英文搜索词时自动通过 TMDB 获取中文译名
- **自动分组与合并**：同一影片的不同线路自动聚合，源数量实时更新
- **SQLite 永久缓存**：热搜词秒级响应

### 📺 沉浸式播放体验
- **影院模式**：暗色系沉浸布局，剧集网格选择
- **智能线路测速**：支持用户端直连和服务器代理测速
- **自动故障转移**：播放失败自动切换下一可用线路
- **投屏支持**：集成 DLNA/AirPlay 本地投屏
- **🛡️ 智能广告过滤**：自动过滤 M3U8 流中的广告分段

### 🌏 大陆用户优化
- **智能 IP 双重检测**：Cloudflare Trace + ipapi.co，自动切换反代模式
- **本地资源优先**：核心依赖库本地化部署，秒开无压力
- **一键安装脚本**：交互式配置

### 📱 多端支持
- **Android App**：沉浸式状态栏，适配刘海屏
- **PWA 支持**：添加到主屏幕即点即用
- **电视/盒子**：TV 模式遥控器导航，自动检测智能电视

### 🔒 安全与访问控制
- **全局访问密码**：支持记住登录状态 1 年
- **多用户模式**：独立观看历史，跨设备同步
- **远程配置加载**：多站点统一管理

---

## 🎨 界面升级

| 功能区域 | 原版 | **增强版** |
| :--- | :--- | :--- |
| **首页视觉** | 简单列表 | Netflix 风格 Hero 轮播，全屏动态背景 |
| **导航栏** | 固定顶部 | 智能融合，初始透明，滚动变黑 |
| **搜索框** | 固定位置 | 动态交互，下滑自动吸顶缩小 |
| **榜单浏览** | 有限静态列表 | 无限滚动，20+ 细分榜单 |
| **搜索体验** | 等待 loading | 实时流式加载 (SSE) |
| **线路选择** | 单一延迟 | 双模式测速（直连/代理） |
| **播放失败** | 手动切换 | 自动故障转移 |
| **启动体验** | 分块加载 | 优雅启动屏，丝滑过渡 |

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **Frontend** | Vue.js 3 (CDN), Bootstrap 5, FontAwesome 6, DPlayer, HLS.js |
| **Backend** | Node.js, Express, Axios |
| **Data Sources** | TMDb API v3, 48+ Maccms CMS APIs |
| **Deployment** | Docker, Vercel, PM2, 宝塔面板 |
| **Cache** | SQLite (推荐), JSON File, Memory |
| **Proxy** | Cloudflare Workers (大陆用户) |

---

## 🔧 前置准备

### 1. ⚠️ 配置采集源 (重要)

本项目**不包含**任何内置影视资源接口。需自行添加合法的 Maccms V10 (JSON 格式) 接口。

所有配置存储在 `db.json` 文件中（首次运行自动生成）：

```json
{
  "sites": [
    {
      "key": "unique_key1",
      "name": "站点名称1",
      "api": "https://...",
      "active": true
    }
  ]
}
```

### 2. 获取 TMDb API Key (必需)

1. 注册：[Create Account](https://www.themoviedb.org/signup)
2. 申请 API：[API Settings](https://www.themoviedb.org/settings/api) → **Create**
3. 应用类型选 **Developer**，用途填 "Personal learning project"
4. 复制 **API Key (v3 auth)** 备用

### 3. 大陆用户：部署 TMDB 反代 (可选)

TMDB 在大陆无法直接访问，需要配置反向代理：

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create Worker**
2. 复制 `cloudflare-tmdb-proxy.js` 内容到编辑器 → **Save and Deploy**
3. 获取 Worker URL，在 `.env` 中配置：
   ```env
   TMDB_PROXY_URL=https://tmdb-proxy.your-name.workers.dev
   ```

### 4. 资源站 CORS 代理 (可选)

当服务器或用户无法直接访问资源站时，系统自动通过 CORS 代理中转。

**核心功能：**
- ✅ 智能学习：自动记住需要代理的站点（24h 有效）
- ✅ 慢速检测：直连延迟 >1.5s 时自动测试代理
- ✅ m3u8 重写：自动代理 ts 分片 URL
- ✅ 防盗链绕过：自动设置 Referer/Origin

**工作流程：**
```
用户请求 m3u8 → 代理获取 m3u8 → 重写 ts 分片 URL → 返回修改后 m3u8 → 播放器通过代理请求 ts → 视频正常播放 ✓
```

**UI 状态标识：** 🟢 直连 | 🟡 中转 | 🔵 服务

#### 方案 A：Cloudflare Workers 部署

> ⚠️ 免费版每日 10 万次请求限制。个人自用通常没问题，多人使用建议用 VPS 方案。

1. Cloudflare → **Workers & Pages** → **Create Worker**
2. 复制 `cloudflare-cors-proxy.js` → **Save and Deploy**
3. 配置 `.env`：
   ```env
   CORS_PROXY_URL=https://cors-proxy.your-name.workers.dev
   ```

#### 方案 B：VPS / Node.js 部署

```bash
npm install express axios cors dotenv
PORT=8080 node proxy-server.js
# 或 PM2 守护：pm2 start proxy-server.js --name cors-proxy
```

`.env` 配置：`CORS_PROXY_URL=http://your-vps-ip:8080`

---

## 📦 安装与运行

### 🚀 一键安装脚本 (推荐)

```bash
curl -fsSL https://raw.githubusercontent.com/ednovas/dongguaTV/main/install.sh | bash
```

脚本会引导输入 TMDB API Key、反代地址、运行端口等。

### 手动安装

```bash
# 1. 安装 Node.js v18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. (可选) SQLite 编译工具
sudo apt-get install -y build-essential python3

# 3. 安装依赖
git clone https://github.com/ednovas/dongguaTV.git
cd dongguaTV && npm install

# 4. 配置环境变量
cp .env.example .env && nano .env

# 5. 启动
node server.js
```

访问 `http://localhost:3000`

#### 环境变量说明

| 变量名 | 必填 | 说明 |
|--------|------|------|
| `TMDB_API_KEY` | ✅ | TMDb API 密钥 |
| `CACHE_TYPE` | ❌ | `json`(默认) / `sqlite` / `memory` / `none` |
| `TMDB_PROXY_URL` | ❌ | TMDB 反代地址（大陆用户） |
| `CORS_PROXY_URL` | ❌ | CORS 代理地址 |
| `PORT` | ❌ | 服务端口，默认 3000 |
| `ACCESS_PASSWORD` | ❌ | 访问密码，支持多密码逗号分隔 |
| `REMOTE_DB_URL` | ❌ | 远程 db.json 地址 |

---

## 🚀 部署

### 🐳 Docker 部署（推荐）

> **🎉 多架构支持**：自动匹配 `linux/amd64`、`linux/arm64`、`linux/arm/v7`

镜像同时发布到 **GitHub Container Registry** 和 **Docker Hub**，选择任一即可：

| 镜像源 | 地址 |
|--------|------|
| **Docker Hub** | `docker.io/ednovas/dongguatv:latest` |
| **GHCR** | `ghcr.io/ednovas/dongguatv:latest` |

> 💡 如果 `ghcr.io` 拉取报 `manifest unknown`，请使用 Docker Hub 镜像或升级 Docker 到 20.10+。

#### 快速启动

```bash
docker run -d -p 3000:3000 \
  -e TMDB_API_KEY="your_api_key_here" \
  -e ACCESS_PASSWORD="your_password" \
  --name donggua-tv \
  --restart unless-stopped \
  ednovas/dongguatv:latest
```

#### 完整配置（持久化数据）

```bash
# 1. 先创建文件，防止 Docker 将其识别为目录
touch db.json cache.db
echo '{"sites":[]}' > db.json
mkdir -p cache/images

# 2. 启动
docker run -d -p 3000:3000 \
  -e TMDB_API_KEY="your_api_key_here" \
  -e ACCESS_PASSWORD="your_password" \
  -e TMDB_PROXY_URL="https://tmdb-proxy.your-name.workers.dev" \
  -e CORS_PROXY_URL="https://cors-proxy.your-name.workers.dev" \
  -e REMOTE_DB_URL="https://example.com/db.json" \
  -v $(pwd)/db.json:/app/db.json \
  -v $(pwd)/cache.db:/app/cache.db \
  -v $(pwd)/cache/images:/app/public/cache/images \
  --name donggua-tv \
  --restart unless-stopped \
  ednovas/dongguatv:latest
```

> ⚠️ 如果报错 `EISDIR: illegal operation on a directory`，说明没有先创建文件。执行 `rm -rf db.json && touch db.json` 后重试。

#### Docker Compose

```yaml
services:
  donggua-tv:
    image: ednovas/dongguatv:latest
    container_name: donggua-tv
    ports:
      - "3000:3000"
    environment:
      - TMDB_API_KEY=your_api_key_here
      - TMDB_PROXY_URL=https://tmdb-proxy.your-name.workers.dev
      - CORS_PROXY_URL=https://cors-proxy.your-name.workers.dev
      - ACCESS_PASSWORD=your_secure_password
      - REMOTE_DB_URL=https://example.com/db.json
    volumes:
      - ./db.json:/app/db.json
      - ./cache.db:/app/cache.db
    restart: unless-stopped
```

```bash
touch db.json cache.db
docker compose up -d
```

#### 本地构建镜像

```bash
docker build -t donggua-tv .
docker run -d -p 3000:3000 -e TMDB_API_KEY="your_key" --name donggua-tv donggua-tv
```

---

### ▲ Vercel 部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fednovas%2FdongguaTV&env=TMDB_API_KEY,SITES_JSON,REMOTE_DB_URL,ACCESS_PASSWORD,TMDB_PROXY_URL&envDescription=TMDB_API_KEY%20is%20required.%20Use%20SITES_JSON%20(Base64)%20or%20REMOTE_DB_URL%20for%20site%20config.&envLink=https%3A%2F%2Fgithub.com%2Fednovas%2FdongguaTV%23-vercel-%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F%E9%85%8D%E7%BD%AE%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9)

#### 环境变量配置

在 **Settings → Environment Variables** 中添加：

- `TMDB_API_KEY`（必填）
- `REMOTE_DB_URL` 或 `SITES_JSON`（二选一，推荐 `SITES_JSON`）
- `ACCESS_PASSWORD`、`TMDB_PROXY_URL`（可选）

> **SITES_JSON 用法：** 直接填入 JSON 或 Base64 编码的 db.json 内容：
> ```
> SITES_JSON={"sites":[{"key":"ffzy","name":"非凡影视","api":"https://api.ffzyapi.com/api.php/provide/vod/"}]}
> ```

#### 常见问题

| 问题 | 解决 |
|------|------|
| 环境变量不生效 | 修改后必须 **Redeploy** |
| 显示 missing | 检查变量名大小写，确认勾选 **Production** |
| 诊断 | 访问 `/api/debug` 查看配置状态 |

#### Vercel 限制

- ❌ SQLite 缓存（使用内存替代）
- ❌ 本地图片缓存
- ❌ 本地 db.json（必须配置 `REMOTE_DB_URL` 或 `SITES_JSON`）
- ❌ 多用户历史同步

---

### 🖥️ Linux 服务器部署 (PM2)

```bash
# 安装 Node.js + PM2
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pm2

# 获取代码
git clone https://github.com/ednovas/dongguaTV.git
cd dongguaTV && npm install
cp .env.example .env && nano .env

# 启动并设置开机自启
pm2 start server.js --name "donggua-tv"
pm2 save && pm2 startup
```

---

### 🏰 宝塔面板 (aaPanel) 部署

1. **软件商店** 安装 **Node.js 版本管理器** (v18+)
2. SSH 安装编译工具：
   ```bash
   # Ubuntu/Debian
   sudo apt-get install build-essential python3 -y
   # CentOS
   sudo yum groupinstall "Development Tools" -y && sudo yum install python3 -y
   ```
3. **网站** → **Node 项目** → **添加**，启动选项 `server.js`，端口 `3000`
4. 配置 `.env` 文件，重启服务
5. 映射/绑定域名

---

## 🔒 安全与高级功能

### 全局访问密码

```env
ACCESS_PASSWORD=your_secure_password
```

### 远程配置文件

```env
REMOTE_DB_URL=https://example.com/my-config/db.json
```

> 5 分钟内存缓存，远程失败自动降级到本地 db.json。

### 多用户模式与历史同步

多个密码用逗号分隔，每个密码代表一个独立用户：

```env
ACCESS_PASSWORD=admin_password,user1_pass,user2_pass
```

| 密码位置 | 行为 |
|---------|------|
| 第一个 | 传统模式，历史仅存本地 |
| 第二个及之后 | 云同步，历史跨设备同步 |

**同步特性：** 自动同步 · 本地优先 · 智能合并 · 隐蔽提示

> ⚠️ 历史同步**仅在 `CACHE_TYPE=sqlite` 模式下可用**。

---

## 🛡️ 广告过滤

内置智能广告过滤模块，自动检测并过滤 M3U8 视频流中的广告分段。

**工作原理：**
1. `#EXT-X-DISCONTINUITY` 标签检测：识别短分段组（3-120s）并过滤
2. 广告域名模式匹配：内置主流广告平台域名特征
3. HLS.js Loader 拦截：加载阶段直接过滤，对用户透明

**支持平台：** 百度广告 · 腾讯广点通 · 阿里妈妈 · 字节穿山甲 · 爱奇艺/芒果 TV · Google DoubleClick

**使用方式：**
- 默认开启，播放器设置菜单可开关
- 成功过滤后显示：`🛡️ 已过滤 X 个广告 (Y秒)`
- Console API：`AdFilter.enable()` / `AdFilter.disable()` / `AdFilter.getStats()`

---

## 📺 TV 模式

页面底部提供 TV 模式切换入口，支持遥控器方向键导航。

| 操作 | 效果 |
|------|------|
| 点击底部 📺 TV 按钮 | 切换 TV 模式 |
| URL `?tv=1` / `?tv=0` | 手动控制 |

**TV 模式特性：** 方向键导航 · 焦点高亮 · 确认键选择 · 返回键退出

**自动检测：** Android TV · Fire TV · Samsung Tizen · LG WebOS · Roku · Chromecast

---

## 🎛️ 偏好设置

页面底部 ⚙️ 偏好设置按钮，配置自动保存到 `localStorage`。

| 选项 | 说明 | 默认 |
|------|------|------|
| 隐藏随机盲盒 | 关闭首页随机推荐板块 | 关闭 |
| 过滤成人内容 | 过滤 R/NC-17/TV-MA 级内容 | **开启** |

---

## 🤖 Android APP

### 自动构建 (GitHub Actions)

推送 `v*.*.*` 格式的 Tag 时自动触发构建，在 **Releases** 页面下载 APK。

```bash
git tag v1.0.0
git push origin v1.0.0
```

### 自定义构建

无需修改代码，在 GitHub **Actions** → **Android Build & Release** → **Run workflow** 中填入：
- Server URL、App Name、Version Tag

### 默认配置

| 配置项 | 值 |
|--------|-----|
| App 名称 | E视界 |
| 默认服务器 | `https://ednovas.video` |
| 图标来源 | 自动从 `public/icon.png` 生成 |

### 代码修改 (高级)

<details>
<summary>点击展开</summary>

**修改服务器地址：** 编辑 `capacitor.config.json` 的 `server.url`

**修改 App 名称：** 编辑 `android/app/src/main/res/values/strings.xml`

**修改版本号：** 编辑 `android/app/build.gradle` 的 `versionCode` / `versionName`

**本地构建：**
```bash
npm install && npx cap sync android
cd android && ./gradlew assembleRelease
```
APK 位于 `android/app/build/outputs/apk/release/`

</details>

### ⚠️ App 问题与替代方案

遇到安装失败、闪退、播放异常等问题？推荐以下替代方案：

1. **🌐 网页版（推荐）** - 兼容性最好，无需安装，电视推荐当贝浏览器
2. **📺 投屏播放** - 点击「一键投屏」，支持 DLNA/AirPlay
3. **📱 PWA 模式** - 浏览器中「添加到主屏幕」

---

## 💾 数据维护与备份

核心数据文件：

| 文件 | 说明 |
|------|------|
| `db.json` | 采集源配置（重要） |
| `cache.db` | SQLite 缓存数据库 |
| `cache_search.json` / `cache_detail.json` | JSON 模式缓存 |

```bash
# 备份
mkdir -p ~/backup
cp /opt/dongguaTV/db.json ~/backup/
[ -f /opt/dongguaTV/cache.db ] && cp /opt/dongguaTV/cache.db ~/backup/

# 清理缓存
rm /opt/dongguaTV/cache.db  # 或 rm /opt/dongguaTV/cache_*.json
pm2 restart donggua-tv
```

---

## 📝 贡献与致谢

本项目由 **kk爱吃王哥呆阿龟头** 设计编写，**ednovas** 优化了功能和部署流程。数据由 **TMDb** 和各式 **Maccms** API 提供。

---

## ⚠️ 免责声明

1. **仅供学习交流**：本项目仅作为 Node.js 和 Vue 3 的学习练手项目开源。
2. **API 说明**：本项目不内置任何有效的影视资源采集接口。
3. **自行配置**：使用者需自行寻找合法的接口并遵守相关法律法规。
4. **内容无关**：开发者不存储、不发布、不参与任何视频内容的制作与传播。

---

*Enjoy your movie night! 🍿*
