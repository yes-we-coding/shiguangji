<script setup>
import { computed, onMounted, ref } from 'vue'
import { posts } from '../data/posts'

// 建站日取第一篇文章的日期
const launchDate = computed(() => posts[posts.length - 1]?.date || '2026-01-01')

const targets = computed(() => [
  { label: '文章', value: posts.length, suffix: '篇' },
  {
    label: '总字数',
    value: posts.reduce((sum, p) => sum + p.words, 0),
    suffix: '字',
  },
  {
    label: '已陪伴',
    value: Math.max(
      1,
      Math.floor((Date.now() - new Date(launchDate.value)) / 86400000),
    ),
    suffix: '天',
  },
])

// 数字滚动动画
const displayed = ref(targets.value.map(() => 0))
const animated = ref(false)

onMounted(() => {
  requestAnimationFrame(() => {
    animated.value = true
    const duration = 900
    const start = performance.now()
    const from = displayed.value.slice()
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - t) ** 3
      displayed.value = targets.value.map((item, i) =>
        Math.round(from[i] + (item.value - from[i]) * eased),
      )
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
})
</script>

<template>
  <div class="widget-card">
    <h3 class="widget-title">站点统计</h3>
    <div class="stats-grid" :class="{ animated }">
      <div v-for="(item, i) in targets" :key="item.label" class="stat-item">
        <span class="stat-value">{{ displayed[i] }}</span>
        <span class="stat-label">{{ item.label }}（{{ item.suffix }}）</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 10px 4px;
  background: var(--accent-soft);
  border-radius: 12px;
}

.stat-value {
  font-family: var(--mono);
  font-size: 19px;
  font-weight: 600;
  color: var(--accent-deep);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 11.5px;
  color: var(--text-muted);
}
</style>
