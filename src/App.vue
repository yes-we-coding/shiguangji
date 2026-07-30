<script setup>
import { onMounted, ref, watch } from 'vue'
import SiteHeader from './components/SiteHeader.vue'
import HeroSection from './components/HeroSection.vue'
import PostList from './components/PostList.vue'
import SiteFooter from './components/SiteFooter.vue'
import TodoList from './components/TodoList.vue'
import PomodoroTimer from './components/PomodoroTimer.vue'
import DateTimeCard from './components/DateTimeCard.vue'
import HabitCheckin from './components/HabitCheckin.vue'
import DailyQuote from './components/DailyQuote.vue'
import BackToTop from './components/BackToTop.vue'

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
  <SiteHeader class="fade-in" :is-dark="isDark" @toggle-theme="isDark = !isDark" />
  <div class="container layout">
    <aside class="side-col side-left">
      <DateTimeCard class="fade-in" style="--delay: 0.1s" />
      <HabitCheckin class="fade-in" style="--delay: 0.2s" />
      <DailyQuote class="fade-in" style="--delay: 0.3s" />
    </aside>
    <main class="main-col">
      <HeroSection class="fade-in" />
      <PostList class="fade-in" style="--delay: 0.15s" />
    </main>
    <aside class="side-col side-right">
      <TodoList class="fade-in" style="--delay: 0.15s" />
      <PomodoroTimer class="fade-in" style="--delay: 0.25s" />
    </aside>
  </div>
  <SiteFooter />
  <BackToTop />
</template>

<style scoped>
.layout {
  display: flex;
  align-items: flex-start;
  gap: 36px;
}

.main-col {
  flex: 1;
  min-width: 0;
}

.side-col {
  position: sticky;
  top: 84px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-shrink: 0;
  padding-top: 72px;
}

.side-left {
  width: 250px;
}

.side-right {
  width: 300px;
}

@media (max-width: 1080px) {
  .layout {
    flex-direction: column;
  }

  .main-col {
    order: -1;
  }

  .side-col {
    position: static;
    width: 100%;
    padding-top: 0;
  }

  .side-right {
    padding-bottom: 48px;
  }
}
</style>
