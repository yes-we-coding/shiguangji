---
title: 给博客加 SEO 和 a11y：最后一公里，是最容易忘的那种活
date: 2026-08-08
excerpt: 站点能跑、样式好看、文章能读——但分享出去没卡片，屏幕阅读器读不出勾选框。这种"看不见的 bug"才是上线前最该修的。
tags: [前端, 博客]
---

博客写到第七个月，文章列表好看得很，但一直没做两件事：**SEO meta** 和**可访问性 (a11y)**。

它们不会让页面"更好看"，但决定了这个站能不能被搜到、被分享、被视障读者用上——也就是决定了它是不是真的"在线"。

这次一口气补上。

## SEO：让每篇文章都有自己的名片

分享一个链接到微信 / 微博 / Twitter，平台会去抓页面里的 Open Graph 标签。之前我的页面只有一行 `<title>`，所以分享出去永远长这样：

> 文章 · 拾光集
> （没有描述、没有图）

修起来比想象中简单。`index.html` 里加几行：

```html
<meta name="description" content="拾起时光的碎片……" />
<meta property="og:type" content="website" />
<meta property="og:title" content="拾光集 · 阿拾的博客" />
<meta property="og:description" content="拾起时光的碎片……" />
<meta name="twitter:card" content="summary" />
<!-- 还有 keywords / author / robots / theme-color -->
```

这样默认页（首页 / 归档 / 关于）就有了基础名片。

### 文章页要"动态"换

但 Open Graph 最值钱的地方是：**每篇文章都应该有自己的 og 标签**。

不然分享一篇「CSS 变量换肤」出去，描述里写的还是「拾起时光的碎片」，对读者毫无吸引力。

我抽了一个小工具 `src/utils/seo.js`：

```js
export const updateMeta = (meta) => {
  for (const [key, value] of Object.entries(meta)) {
    if (!value) continue
    set(key, value, attrFor(key))
  }
}

export const resetMeta = () => updateMeta(DEFAULT_META)
```

`attrFor` 自动判断 `og:` / `article:` 用 `property` 属性，其他用 `name`，调用方不用关心底层细节。

`PostView` 里 `watch` 当前文章，挂载时更新，卸载时还原：

```js
watch(() => post.value, (val) => {
  if (!val) return
  document.title = `${val.title} · 拾光集`
  updateMeta({
    description: val.excerpt,
    'og:title': val.title,
    'og:description': val.excerpt,
    'og:type': 'article',
  })
}, { immediate: true })

onUnmounted(resetMeta)
```

为什么用 `watch` 而不是 `onMounted`？因为同一页面内点"上一篇 / 下一篇"切换文章时，`onMounted` 不会再触发，但 `watch` 会。

## 可访问性：补三个最容易被忽略的

### 1. toggle 按钮要 `aria-pressed`

主题切换按钮是个 **toggle button**——它有"按下"和"未按下"两种状态。屏幕阅读器不知道当前是哪个，因为它看不到颜色变化。

```html
<button
  :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
  :aria-pressed="isDark"
  @click="$emit('toggle-theme')"
>
```

`aria-pressed` 直接告诉 AT："这是个开关，目前是开 / 关状态。"

### 2. checkbox 不一定非得是 `<input>`

待办清单的勾选框我用了 `<button>` 加 SVG 做样式，因为要做圆形 + 动画，输入框样式不好改。问题是：**按钮没有"勾选"语义**，屏幕阅读器只会读"按钮"。

最干净的做法是用真正的 `<input type="checkbox">` 套样式，但改动太大。折中方案：加 ARIA 让按钮"扮演" checkbox：

```html
<button
  role="checkbox"
  :aria-checked="todo.done"
  :aria-label="`${todo.text}，${todo.done ? '已完成' : '未完成'}，点击切换`"
  @click="todo.done = !todo.done"
>
```

> WAI-ARIA 允许给原生元素"加戏"，但代价是责任也来了——`role="checkbox"` 必须配 `aria-checked`，状态变了要同步更新，不然就比不用更糟。

### 3. 对比度不是玄学

WCAG AA 要求正文文字对比度 ≥ 4.5:1。我之前的 `--text-muted: #8a857d` 在暖纸白底上算了一下：

```
亮度比 = (0.965 + 0.05) / (0.234 + 0.05) ≈ 3.6
```

3.6 < 4.5，不合格。提到 `#6f6a62`：

```
亮度比 = (0.965 + 0.05) / (0.144 + 0.05) ≈ 5.2 ✓
```

一个色号差几位就能卡在合规线上。**做完调色板，顺手算一遍比肉眼判断靠谱**。

> 浏览器 DevTools 自带对比度检查：审查元素 → Styles 面板里点色块 → 弹窗最下面有 "Contrast ratio"。比下载工具方便。

## 经验

SEO 和 a11y 不像性能优化那样有"立竿见影的数字"，但属于那种**不做也没人骂你，做了也没人夸你**的活——这种活最该做。

三个实操层面的建议：

1. **meta 标签先静态、后动态**。首页那批直接写 `index.html`，文章页的再写 watch 更新。避免一开始就想"全都要动态"导致过度设计
2. **`role` 是"承诺"，不是"装饰"**。写了 `role="checkbox"` 就要保证所有该有的状态属性都跟上，否则比不用更糟
3. **a11y 和 SEO 是同一类问题**：都是"机器 / 工具能不能理解你的页面"。理解了才可能被索引、被读屏、被分享

> 站点的"完整"，不只是视觉上的完整。
