---
title: Composition API 三个月使用心得
date: 2026-07-15
excerpt: 从 Options API 迁移到 Composition API 后，代码组织方式发生了哪些变化？聊聊 setup 语法糖、组合式函数和一些踩过的坑。
tags: [Vue]
---

三个月前把手里项目的组件全部从 Options API 迁到了 Composition API，现在回头看，有些心得值得记下来。

## 最大的变化：按"逻辑"而不是按"选项"组织代码

Options API 时代，一个功能的代码被拆散在 `data`、`methods`、`computed`、`watch` 各处，功能一多就要上下翻滚。Composition API 让同一件事的所有代码待在一起：

```js
// 与"搜索"相关的一切都在这几行里
const keyword = ref('')
const results = computed(() => list.filter(match(keyword)))
watch(keyword, saveToHistory)
```

组件越大，这种组织方式的优势越明显。

## 组合式函数是真正的杀手锏

逻辑复用从 mixins 的"命名冲突地狱"变成了清爽的函数调用。比如这个博客里的 localStorage 持久化，就可以抽成一个 `useStorage`：

```js
function useStorage(key, initial) {
  const state = ref(JSON.parse(localStorage.getItem(key)) ?? initial)
  watch(state, (v) => localStorage.setItem(key, JSON.stringify(v)), { deep: true })
  return state
}
```

待办清单、习惯打卡，一行接入，各自独立。

## 踩过的坑

- **解构丢失响应性**：`const { count } = state` 之后 `count` 就是普通值了，要用 `toRefs`
- **watch 监听不到深层变化**：监听 reactive 对象的嵌套属性，记得加 `{ deep: true }` 或直接传 getter
- **ref 的 .value**：模板里不用写，脚本里不能忘，前期最常见的报错来源

## 总结

迁移的成本主要在前两周的思维转换，之后就是持续的收益。新项目没有理由再选 Options API 了。
