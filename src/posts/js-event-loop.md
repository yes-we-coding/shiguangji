---
title: 一篇读懂 JavaScript 事件循环
date: 2026-04-22
excerpt: 宏任务、微任务、渲染时机……用一张图和几个小例子，把事件循环的执行顺序讲清楚。
tags: [前端, JavaScript]
---

事件循环是 JavaScript 面试的高频题，也是理解异步行为的基石。这篇不讲八股，用最小的例子把执行顺序讲明白。

## 一句话版本

JS 是单线程的。代码分三种：**同步代码**立即执行，**微任务**（Promise 回调）在当前同步代码执行完后立刻执行，**宏任务**（setTimeout、事件回调）进入队列，等下一轮。

记住这个顺序就够了：

```
同步代码 → 清空微任务队列 → （可能渲染）→ 取一个宏任务 → 循环
```

## 经典考题

```js
console.log('1')

setTimeout(() => console.log('2'))

Promise.resolve().then(() => console.log('3'))

console.log('4')
```

输出是 `1 4 3 2`。拆解一下：

1. 同步代码先跑：`1`、`4`
2. 清空微任务队列：`3`
3. 进入下一轮宏任务：`2`

## 微任务会"插队"

关键规则：**每执行完一个宏任务，必须清空整个微任务队列**，包括执行过程中新产生的微任务。

```js
setTimeout(() => {
  console.log('timeout')
  Promise.resolve().then(() => console.log('promise inside'))
})

setTimeout(() => console.log('timeout 2'))
```

输出是 `timeout`、`promise inside`、`timeout 2`——微任务插在了两个宏任务之间。

## 和页面渲染的关系

浏览器会在"清空微任务之后、下一个宏任务之前"找机会渲染。这意味着：

- 微任务里做大量计算会阻塞渲染
- `requestAnimationFrame` 的回调在渲染前执行，适合做动画

## 总结

事件循环没有想象中复杂。抓住"微任务优先、每轮清一次"这个核心，剩下的都是排列组合。
