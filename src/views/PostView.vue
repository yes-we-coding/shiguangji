<script setup>
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { marked } from 'marked'
import { posts, getPost } from '../data/posts'
import { resetMeta, updateMeta } from '../utils/seo'

marked.setOptions({ gfm: true, breaks: false })

const route = useRoute()
const articleEl = ref(null)

const post = computed(() => getPost(route.params.slug))

const html = computed(() => (post.value ? marked.parse(post.value.content) : ''))

const index = computed(() => posts.findIndex((p) => p.slug === route.params.slug))
const prevPost = computed(() => (index.value > 0 ? posts[index.value - 1] : null))
const nextPost = computed(() =>
  index.value >= 0 && index.value < posts.length - 1 ? posts[index.value + 1] : null,
)

// 文章页专属 meta：标题、描述、og:* 都换成当前文章
watch(
  () => post.value,
  (val) => {
    if (!val) return
    document.title = `${val.title} · 拾光集`
    updateMeta({
      description: val.excerpt,
      'og:title': val.title,
      'og:description': val.excerpt,
      'og:type': 'article',
    })
  },
  { immediate: true },
)

// Markdown 渲染后，给所有 <pre> 块加复制按钮
watch(
  html,
  () => {
    nextTick(() => enhanceCodeBlocks())
  },
  { immediate: true, flush: 'post' },
)

