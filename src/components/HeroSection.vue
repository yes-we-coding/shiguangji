<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const TAGLINE = '在这里记录学习笔记、技术思考与生活随想。'

const typed = ref('')
let timer = null

onMounted(() => {
  // 尊重用户的减弱动效设置：直接显示完整文案
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typed.value = TAGLINE
    return
  }
  let i = 0
  timer = setInterval(() => {
    typed.value = TAGLINE.slice(0, ++i)
    if (i >= TAGLINE.length) {
      clearInterval(timer)
      timer = null
    }
  }, 110)
})

onUnmounted(() => timer && clearInterval(timer))
</script>

<template>
  <section class="hero">
    <div class="glow glow-a" aria-hidden="true"></div>
    <div class="glow glow-b" aria-hidden="true"></div>
    <div class="avatar">拾</div>
    <h1 class="hero-title">你好，我是阿拾</h1>
    <p class="hero-desc">
      一名前端工程师，喜欢写作、摄影和一切简洁美好的事物。<br />
      <span class="tagline"
        >{{ typed }}<span class="cursor" aria-hidden="true"></span
      ></span>
    </p>
    <div class="social-links">
      <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
      <a href="mailto:hi@example.com">邮箱</a>
      <a href="#">RSS</a>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  z-index: 0;
  padding: 72px 0 56px;
  text-align: center;
}

/* 柔光斑点缀 */
.glow {
  position: absolute;
  z-index: -1;
  border-radius: 50%;
  background: var(--glow);
  filter: blur(70px);
  pointer-events: none;
}

.glow-a {
  width: 300px;
  height: 300px;
  top: -70px;
  left: -100px;
}

.glow-b {
  width: 260px;
  height: 260px;
  right: -90px;
  bottom: -40px;
}

.avatar {
  display: grid;
  place-items: center;
  width: 84px;
  height: 84px;
  margin: 0 auto 24px;
  border-radius: 50%;
  font-size: 32px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, var(--accent), var(--accent-deep));
  box-shadow:
    0 0 0 6px var(--accent-soft),
    var(--shadow);
}

.hero-title {
  margin-bottom: 14px;
  font-size: 30px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.hero-desc {
  margin-bottom: 28px;
  font-size: 15.5px;
  color: var(--text-muted);
}

.tagline {
  display: inline-block;
  min-height: 1.75em;
}

.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 2px;
  vertical-align: -0.15em;
  background: var(--accent);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.social-links a {
  padding: 6px 16px;
  font-size: 14px;
  color: var(--text-muted);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  transition:
    color 0.2s,
    border-color 0.2s,
    transform 0.2s;
}

.social-links a:hover {
  color: var(--accent-deep);
  border-color: var(--accent);
  transform: translateY(-1px);
}

@media (max-width: 640px) {
  .hero {
    padding: 48px 0 40px;
  }
}
</style>
