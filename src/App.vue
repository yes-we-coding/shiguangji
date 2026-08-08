<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import BackToTop from './components/BackToTop.vue'
import ReadingProgress from './components/ReadingProgress.vue'

const isDark = ref(false)
const route = useRoute()

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

// 键盘快捷键：/ 聚焦搜索、t 切主题、Esc 退出输入
function handleGlobalKeydown(e) {
  const target = e.target
  const tag = target?.tagName
  const isEditable =
    tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable

  // `/`：聚焦搜索框（不在输入框时）
  if (e.key === '/' && !isEditable) {
    const search = document.querySelector('.search-box input')
    if (search) {
      e.preventDefault()
      search.focus()
      search.select?.()
    }
  }

  // `t`：切换主题（不在输入框时，且不与系统快捷键冲突）
  if (
    e.key === 't' &&
    !isEditable &&
    !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey
  ) {
    e.preventDefault()
    isDark.value = !isDark.value
  }

  // `Esc`：退出输入
  if (e.key === 'Escape' && isEditable) {
    target.blur()
  }
}

onMounted(() => window.addEventListener('keydown', handleGlobalKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleGlobalKeydown))
</script>

<template>
  <ReadingProgress v-if="route.name === 'post'" />
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
