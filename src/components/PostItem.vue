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
      <time class="post-date">{{ post.date }}</time>
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
