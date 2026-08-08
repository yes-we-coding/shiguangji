<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

defineProps({
  isDark: Boolean,
})
defineEmits(['toggle-theme'])

const menuOpen = ref(false)
const route = useRoute()

// 路由切换后收起菜单
watch(
  () => route.path,
  () => (menuOpen.value = false),
)
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <router-link to="/" class="logo">
        <span class="logo-dot"></span>
        拾光集
      </router-link>

      <nav class="nav" :class="{ open: menuOpen }">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/archive" class="nav-link">归档</router-link>
        <router-link to="/about" class="nav-link">关于</router-link>
      </nav>

      <div class="header-actions">
        <button
          class="theme-btn"
          :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
          :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
          :aria-pressed="isDark"
          @click="$emit('toggle-theme')"
        >
          <svg
            v-if="isDark"
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </button>

        <button
          class="menu-btn"
          :class="{ active: menuOpen }"
          aria-label="打开菜单"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: 1.5px;
}

.logo-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
}

.nav {
  position: absolute;
  left: 50%;
  display: flex;
  align-items: center;
  gap: 4px;
  transform: translateX(-50%);
}

.nav-link {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14.5px;
  color: var(--text-muted);
  transition:
    color 0.2s,
    background-color 0.2s;
}

.nav-link:hover {
  color: var(--text);
  background: var(--accent-soft);
}

.nav-link.router-link-active {
  color: var(--accent-deep);
  font-weight: 500;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-btn {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--border);
  border-radius: 50%;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s,
    transform 0.25s;
}

.theme-btn:hover {
  color: var(--accent-deep);
  border-color: var(--accent);
  transform: rotate(15deg);
}

/* ————— 汉堡按钮（移动端） ————— */
.menu-btn {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 34px;
  height: 34px;
  padding: 0;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
}

.menu-btn span {
  width: 14px;
  height: 1.8px;
  background: var(--text-muted);
  border-radius: 2px;
  transition:
    transform 0.25s,
    opacity 0.2s;
}

.menu-btn.active span:nth-child(1) {
  transform: translateY(6.8px) rotate(45deg);
}

.menu-btn.active span:nth-child(2) {
  opacity: 0;
}

.menu-btn.active span:nth-child(3) {
  transform: translateY(-6.8px) rotate(-45deg);
}

@media (max-width: 720px) {
  .menu-btn {
    display: flex;
  }

  .nav {
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 2px;
    padding: 10px 24px 14px;
    background: color-mix(in srgb, var(--bg) 94%, transparent);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    opacity: 0;
    transform: translateY(-8px);
    pointer-events: none;
    transition:
      opacity 0.22s ease,
      transform 0.22s ease;
  }

  .nav.open {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  .nav-link {
    padding: 10px 12px;
    text-align: center;
  }
}
</style>
