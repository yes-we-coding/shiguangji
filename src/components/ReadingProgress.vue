<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const progress = ref(0)

function onScroll() {
  const total = document.documentElement.scrollHeight - window.innerHeight
  progress.value = total > 0 ? Math.min(window.scrollY / total, 1) : 0
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="reading-progress" :style="{ transform: `scaleX(${progress})` }"></div>
</template>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--accent-deep));
  transform-origin: left;
  pointer-events: none;
}
</style>
