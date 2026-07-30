<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 400
}

function backToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="pop">
    <button
      v-if="visible"
      class="back-to-top"
      aria-label="回到顶部"
      title="回到顶部"
      @click="backToTop"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 20;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  padding: 0;
  color: var(--accent-deep);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50%;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition:
    color 0.2s,
    background-color 0.2s,
    border-color 0.2s,
    transform 0.2s;
}

.back-to-top:hover {
  color: #fff;
  background: var(--accent);
  border-color: var(--accent);
  transform: translateY(-3px);
}

.pop-enter-active,
.pop-leave-active {
  transition: all 0.25s ease;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.9);
}

@media (max-width: 640px) {
  .back-to-top {
    right: 20px;
    bottom: 20px;
  }
}
</style>
