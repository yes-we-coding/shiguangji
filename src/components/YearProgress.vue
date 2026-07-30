<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const now = ref(new Date())
const timer = setInterval(() => (now.value = new Date()), 60000)
onUnmounted(() => clearInterval(timer))

const year = computed(() => now.value.getFullYear())

const stats = computed(() => {
  const start = new Date(year.value, 0, 1)
  const end = new Date(year.value + 1, 0, 1)
  const elapsed = now.value - start
  const total = end - start
  return {
    percent: (elapsed / total) * 100,
    passed: Math.floor(elapsed / 86400000),
    remaining: Math.ceil((total - elapsed) / 86400000),
  }
})
</script>

<template>
  <div class="widget-card">
    <h3 class="widget-title">
      {{ year }} 进度
      <span class="year-percent">{{ stats.percent.toFixed(1) }}%</span>
    </h3>

    <div class="progress-track">
      <div class="progress-bar" :style="{ width: `${stats.percent}%` }"></div>
    </div>

    <p class="year-note">已过去 {{ stats.passed }} 天，还剩 {{ stats.remaining }} 天</p>
  </div>
</template>

<style scoped>
.year-percent {
  margin-left: auto;
  padding: 1px 10px;
  font-size: 12px;
  font-weight: 400;
  font-family: var(--mono);
  color: var(--accent-deep);
  background: var(--accent-soft);
  border-radius: 999px;
}

.progress-track {
  height: 8px;
  overflow: hidden;
  background: var(--accent-soft);
  border-radius: 999px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent-deep));
  border-radius: 999px;
  transition: width 1s ease;
}

.year-note {
  margin-top: 12px;
  font-size: 12.5px;
  text-align: center;
  color: var(--text-muted);
}
</style>
