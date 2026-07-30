<script setup>
defineProps({
  isDark: Boolean,
})
defineEmits(['toggle-theme'])
</script>

<template>
  <header class="site-header">
    <div class="container header-inner">
      <a href="#" class="logo">
        <span class="logo-dot"></span>
        拾光集
      </a>

      <nav class="nav">
        <a href="#" class="nav-link active">首页</a>
        <a href="#" class="nav-link">归档</a>
        <a href="#" class="nav-link">关于</a>
        <button
          class="theme-btn"
          :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
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
      </nav>
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
  display: flex;
  align-items: center;
  gap: 4px;
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

.nav-link.active {
  color: var(--accent-deep);
  font-weight: 500;
}

.theme-btn {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  margin-left: 8px;
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
</style>
