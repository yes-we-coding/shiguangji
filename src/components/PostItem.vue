<script setup>
defineProps({
  post: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <li>
    <router-link :to="`/post/${post.slug}`" class="post-item">
      <div class="post-head">
        <span v-if="post.pinned" class="pin-badge" title="置顶文章">
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2z" />
          </svg>
          置顶
        </span>
        <time class="post-date">{{ post.date }}</time>
      </div>
      <h3 class="post-title">{{ post.title }}</h3>
      <p class="post-excerpt">{{ post.excerpt }}</p>
      <div class="post-meta">
        <span v-for="tag in post.tags" :key="tag" class="post-tag">
          {{ tag }}
        </span>
        <span class="read-time">约 {{ post.readTime }} 分钟</span>
      </div>
    </router-link>
  </li>
</template>

<style scoped>
.post-item {
  display: block;
  padding: 20px 22px;
  border-radius: 14px;
  transition:
    background-color 0.25s ease,
    box-shadow 0.25s ease;
}

.post-item:hover {
  background: var(--surface);
  box-shadow: var(--shadow);
}

.post-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pin-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 1px 7px;
  font-size: 11px;
  color: var(--accent-deep);
  background: var(--accent-soft);
  border-radius: 999px;
}

.post-date {
  font-family: var(--mono);
  font-size: 12.5px;
  color: var(--text-muted);
}

.post-title {
  margin: 6px 0 8px;
  font-size: 18.5px;
  font-weight: 600;
  line-height: 1.5;
  transition: color 0.2s;
}

.post-item:hover .post-title {
  color: var(--accent-deep);
}

.post-excerpt {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 14.5px;
  color: var(--text-muted);
}

.post-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.post-tag {
  padding: 2px 10px;
  font-size: 12.5px;
  color: var(--accent-deep);
  background: var(--accent-soft);
  border-radius: 999px;
}

.read-time {
  font-size: 12.5px;
  color: var(--text-muted);
}

.read-time::before {
  content: '·';
  margin-right: 8px;
}
</style>
