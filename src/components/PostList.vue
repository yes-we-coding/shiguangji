<script setup>
import { computed, ref } from 'vue'
import { posts } from '../data/posts'
import { activeTag } from '../stores/postFilter'
import PostItem from './PostItem.vue'

const keyword = ref('')

const tags = computed(() => ['全部', ...new Set(posts.flatMap((p) => p.tags))])

const filteredPosts = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  return posts.filter((p) => {
    const matchTag = activeTag.value === '全部' || p.tags.includes(activeTag.value)
    const matchKeyword =
      !kw ||
      p.title.toLowerCase().includes(kw) ||
      p.excerpt.toLowerCase().includes(kw) ||
      p.tags.some((t) => t.toLowerCase().includes(kw))
    return matchTag && matchKeyword
  })
})
</script>

<template>
  <section class="posts-section">
    <div class="section-head">
      <h2 class="section-title">最新文章</h2>
      <span class="post-count">{{ filteredPosts.length }} 篇</span>
    </div>

    <div class="search-box">
      <svg
        class="search-icon"
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        v-model="keyword"
        type="search"
        placeholder="搜索文章标题、摘要或标签..."
        aria-label="搜索文章"
      />
    </div>

    <div class="tag-filter">
      <button
        v-for="tag in tags"
        :key="tag"
        class="tag-btn"
        :class="{ active: tag === activeTag }"
        @click="activeTag = tag"
      >
        {{ tag }}
      </button>
    </div>

    <TransitionGroup name="list" tag="ul" class="post-list">
      <PostItem
        v-for="(post, i) in filteredPosts"
        :key="post.id"
        v-reveal
        :post="post"
        :style="{ '--delay': `${Math.min(i, 6) * 0.06}s` }"
      />
      <li v-if="filteredPosts.length === 0" key="empty" class="no-result">
        没有找到相关文章，换个关键词试试
      </li>
    </TransitionGroup>
  </section>
</template>

<style scoped>
.posts-section {
  padding-bottom: 64px;
}

.section-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 18px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
}

.section-title::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 10px;
  border-radius: 50%;
  background: var(--accent);
}

.post-count {
  font-size: 13px;
  color: var(--text-muted);
}

.search-box {
  position: relative;
  margin-bottom: 14px;
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 13px;
  color: var(--text-muted);
  transform: translateY(-50%);
  pointer-events: none;
}

.search-box input {
  width: 100%;
  padding: 9px 14px 9px 38px;
  font-size: 14px;
  font-family: inherit;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.search-box input::placeholder {
  color: var(--text-muted);
}

.search-box input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.no-result {
  padding: 28px 0;
  font-size: 13.5px;
  text-align: center;
  color: var(--text-muted);
}

.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.tag-btn {
  padding: 4px 14px;
  font-size: 13.5px;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 999px;
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s,
    background-color 0.2s;
}

.tag-btn:hover {
  color: var(--accent-deep);
  border-color: var(--accent);
}

.tag-btn.active {
  color: var(--accent-deep);
  font-weight: 500;
  background: var(--accent-soft);
  border-color: transparent;
}

.post-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.list-enter-active {
  transition: all 0.35s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
</style>
