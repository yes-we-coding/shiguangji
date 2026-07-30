<script setup>
import { onMounted, ref, watch } from 'vue'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import BackToTop from './components/BackToTop.vue'
import ReadingProgress from './components/ReadingProgress.vue'

const isDark = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('theme')
  isDark.value = saved
    ? saved === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches
})

watch(
  isDark,
  (val) => {
    document.documentElement.dataset.theme = val ? 'dark' : 'light'
    localStorage.setItem('theme', val ? 'dark' : 'light')
  },
  { immediate: true },
)
</script>

<template>
  <ReadingProgress />
  <SiteHeader :is-dark="isDark" @toggle-theme="isDark = !isDark" />
  <router-view v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" />
    </Transition>
  </router-view>
  <SiteFooter />
  <BackToTop />
</template>

<style>
/* 页面切换过渡（全局，作用于各视图根节点） */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.22s ease,
    transform 0.22s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }
}
</style>
