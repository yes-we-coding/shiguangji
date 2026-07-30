---
title: Vite 构建速度优化实践
date: 2026-05-25
excerpt: 项目越来越大，冷启动和热更新开始变慢。通过依赖预构建、按需引入和分包策略，把构建时间压缩了一半。
tags: [前端, 工具]
---

项目跑了两年，冷启动从秒开变成十几秒，构建更是慢到可以去泡杯茶。花了一周时间治理，构建时间压缩了一半。记录几个最有效的手段。

## 先量化，再优化

别凭感觉优化。先跑一次带统计的构建，看清楚时间花在哪：

```bash
vite build --mode analyze
```

配合 `rollup-plugin-visualizer` 生成包体积报告，一眼看出谁是元凶。

## 三个见效最快的手段

### 1. 检查依赖预构建

冷启动慢，八成是有 CommonJS 依赖没被预构建，或者预构建缓存反复失效。把相关依赖显式加进 `optimizeDeps.include`：

```js
export default defineConfig({
  optimizeDeps: {
    include: ['lodash-es', 'dayjs'],
  },
})
```

### 2. 组件库按需引入

全量引入的组件库是构建和体积的双重负担。换成按需引入后，产物直接小了 40%。

### 3. 手动分包

默认分包策略下，所有依赖挤在一个 chunk 里，改一行业务代码，整包缓存失效。用 `manualChunks` 把稳定的大型依赖单独拆分：

```js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['vue', 'vue-router'],
      },
    },
  },
}
```

## 结果

| 指标 | 优化前 | 优化后 |
|------|--------|--------|
| 冷启动 | 12s | 2s |
| 完整构建 | 96s | 45s |

工具链的体验就是开发者的幸福感，这笔投入很值。
