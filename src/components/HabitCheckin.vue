<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'

const STORAGE_KEY = 'blog-habit-checkins'

// 想调整习惯，改这个数组即可
const habits = [
  { id: 'read', name: '阅读' },
  { id: 'write', name: '写作' },
  { id: 'sport', name: '运动' },
]

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日']

const pad = (n) => String(n).padStart(2, '0')
const dateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

// 首次打开补一条昨天的「阅读」记录作为示例，之后以 localStorage 为准
function initialCheckins() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) return JSON.parse(saved)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return { read: { [dateKey(yesterday)]: true } }
}

const checkins = ref(initialCheckins())

watch(
  checkins,
  (val) => localStorage.setItem(STORAGE_KEY, JSON.stringify(val)),
  { deep: true },
)

const now = ref(new Date())
const timer = setInterval(() => (now.value = new Date()), 60000)
onUnmounted(() => clearInterval(timer))

const todayKey = computed(() => dateKey(now.value))

// 本周日期（周一 ~ 周日）
const weekDates = computed(() => {
  const monday = new Date(now.value.getFullYear(), now.value.getMonth(), now.value.getDate())
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
})

const isFuture = (date) => dateKey(date) > todayKey.value
const isToday = (date) => dateKey(date) === todayKey.value
const isChecked = (habitId, date) => Boolean(checkins.value[habitId]?.[dateKey(date)])

function toggle(habitId, date) {
  if (isFuture(date)) return
  const key = dateKey(date)
  const habitChecks = { ...(checkins.value[habitId] || {}) }
  if (habitChecks[key]) {
    delete habitChecks[key]
  } else {
    habitChecks[key] = true
  }
  checkins.value = { ...checkins.value, [habitId]: habitChecks }
}

const todayDone = computed(
  () => habits.filter((h) => isChecked(h.id, now.value)).length,
)

const weekTotal = computed(() => {
  const weekKeys = new Set(weekDates.value.map(dateKey))
  return habits.reduce(
    (sum, h) =>
      sum + Object.keys(checkins.value[h.id] || {}).filter((k) => weekKeys.has(k)).length,
    0,
  )
})
</script>

<template>
  <div class="widget-card">
    <h3 class="widget-title">
      习惯打卡
      <span class="today-progress">今日 {{ todayDone }}/{{ habits.length }}</span>
    </h3>

    <div class="habit-grid">
      <div class="grid-row grid-head">
        <span class="habit-name"></span>
        <span
          v-for="(wd, i) in WEEKDAYS"
          :key="wd"
          class="day-label"
          :class="{ today: isToday(weekDates[i]) }"
        >
          {{ wd }}
        </span>
      </div>

      <div v-for="habit in habits" :key="habit.id" class="grid-row">
        <span class="habit-name">{{ habit.name }}</span>
        <button
          v-for="date in weekDates"
          :key="dateKey(date)"
          class="day-cell"
          :class="{
            checked: isChecked(habit.id, date),
            today: isToday(date),
            future: isFuture(date),
          }"
          :disabled="isFuture(date)"
          :title="dateKey(date)"
          :aria-label="`${habit.name} ${dateKey(date)} 打卡`"
          @click="toggle(habit.id, date)"
        ></button>
      </div>
    </div>

    <p class="week-summary">本周共打卡 {{ weekTotal }} 次</p>
  </div>
</template>

<style scoped>
.today-progress {
  margin-left: auto;
  padding: 1px 10px;
  font-size: 12px;
  font-weight: 400;
  color: var(--accent-deep);
  background: var(--accent-soft);
  border-radius: 999px;
}

.habit-grid {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.grid-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.habit-name {
  width: 32px;
  flex-shrink: 0;
  font-size: 12.5px;
  color: var(--text-muted);
}

.day-label {
  width: 20px;
  flex-shrink: 0;
  font-size: 11.5px;
  text-align: center;
  color: var(--text-muted);
}

.day-label.today {
  font-weight: 600;
  color: var(--accent-deep);
}

.day-cell {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  padding: 0;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    transform 0.15s;
}

.day-cell:hover:not(.future) {
  border-color: var(--accent);
  transform: scale(1.1);
}

.day-cell.checked {
  background: var(--accent);
  border-color: transparent;
}

.day-cell.today {
  border-color: var(--accent);
}

.day-cell.checked.today {
  box-shadow: 0 0 0 2px var(--accent-soft);
}

.day-cell.future {
  opacity: 0.35;
  cursor: not-allowed;
}

.week-summary {
  margin-top: 14px;
  padding-top: 10px;
  font-size: 12.5px;
  text-align: center;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
}
</style>
