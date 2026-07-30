<script setup>
import { computed, onUnmounted, ref } from 'vue'

const MODES = {
  focus: { label: '专注', minutes: 25 },
  short: { label: '短休息', minutes: 5 },
  long: { label: '长休息', minutes: 15 },
}

// 进度环周长：2 * π * r(52)
const CIRCUMFERENCE = 2 * Math.PI * 52

const mode = ref('focus')
const remaining = ref(MODES.focus.minutes * 60)
const running = ref(false)
const completedFocus = ref(0)
let timer = null

const totalSeconds = computed(() => MODES[mode.value].minutes * 60)

const display = computed(() => {
  const m = String(Math.floor(remaining.value / 60)).padStart(2, '0')
  const s = String(remaining.value % 60).padStart(2, '0')
  return `${m}:${s}`
})

const dashOffset = computed(
  () => CIRCUMFERENCE * (remaining.value / totalSeconds.value),
)

function switchMode(key) {
  pause()
  mode.value = key
  remaining.value = MODES[key].minutes * 60
}

function toggle() {
  if (running.value) {
    pause()
  } else {
    start()
  }
}

function start() {
  running.value = true
  timer = setInterval(() => {
    if (remaining.value > 0) {
      remaining.value--
    } else {
      finish()
    }
  }, 1000)
}

function pause() {
  running.value = false
  clearInterval(timer)
  timer = null
}

function reset() {
  pause()
  remaining.value = totalSeconds.value
}

function finish() {
  pause()
  if (mode.value === 'focus') completedFocus.value++
  beep()
  switchMode(mode.value === 'focus' ? 'short' : 'focus')
}

function beep() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)
    osc.start()
    osc.stop(ctx.currentTime + 1.2)
  } catch {
    /* 音频播放失败时静默处理 */
  }
}

onUnmounted(pause)
</script>

<template>
  <div class="widget-card">
    <h3 class="widget-title">番茄钟</h3>

    <div class="mode-tabs">
      <button
        v-for="(m, key) in MODES"
        :key="key"
        class="mode-tab"
        :class="{ active: mode === key }"
        @click="switchMode(key)"
      >
        {{ m.label }}
      </button>
    </div>

    <div class="ring-wrap">
      <svg class="ring" viewBox="0 0 120 120">
        <circle class="ring-bg" cx="60" cy="60" r="52" />
        <circle
          class="ring-fg"
          cx="60"
          cy="60"
          r="52"
          :style="{ strokeDashoffset: dashOffset }"
        />
      </svg>
      <div class="time">{{ display }}</div>
    </div>

    <div class="controls">
      <button class="btn-primary" @click="toggle">
        {{ running ? '暂停' : '开始' }}
      </button>
      <button class="btn-ghost" @click="reset">重置</button>
    </div>

    <p class="completed">今日已完成 {{ completedFocus }} 个番茄</p>
  </div>
</template>

<style scoped>
.mode-tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 18px;
}

.mode-tab {
  flex: 1;
  padding: 5px 0;
  font-size: 13px;
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 999px;
  cursor: pointer;
  transition:
    color 0.2s,
    border-color 0.2s,
    background-color 0.2s;
}

.mode-tab:hover {
  color: var(--accent-deep);
  border-color: var(--accent);
}

.mode-tab.active {
  color: var(--accent-deep);
  font-weight: 500;
  background: var(--accent-soft);
  border-color: transparent;
}

.ring-wrap {
  position: relative;
  width: 150px;
  margin: 0 auto 18px;
}

.ring {
  display: block;
  width: 100%;
  transform: rotate(-90deg);
}

.ring circle {
  fill: none;
  stroke-width: 6;
  stroke-linecap: round;
}

.ring-bg {
  stroke: var(--border);
}

.ring-fg {
  stroke: var(--accent);
  stroke-dasharray: 326.7;
  transition: stroke-dashoffset 0.5s linear;
}

.time {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: var(--mono);
  font-size: 26px;
  font-weight: 600;
  letter-spacing: 1px;
}

.controls {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.controls button {
  flex: 1;
  padding: 8px 0;
  font-size: 13.5px;
  border-radius: 10px;
  cursor: pointer;
  transition:
    opacity 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.btn-primary {
  color: #fff;
  background: var(--accent);
  border: none;
}

.btn-primary:hover {
  opacity: 0.85;
}

.btn-ghost {
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border);
}

.btn-ghost:hover {
  color: var(--accent-deep);
  border-color: var(--accent);
}

.completed {
  font-size: 12.5px;
  text-align: center;
  color: var(--text-muted);
}
</style>
