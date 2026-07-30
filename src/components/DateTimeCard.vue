<script setup>
import { computed, onUnmounted, ref } from 'vue'

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

// 法定节假日（数据来源：国务院办公厅放假安排，每年发布后更新即可）
const HOLIDAYS = [
  { name: '元旦', start: '2026-01-01', end: '2026-01-03' },
  { name: '春节', start: '2026-02-16', end: '2026-02-22' },
  { name: '清明节', start: '2026-04-04', end: '2026-04-06' },
  { name: '劳动节', start: '2026-05-01', end: '2026-05-05' },
  { name: '端午节', start: '2026-06-19', end: '2026-06-21' },
  { name: '中秋节', start: '2026-09-25', end: '2026-09-27' },
  { name: '国庆节', start: '2026-10-01', end: '2026-10-07' },
  { name: '元旦', start: '2027-01-01', end: '2027-01-03' },
]

const DAY_MS = 24 * 60 * 60 * 1000

const now = ref(new Date())
const timer = setInterval(() => (now.value = new Date()), 1000)
onUnmounted(() => clearInterval(timer))

const pad = (n) => String(n).padStart(2, '0')

const timeText = computed(
  () =>
    `${pad(now.value.getHours())}:${pad(now.value.getMinutes())}:${pad(now.value.getSeconds())}`,
)

const dateText = computed(
  () =>
    `${now.value.getFullYear()}年${now.value.getMonth() + 1}月${now.value.getDate()}日 星期${WEEKDAYS[now.value.getDay()]}`,
)

// 今天 0 点（用于按整天计算，避免时分秒误差）
const today = computed(
  () => new Date(now.value.getFullYear(), now.value.getMonth(), now.value.getDate()),
)

const daysLeftInYear = computed(() =>
  Math.round((new Date(now.value.getFullYear(), 11, 31) - today.value) / DAY_MS),
)

// 最近的法定节假日：未开始的算倒计时，正在进行中的显示第几天
const nextHoliday = computed(() => {
  for (const h of HOLIDAYS) {
    const start = new Date(`${h.start}T00:00:00`)
    const end = new Date(`${h.end}T00:00:00`)

    if (today.value >= start && today.value <= end) {
      return {
        ...h,
        ongoing: true,
        dayOf: Math.round((today.value - start) / DAY_MS) + 1,
        rangeText: `${h.start} ~ ${h.end}`,
      }
    }
    if (start > today.value) {
      return {
        ...h,
        ongoing: false,
        days: Math.round((start - today.value) / DAY_MS),
        rangeText: `${h.start} ~ ${h.end}`,
      }
    }
  }
  return null
})
</script>

<template>
  <div class="widget-card">
    <div class="clock">{{ timeText }}</div>
    <div class="date">{{ dateText }}</div>

    <hr class="divider" />

    <div class="info-row">
      <span class="label">今年还剩</span>
      <span class="value"><strong>{{ daysLeftInYear }}</strong> 天</span>
    </div>
    <div v-if="nextHoliday" class="info-row" :title="nextHoliday.rangeText">
      <span class="label">
        {{ nextHoliday.ongoing ? `${nextHoliday.name}假期` : `距离${nextHoliday.name}` }}
      </span>
      <span class="value">
        <template v-if="nextHoliday.ongoing">
          第 <strong>{{ nextHoliday.dayOf }}</strong> 天
        </template>
        <template v-else>
          <strong>{{ nextHoliday.days }}</strong> 天
        </template>
      </span>
    </div>
  </div>
</template>

<style scoped>
.clock {
  font-family: var(--mono);
  font-size: 30px;
  font-weight: 600;
  letter-spacing: 1px;
  line-height: 1.25;
  font-variant-numeric: tabular-nums;
}

.date {
  margin-top: 2px;
  font-size: 13px;
  color: var(--text-muted);
}

.divider {
  margin: 14px 0 10px;
  border: none;
  border-top: 1px solid var(--border);
}

.info-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 3px 0;
  font-size: 13.5px;
}

.label {
  color: var(--text-muted);
}

.value strong {
  font-size: 17px;
  font-weight: 600;
  color: var(--accent-deep);
}
</style>