function enhanceCodeBlocks() {
  if (!articleEl.value) return
  const blocks = articleEl.value.querySelectorAll('.markdown-body pre')
  blocks.forEach((pre) => {
    if (pre.querySelector('.copy-btn')) return
    pre.style.position = 'relative'
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'copy-btn'
    btn.setAttribute('aria-label', '复制代码')
    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg><span>复制</span>`
    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code')?.innerText || pre.innerText
      try {
        await navigator.clipboard.writeText(code)
        btn.classList.add('copied')
        btn.querySelector('span').textContent = '已复制'
      } catch {
        btn.classList.add('error')
        btn.querySelector('span').textContent = '失败'
      }
      setTimeout(() => {
        btn.classList.remove('copied', 'error')
        btn.querySelector('span').textContent = '复制'
      }, 1800)
    })
    pre.appendChild(btn)
  })
}

// 离开文章页，恢复默认 meta
onUnmounted(resetMeta)
</script>

<template>
  <div class="container post-page">
    <template v-if="post">
      <article ref="articleEl">
        <header class="post-head">
          <h1 class="post-title">{{ post.title }}</h1>
          <div class="post-meta">
            <time class="meta-date">{{ post.date }}</time>
            <span class="meta-dot">·</span>
            <span>{{ post.words }} 字</span>
            <span class="meta-dot">·</span>
            <span>约 {{ post.readTime }} 分钟</span>
            <span v-for="tag in post.tags" :key="tag" class="meta-tag">{{ tag }}</span>
          </div>
        </header>

        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="markdown-body" v-html="html"></div>
      </article>

      <nav class="post-nav">
        <router-link v-if="prevPost" :to="`/post/${prevPost.slug}`" class="nav-card">
          <span class="nav-label">← 上一篇</span>
          <span class="nav-title">{{ prevPost.title }}</span>
        </router-link>
        <span v-else class="nav-card disabled">
          <span class="nav-label">← 上一篇</span>
          <span class="nav-title">没有更早的文章了</span>
        </span>
        <router-link v-if="nextPost" :to="`/post/${nextPost.slug}`" class="nav-card right">
          <span class="nav-label">下一篇 →</span>
          <span class="nav-title">{{ nextPost.title }}</span>
        </router-link>
        <span v-else class="nav-card right disabled">
          <span class="nav-label">下一篇 →</span>
          <span class="nav-title">已经是最新一篇</span>
        </span>
      </nav>
    </template>

    <div v-else class="not-found">
      <p>文章不存在或已被移除</p>
      <router-link to="/" class="back-home">回到首页</router-link>
    </div>
  </div>
</template>

<style scoped>
.post-page {
  max-width: 780px;
  padding-top: 56px;
  padding-bottom: 64px;
}

.post-head {
  margin-bottom: 36px;
  text-align: center;
}

.post-title {
  margin-bottom: 16px;
  font-size: 28px;
  font-weight: 600;
  line-height: 1.45;
}

.post-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13px;
  color: var(--text-muted);
}

.meta-date {
  font-family: var(--mono);
}

.meta-tag {
  padding: 1px 10px;
  color: var(--accent-deep);
  background: var(--accent-soft);
  border-radius: 999px;
}

/* ————— Markdown 排版 ————— */
.markdown-body {
  font-size: 15.5px;
  line-height: 1.9;
}

.markdown-body :deep(h2) {
  margin: 40px 0 14px;
  font-size: 21px;
  font-weight: 600;
}

.markdown-body :deep(h3) {
  margin: 30px 0 12px;
  font-size: 17.5px;
  font-weight: 600;
}

.markdown-body :deep(p) {
  margin: 0 0 16px;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 0 0 16px;
  padding-left: 1.5em;
  list-style: disc;
}

.markdown-body :deep(ol) {
  list-style: decimal;
}

.markdown-body :deep(li) {
  margin-bottom: 6px;
}

.markdown-body :deep(blockquote) {
  margin: 0 0 16px;
  padding: 12px 18px;
  color: var(--text-muted);
  background: var(--accent-soft);
  border-left: 3px solid var(--accent);
  border-radius: 0 10px 10px 0;
}

.markdown-body :deep(blockquote p) {
  margin: 0;
}

.markdown-body :deep(code) {
  padding: 2px 6px;
  font-family: var(--mono);
  font-size: 0.88em;
  background: var(--accent-soft);
  border-radius: 6px;
}

.markdown-body :deep(pre) {
  position: relative;
  margin: 0 0 16px;
  padding: 16px 18px;
  overflow-x: auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.markdown-body :deep(.copy-btn) {
  position: absolute;
  top: 8px;
  right: 8px;
  display: inline-flex;
  gap: 4px;
  align-items: center;
  padding: 4px 9px;
  font-size: 11.5px;
  font-family: inherit;
  color: var(--text-muted);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  opacity: 0;
  cursor: pointer;
  transition:
    opacity 0.2s,
    color 0.2s,
    border-color 0.2s,
    background-color 0.2s;
}

.markdown-body :deep(pre:hover .copy-btn),
.markdown-body :deep(.copy-btn:focus-visible) {
  opacity: 1;
}

.markdown-body :deep(.copy-btn:hover) {
  color: var(--accent-deep);
  border-color: var(--accent);
}

.markdown-body :deep(.copy-btn.copied) {
  color: var(--accent-deep);
  background: var(--accent-soft);
  border-color: transparent;
  opacity: 1;
}

.markdown-body :deep(.copy-btn.error) {
  color: #c0665c;
  border-color: #c0665c;
  opacity: 1;
}

.markdown-body :deep(pre code) {
  padding: 0;
  font-size: 13px;
  line-height: 1.7;
  background: transparent;
  border-radius: 0;
}

.markdown-body :deep(table) {
  width: 100%;
  margin: 0 0 16px;
  border-collapse: collapse;
  font-size: 14px;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  padding: 8px 12px;
  border: 1px solid var(--border);
}

.markdown-body :deep(th) {
  background: var(--accent-soft);
}

.markdown-body :deep(hr) {
  margin: 32px 0;
  border: none;
  border-top: 1px solid var(--border);
}

/* ————— 上一篇 / 下一篇 ————— */
.post-nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 56px;
  padding-top: 28px;
  border-top: 1px solid var(--border);
}

.nav-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  transition:
    border-color 0.2s,
    transform 0.2s;
}

.nav-card:not(.disabled):hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.nav-card.right {
  text-align: right;
}

.nav-card.disabled {
  opacity: 0.5;
}

.nav-label {
  font-size: 12px;
  color: var(--text-muted);
}

.nav-title {
  overflow: hidden;
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.not-found {
  padding: 120px 0;
  text-align: center;
  color: var(--text-muted);
}

.back-home {
  display: inline-block;
  margin-top: 16px;
  padding: 8px 22px;
  font-size: 14px;
  color: #fff;
  background: var(--accent);
  border-radius: 999px;
}

@media (max-width: 640px) {
  .post-nav {
    grid-template-columns: 1fr;
  }

  .nav-card.right {
    text-align: left;
  }
}
</style>
