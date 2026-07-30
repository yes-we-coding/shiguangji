---
title: Vite 部署到 GitHub Pages：从零到自动化的避坑记录
date: 2026-07-30
excerpt: base 路径、hash 路由、Actions 工作流、gh CLI 的三个权限坑……把这次部署博客踩过的坑全记下来，下次照抄就行。
tags: [前端, 工具]
---

刚把博客部署到 GitHub Pages，过程比预想的曲折。把关键步骤和坑按顺序记下来。

## 两个必须做的配置

### 1. base 路径

部署到 `用户名.github.io/仓库名/` 这种子路径，`vite.config.js` 必须设：

```js
export default defineConfig({
  base: '/仓库名/',
})
```

漏了它，页面能打开但所有 JS/CSS 404——因为资源默认按根路径引用。

### 2. 路由用 hash 模式

GitHub Pages 是纯静态托管，没有服务端重写规则。history 模式的路由刷新子页面直接 404，hash 模式（`createWebHashHistory`）则完全没这个问题。SPA 部署到静态托管，hash 是最省心的选择。

## Actions 自动部署

官方模板即可，要点是 Pages 的构建来源要设为 **GitHub Actions**（不是传统的"从分支部署"）：

```bash
gh api repos/用户名/仓库名/pages -X POST -F "build_type=workflow"
```

之后每次 push 到 master 自动构建发布，一分钟生效。

## gh CLI 认证的三个坑

这次最大的时间在认证上。设备码流程在脚本化窗口里反复失败，最后改用 Personal Access Token，又连踩三坑：

1. **不勾权限的 token 等于没用**——创建时一个框都没勾，`X-Oauth-Scopes` 为空，只能读公开信息
2. **`workflow` 权限必须单独勾**——仓库里有 `.github/workflows/` 文件，只有 `repo` 权限推不上去
3. **gh CLI 自己还要 `read:org`**——少了它登录直接被拒：`missing required scope 'read:org'`

正确配方：**`repo` + `workflow` + `read:org`**，多勾少勾都不行。

## 经验

- 部署类问题先想"路径"和"路由模式"，这两个占了静态托管故障的大多数
- 认证出问题别死磕交互流程，token + 标准输入（`gh auth login --with-token`）最可控
- 权限报错时拿 `gh api user --include` 看响应头的 `X-Oauth-Scopes`，一眼定位
