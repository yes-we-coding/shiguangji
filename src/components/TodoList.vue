<script setup>
import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'blog-todos'

const todos = ref(
  JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') ?? [
    { id: 1, text: '写一篇新的博客文章', done: false },
    { id: 2, text: '整理周末拍的日出照片', done: true },
  ],
)
const newTodo = ref('')

watch(
  todos,
  (val) => localStorage.setItem(STORAGE_KEY, JSON.stringify(val)),
  { deep: true },
)

const remainingCount = computed(() => todos.value.filter((t) => !t.done).length)

function addTodo() {
  const text = newTodo.value.trim()
  if (!text) return
  todos.value.unshift({ id: Date.now(), text, done: false })
  newTodo.value = ''
}

function removeTodo(id) {
  todos.value = todos.value.filter((t) => t.id !== id)
}
</script>

<template>
  <div class="widget-card">
    <h3 class="widget-title">
      待办清单
      <span class="todo-count">{{ remainingCount }} 项待完成</span>
    </h3>

    <form class="todo-input" @submit.prevent="addTodo">
      <input
        v-model="newTodo"
        type="text"
        placeholder="添加一项待办，回车确认"
        maxlength="50"
      />
      <button type="submit" class="add-btn" aria-label="添加">+</button>
    </form>

    <ul class="todo-list">
      <li
        v-for="todo in todos"
        :key="todo.id"
        class="todo-item"
        :class="{ done: todo.done }"
      >
        <button
          class="check"
          :aria-label="todo.done ? '标记为未完成' : '标记为完成'"
          @click="todo.done = !todo.done"
        >
          <svg
            v-if="todo.done"
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </button>
        <span class="text">{{ todo.text }}</span>
        <button class="delete" aria-label="删除" @click="removeTodo(todo.id)">×</button>
      </li>
      <li v-if="todos.length === 0" class="empty">暂无待办，享受空闲时光</li>
    </ul>
  </div>
</template>

<style scoped>
.todo-count {
  margin-left: auto;
  padding: 1px 10px;
  font-size: 12px;
  font-weight: 400;
  color: var(--accent-deep);
  background: var(--accent-soft);
  border-radius: 999px;
}

.todo-input {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.todo-input input {
  flex: 1;
  min-width: 0;
  padding: 7px 12px;
  font-size: 13.5px;
  font-family: inherit;
  color: var(--text);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s;
}

.todo-input input::placeholder {
  color: var(--text-muted);
}

.todo-input input:focus {
  border-color: var(--accent);
}

.add-btn {
  width: 34px;
  flex-shrink: 0;
  font-size: 17px;
  line-height: 1;
  color: #fff;
  background: var(--accent);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.add-btn:hover {
  opacity: 0.85;
}

.todo-list {
  display: flex;
  flex-direction: column;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 6px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.todo-item:hover {
  background: var(--accent-soft);
}

.check {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #fff;
  background: transparent;
  border: 1.5px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s;
}

.todo-item.done .check {
  background: var(--accent);
  border-color: var(--accent);
}

.text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: 13.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.2s;
}

.todo-item.done .text {
  color: var(--text-muted);
  text-decoration: line-through;
}

.delete {
  padding: 0 4px;
  font-size: 15px;
  line-height: 1;
  color: var(--text-muted);
  background: transparent;
  border: none;
  cursor: pointer;
  opacity: 0;
  transition:
    opacity 0.2s,
    color 0.2s;
}

.todo-item:hover .delete {
  opacity: 1;
}

.delete:hover {
  color: #c0665c;
}

.empty {
  padding: 12px 0 4px;
  font-size: 13px;
  text-align: center;
  color: var(--text-muted);
}
</style>
