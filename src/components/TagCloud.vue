<script setup>
import { computed } from 'vue'
import { posts } from '../data/posts'
import { activeTag } from '../stores/postFilter'

const tags = computed(() => {
  const counts = new Map()
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) || 0) + 1)
    }
  }
  const max = Math.max(...counts.values())
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({
      name,
      count,
      // 按文章数映射字号 12.5 ~ 16.5px
      size: 12.5 + (count / max) * 4,
    }))
})

function select(name) {
  activeTag.value = activeTag.value === name ? '全部' : name
  // 让文章列表进入视口
  document.querySelector('.posts-section')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="widget-card">
    <h3 class="widget-title">标签云</h3>
    <div class="tag-cloud">
      <button
        v-for="tag in tags"
        :key="tag.name"
        class="cloud-tag"
        :class="{ active: tag.name === activeTag }"
        :style="{ fontSize: `${tag.size}px` }"
        :title="`${tag.count} 篇文章`"
        @click="select(tag.name)"
      >
        {{ tag.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 14px;
}

.cloud-tag {
  padding: 0;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  transition:
    color 0.2s,
    transform 0.2s;
}

.cloud-tag:hover {
  color: var(--accent-deep);
  transform: translateY(-1px);
}

.cloud-tag.active {
  color: var(--accent-deep);
  font-weight: 600;
}
</style>
