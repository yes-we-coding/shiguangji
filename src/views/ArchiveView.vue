<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { posts } from '../data/posts'

const route = useRoute()
const router = useRouter()

const activeTag = computed(() => route.query.tag || null)

// 统计所有出现过的 tag + 篇数
const allTags = computed(() => {
  const counts = new Map()
  for (const post of posts) {
    for (const tag of post.tags || []) {
      counts.set(tag, (counts.get(tag) || 0) + 1)
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
})

const filteredPosts = computed(() => {
  if (!activeTag.value) return posts
  return posts.filter((p) => (p.tags || []).includes(activeTag.value))
})

const byYear = computed(() => {
  const groups = new Map()
  for (const post of filteredPosts.value) {
    const year = post.date.slice(0, 4)
    if (!groups.has(year)) groups.set(year, [])
    groups.get(year).push(post)
  }
  return [...groups.entries()].sort((a, b) => b[0].localeCompare(a[0]))
})

function setTag(tag) {
  router.replace({ query: tag ? { tag } : {} })
}
</script>

<template>
  <div class="container archive-page">
    <header class="archive-head">
      <h1 class="archive-title">归档</h1>
      <p class="archive-desc">
        <template v-if="activeTag">
          正在筛选标签
          <span class="filter-tag">{{ activeTag }}</span>
          · 共 {{ filteredPosts.length }} 篇
          <button class="clear-filter" @click="setTag(null)" type="button">
            清除 ×
          </button>
        </template>
        <template v-else>共 {{ posts.length }} 篇文章，按年份整理</template>
      </p>
    </header>

    <nav v-if="allTags.length" class="tag-filter" aria-label="按标签筛选">
      <button
        type="button"
        :class="['tag-chip', { active: !activeTag }]"
        @click="setTag(null)"
      >
        全部
        <span class="chip-count">{{ posts.length }}</span>
      </button>
      <button
        v-for="[tag, count] in allTags"
        :key="tag"
        type="button"
        :class="['tag-chip', { active: activeTag === tag }]"
        @click="setTag(tag)"
      >
        {{ tag }}
        <span class="chip-count">{{ count }}</span>
      </button>
    </nav>

    <div v-if="filteredPosts.length === 0" class="empty-state">
      「{{ activeTag }}」标签下还没有文章。
    </div>

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
  margin-bottom: 28px;
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

.filter-tag {
  padding: 1px 9px;
  font-weight: 600;
  color: var(--accent-deep);
  background: var(--accent-soft);
  border-radius: 999px;
}

.clear-filter {
  margin-left: 6px;
  padding: 0;
  font-size: 13px;
  color: var(--text-muted);
  background: transparent;
  border: 0;
  cursor: pointer;
  transition: color 0.2s;
}

.clear-filter:hover {
  color: var(--accent-deep);
}

.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 40px;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  font: inherit;
  font-size: 13px;
  color: var(--accent-deep);
  background: var(--accent-soft);
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 0.2s, background-color 0.2s, color 0.2s;
}

.tag-chip:hover {
  border-color: var(--accent);
}

.tag-chip.active {
  color: var(--surface);
  background: var(--accent);
  border-color: var(--accent);
}

.chip-count {
  font-family: var(--mono);
  font-size: 11px;
  opacity: 0.75;
}

.tag-chip.active .chip-count {
  opacity: 0.9;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
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