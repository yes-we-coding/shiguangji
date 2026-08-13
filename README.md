# 拾光集 · 个人博客

> 拾起时光的碎片——记录学习笔记、技术思考与生活随想。

基于 Vue 3 + Vite 的个人博客。整体走简洁风（暖纸白 + 鼠尾草绿的低饱和配色），
自带明暗主题、文章搜索 / 标签筛选、置顶文章、RSS、周报草稿自动化等实用能力。
没有评论、没有统计、没有第三方追踪，安安静静写字。

> 在线：[yes-we-coding.github.io/shiguangji](https://yes-we-coding.github.io/shiguangji/)

## 功能特性

**整体**
- 三栏响应式布局：左栏工具区 / 中栏文章主内容 / 右栏工具区，全部吸顶常驻（>1080px）
- 明暗双主题：跟随系统偏好，手动切换后经 localStorage 记忆
- 入场动效：各区块交错淡入上浮；自定义细滚动条、锚点平滑滚动
- 全局尊重 `prefers-reduced-motion`，自动关闭动效
- 键盘快捷键：`/` 聚焦搜索 · `t` 切换主题 · `Esc` 退出输入
- 顶部 1px 纸张纹理噪点背景；回到顶部悬浮按钮

**SEO & 可访问性**
- 完整的 meta（description / keywords / OG / Twitter Card / theme-color）
- 文章页动态切换专属 OG meta（`src/utils/seo.js`）
- 所有交互元素都有 `aria-label`、弹窗有 `role="dialog"` + `aria-modal`

**主栏**
- Hero 区：头像光晕、柔光斑背景、社交链接、打字机 tagline
- 文章列表：关键词搜索（标题 / 摘要 / 标签）+ 标签筛选 + 置顶文章徽章
- 文章详情：marked 渲染 Markdown · 代码块一键复制按钮 · 阅读进度条 · 上下篇导航

**左栏（吸顶）**
- 日期时间卡片：实时时钟、今年剩余天数、最近法定节假日倒计时
- 年进度条：今年已过 / 剩余天数 + 百分比
- 习惯打卡：周视图格子打卡，今日高亮、未来禁点、本周统计
- 每日一言：按天自动轮换，可手动"换一句"
- 站点统计：文章数 / 总字数 / 已陪伴天数（数字滚动动画）

**右栏（吸顶）**
- 待办清单：增删、勾选完成、未完成计数
- 番茄钟：专注 25 / 短休息 5 / 长休息 15 分钟，环形进度条、结束提示音、自动切换模式
- 标签云：按文章数映射字号，点击同步筛选文章

**自动化**
- **RSS**：`npm run build` 时自动生成 `public/rss.xml`，复制到 `dist/` 部署
- **周报草稿**：GitHub Actions 每周六北京时间 17:00 跑，爬取 HN / GitHub Trending / npm / 框架动态，自动生成草稿并开 PR
- **一键触发**：页脚有「生成周报草稿」按钮，填一次 GitHub PAT（只存本地 localStorage）即可手动触发
- **构建守门**：`prebuild` / `postbuild` 跑 `check-posts.mjs`，拦截含「编辑提示」标记的草稿上线

> 待办、打卡、PAT 都保存在浏览器 localStorage，刷新不丢失。

## 技术栈

- [Vue 3](https://vuejs.org/)（`<script setup>` 组合式 API）
- [Vite](https://vite.dev/) 8
- [vue-router](https://router.vuejs.org/)（hash 模式）
- [marked](https://marked.js.org/)（Markdown 渲染）
- 纯 CSS 变量实现主题系统，无 UI 框架依赖
- Node 脚本（`.mjs`）做构建期内容生成与守门

## 快速开始

```bash
npm install      # 安装依赖
npm run dev      # 启动开发服务器（默认 http://localhost:5173）
npm run build    # 构建：prebuild 检查 → 生成 RSS → vite build → postbuild 检查
npm run preview  # 本地预览构建产物
npm run digest   # 手动生成一份周报草稿到 drafts/（用于本地调试）
```

> 需要 Node ≥ 18（用了顶层 await / ESM `.mjs` / `fetch`）。

## 项目结构

```
my-blog/
├── index.html                 # 含完整 SEO meta
├── public/                    # 静态资源（含构建生成的 rss.xml）
├── scripts/                   # 构建期 Node 脚本
│   ├── check-posts.mjs        # 拦截含"编辑提示"的草稿
│   ├── build-rss.mjs          # 生成 RSS
│   └── build-weekly-digest.mjs# 生成周报草稿
├── .github/workflows/
│   ├── deploy.yml             # 推 master → 构建 → 部署 Pages
│   └── weekly-digest.yml      # 每周六自动跑 + 手动触发
└── src/
    ├── main.js                # 应用入口（注册路由、reveal 指令）
    ├── App.vue                # 主题 + 全局快捷键 + 页面过渡
    ├── style.css              # 全局样式与配色变量（主题核心）
    ├── data/
    │   └── posts.js           # 自动加载 src/posts/*.md，支持 front matter (pinned/draft)
    ├── router/index.js        # 4 个页面 + hash 历史 + 标题同步
    ├── stores/postFilter.js   # 标签筛选状态（PostList ↔ TagCloud 共享）
    ├── directives/reveal.js   # v-reveal：元素进入视口时浮现（已加保底）
    ├── utils/seo.js           # 文章页动态 meta
    ├── posts/                 # 文章 Markdown（含 front matter）
    ├── views/
    │   ├── HomeView.vue       # 三栏首页
    │   ├── PostView.vue       # 文章详情 + 代码复制按钮
    │   ├── ArchiveView.vue    # 按年份归档
    │   └── AboutView.vue
    └── components/
        ├── SiteHeader.vue     # 吸顶导航 + 主题切换 + 移动端汉堡菜单
        ├── SiteFooter.vue     # 页脚 + 「生成周报草稿」模态框
        ├── HeroSection.vue    # 头像 + 打字机 tagline
        ├── PostList.vue       # 搜索 + 标签筛选 + 列表
        ├── PostItem.vue       # 单篇文章（含置顶徽章）
        ├── DateTimeCard.vue   # 时钟 / 剩余天数 / 节假日
        ├── YearProgress.vue   # 年进度条
        ├── HabitCheckin.vue   # 周视图打卡
        ├── DailyQuote.vue     # 每日一言
        ├── SiteStats.vue      # 站点统计（数字滚动）
        ├── TodoList.vue       # 待办清单
        ├── PomodoroTimer.vue  # 番茄钟
        ├── TagCloud.vue       # 标签云
        ├── ReadingProgress.vue# 文章页顶部阅读进度条
        └── BackToTop.vue      # 回到顶部按钮
```

## 自定义指南

| 想改什么 | 改哪里 |
| --- | --- |
| 整套配色 | `src/style.css` 顶部 `:root` 与 `[data-theme='dark']` 中的 CSS 变量 |
| 文章内容 | `src/posts/*.md` 放新文件即可，配 front matter（title / date / excerpt / tags / pinned） |
| 置顶文章 | front matter 加 `pinned: true` |
| 草稿 | 含 `📝 编辑提示` 标记的文件会被构建拦截，避免误上线 |
| 昵称、简介、社交链接 | `src/components/HeroSection.vue` |
| 博客名 / 站点信息 | `src/components/SiteHeader.vue` + `index.html` 的 `<title>` + `scripts/build-rss.mjs` 的 `SITE` 常量 |
| 习惯列表 | `src/components/HabitCheckin.vue` 顶部的 `habits` 数组 |
| 语录库 | `src/components/DailyQuote.vue` 顶部的 `QUOTES` 数组 |
| 法定节假日 | `src/components/DateTimeCard.vue` 顶部的 `HOLIDAYS` 数组（每年按国务院安排更新） |
| 番茄钟时长 | `src/components/PomodoroTimer.vue` 顶部的 `MODES` 对象 |
| SEO 默认 meta | `index.html` + `src/utils/seo.js` 的 `DEFAULT_META` |
| 站点 URL（RSS 用）| `scripts/build-rss.mjs` 的 `SITE.link` |

## 周报草稿（自动 + 手动）

**自动**：每周六北京时间 17:00（UTC 09:00）由 `.github/workflows/weekly-digest.yml` 触发，
抓取 HackerNews、GitHub Trending、npm 下载趋势、Vue/React/Vite/Next 最新版本，
生成 `drafts/digest-YYYY-MM-DD.md` 并开 PR（含审阅 checklist）。

**手动**：页脚点「📰 生成周报草稿」按钮 → 弹窗里填一个
[Fine-grained PAT](https://github.com/settings/tokens?type=beta)（只勾本仓库 + Actions: Write）
→ 点触发。Token 只存浏览器 localStorage，不上传任何服务器。

## 部署

推 `master` 即自动部署到 GitHub Pages（`.github/workflows/deploy.yml`）。
仓库设置里把 Pages source 设为「GitHub Actions」即可。

## 后续规划

- 归档页加按标签 / 按阅读时长筛选
- 文章支持搜索高亮（而非只过滤）
- 把 `marked` 换支持自定义渲染器，给 `<pre>` 自带语言标签