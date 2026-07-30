<script setup>
import { computed, ref } from 'vue'

// 本地语录库，随时往里加
const QUOTES = [
  { text: '生活不是我们活过的日子，而是我们记住的日子。', from: '马尔克斯' },
  { text: '凡是过往，皆为序章。', from: '莎士比亚' },
  { text: '且视他人之疑目如盏盏鬼火，大胆地去走你的夜路。', from: '史铁生' },
  { text: '一个人只拥有此生此世是不够的，他还应该拥有诗意的世界。', from: '王小波' },
  { text: '心有猛虎，细嗅蔷薇。', from: '萨松' },
  { text: '路漫漫其修远兮，吾将上下而求索。', from: '屈原《离骚》' },
  { text: '书犹药也，善读之可以医愚。', from: '刘向' },
  { text: '星光不问赶路人，时光不负有心人。', from: '佚名' },
  { text: '种一棵树最好的时间是十年前，其次是现在。', from: '谚语' },
  { text: '明天又是新的一天。', from: '玛格丽特·米切尔《飘》' },
]

// 按一年中的第几天选 quote，每天自动轮换
const dayOfYear = Math.floor(
  (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
)

const offset = ref(0)
const quote = computed(() => QUOTES[(dayOfYear + offset.value) % QUOTES.length])

function next() {
  offset.value++
}
</script>

<template>
  <div class="widget-card">
    <h3 class="widget-title">
      每日一言
      <button class="shuffle" title="换一句" aria-label="换一句" @click="next">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
      </button>
    </h3>

    <blockquote class="quote">
      <p class="quote-text">{{ quote.text }}</p>
      <footer class="quote-from">—— {{ quote.from }}</footer>
    </blockquote>
  </div>
</template>

<style scoped>
.shuffle {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  margin-left: auto;
  padding: 0;
  color: var(--text-muted);
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition:
    color 0.2s,
    background-color 0.2s,
    transform 0.4s;
}

.shuffle:hover {
  color: var(--accent-deep);
  background: var(--accent-soft);
  transform: rotate(180deg);
}

.quote {
  position: relative;
  margin: 0;
}

.quote::before {
  content: '"';
  position: absolute;
  top: -12px;
  left: -4px;
  font-family: Georgia, serif;
  font-size: 44px;
  line-height: 1;
  color: var(--accent);
  opacity: 0.25;
  pointer-events: none;
}

.quote-text {
  position: relative;
  font-family: Georgia, 'Songti SC', 'SimSun', serif;
  font-size: 13.5px;
  line-height: 1.9;
}

.quote-from {
  margin-top: 8px;
  font-size: 12px;
  text-align: right;
  color: var(--text-muted);
}
</style>
