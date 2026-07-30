<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <p>© 2026 拾光集 · 保持热爱，记录生活</p>
      <p>Powered by Vue 3 & Vite</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 28px 0 36px;
  border-top: 1px solid var(--border);
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13.5px;
  color: var(--text-muted);
}
</style>
