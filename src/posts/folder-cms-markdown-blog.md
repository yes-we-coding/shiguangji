---
title: 把博客做成"文件夹 CMS"：丢个 Markdown 文件就是发文
date: 2026-07-30
excerpt: 不想维护一份手动的文章清单数据，于是让 src/posts 目录自己说话：front matter 存元信息，import.meta.glob 自动加载，字数和阅读时长全自动算。
tags: [前端, Vue]
---

很多博客项目都有一个 `posts.js` 或 `posts.json`，手动登记每篇文章的标题、日期、摘要。发新文章要改两处：加文件、登记数据。迟早有一天会忘了同步。

更好的做法是让文件系统自己当数据库——**约定优于配置**。

## 整体方案

```
src/posts/
├── hello-world.md      ← 文件名就是 URL slug
├── css-details.md
└── ...
```

每个文件顶部用 front matter 写元信息，正文就是 Markdown：

```markdown
---
title: 文章标题
date: 2026-07-30
excerpt: 摘要
tags: [前端, Vue]
---

正文……
```

## 加载只要一个 glob

Vite 的 `import.meta.glob` 配合 `?raw`，构建时把目录下所有 Markdown 打成静态资源：

```js
const files = import.meta.glob('../posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})
```

front matter 解析器也就二十行：正则切出头部，逐行读 `key: value`，`[a, b]` 形式的值切成数组。

## 能算的都不手写

文章数据里有几个字段，其实是**可以从正文推导**的：

- **字数**：去掉空白和 Markdown 标记符号后数字符
- **阅读时长**：字数 ÷ 400（中文阅读速度约每分钟 400 字）
- **slug**：文件名

手写就会错，推导永远准。

## 发文流程的最终形态

1. 在 `src/posts/` 新建 `.md` 文件，写 front matter 和正文
2. `git push`

列表、搜索、标签筛选、归档、详情页全部自动更新。没有后台、没有数据库，但体验接近一个最小的 CMS。

## 经验

静态博客的"数据层"不必复杂：**文件系统 + 构建时加载 + 一点解析**，就覆盖了 90% 的需求。把同步的负担从人转移到构建工具上，是这类小项目最值得做的设计。
