<script setup>
import { computed } from 'vue'
import { posts } from '../data/posts'

const byYear = computed(() => {
  const groups = new Map()
  for (const post of posts) {
    const year = post.date.slice(0, 4)
    if (!groups.has(year)) groups.set(year, [])
    groups.get(year).push(post)
  }
  return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]))
})
</script>

<template>
  <div class="container archive-page">
    <header class="archive-head">
      <h1 class="archive-title">归档</h1>
      <p class="archive-desc">共 {{ posts.length }} 篇文章，按年份整理</p>
    </header>

    <div v-for="[year, list] in byYear" :key="year" class="year-group">
      <h2 class="year-label">
        {{ year }}
        <span class="year-count">{{ list.length }} 篇</span>
      </h2>
      <ul class="timeline">
        <li v-for="post in list" :key="post.slug" class="timeline-item">
          <time class="item-date">{{ post.date.slice(5) }}</time>
          <router-link :to="`/post/${post.slug}`" class="item-title">
            {{ post.title }}
          </router-link>
          <span class="item-tags">
            <span v-for="tag in post.tags" :key="tag" class="item-tag">{{ tag }}</span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.archive-page {
  max-width: 780px;
  padding-top: 56px;
  padding-bottom: 64px;
}

.archive-head {
  margin-bottom: 40px;
  text-align: center;
}

.archive-title {
  margin-bottom: 10px;
  font-size: 26px;
  font-weight: 600;
}

.archive-desc {
  font-size: 14px;
  color: var(--text-muted);
}

.year-group {
  margin-bottom: 36px;
}

.year-label {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 14px;
  font-size: 20px;
  font-weight: 600;
}

.year-label::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 4px;
  border-radius: 50%;
  background: var(--accent);
}

.year-count {
  font-size: 13px;
  font-weight: 400;
  color: var(--text-muted);
}

.timeline-item {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 9px 12px;
  border-radius: 10px;
  transition: background-color 0.2s;
}

.timeline-item:hover {
  background: var(--surface);
}

.item-date {
  flex-shrink: 0;
  width: 44px;
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--text-muted);
}

.item-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s;
}

.item-title:hover {
  color: var(--accent-deep);
}

.item-tags {
  display: flex;
  flex-shrink: 0;
  gap: 6px;
}

.item-tag {
  padding: 1px 9px;
  font-size: 12px;
  color: var(--accent-deep);
  background: var(--accent-soft);
  border-radius: 999px;
}

@media (max-width: 640px) {
  .item-tags {
    display: none;
  }
}
</style>
