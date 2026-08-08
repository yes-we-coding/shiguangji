<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'

const TOKEN_KEY = 'shiguangji-gh-pat'
const REPO = 'yes-we-coding/shiguangji'
const WORKFLOW = 'weekly-digest.yml'

const showPanel = ref(false)
const tokenInput = ref('')
const hasToken = ref(!!localStorage.getItem(TOKEN_KEY))
const running = ref(false)
const result = ref(null)

const masked = computed(() => {
  const t = localStorage.getItem(TOKEN_KEY) || ''
  if (t.length < 4) return ''
  return '•'.repeat(t.length - 4) + t.slice(-4)
})

function saveToken() {
  const t = tokenInput.value.trim()
  if (!t) return
  localStorage.setItem(TOKEN_KEY, t)
  tokenInput.value = ''
  hasToken.value = true
  result.value = null
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  hasToken.value = false
  result.value = null
}

async function trigger() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return
  running.value = true
  result.value = null
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({ ref: 'master' }),
      },
    )
    if (res.status === 204) {
      result.value = {
        ok: true,
        msg: '已触发！约 30 秒后 Actions 跑起来，1-2 分钟内会看到 PR。',
        url: `https://github.com/${REPO}/actions`,
      }
    } else {
      const body = await res.json().catch(() => ({}))
      const hint =
        res.status === 403
          ? 'Token 权限不够，需要 Actions: Write'
          : res.status === 404
            ? 'Workflow 文件没找到'
            : body.message || ''
      result.value = { ok: false, msg: `触发失败 (${res.status})：${hint}` }
    }
  } catch (e) {
    result.value = { ok: false, msg: `网络错误：${e.message}` }
  } finally {
    running.value = false
  }
}

function close() {
  showPanel.value = false
  result.value = null
}

// ESC 关闭模态框
function handleKeydown(e) {
  if (e.key === 'Escape' && showPanel.value) close()
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <footer class="site-footer">
    <div class="container footer-inner">
      <p>© 2026 拾光集 · 保持热爱，记录生活</p>
      <div class="footer-right">
        <p>Powered by Vue 3 & Vite</p>
        <button class="digest-btn" title="一键生成周报草稿" @click="showPanel = true">
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
            aria-hidden="true"
          >
            <path d="M4 11a9 9 0 0 1 9 9" />
            <path d="M4 4a16 16 0 0 1 16 16" />
            <circle cx="5" cy="19" r="1" />
          </svg>
          生成周报草稿
        </button>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showPanel"
          class="modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="digest-title"
          @click.self="close"
        >
          <div class="modal-card">
            <button class="modal-close" aria-label="关闭" @click="close">×</button>

            <h3 id="digest-title" class="modal-title">📰 一键生成周报草稿</h3>
            <p class="modal-desc">
              点击按钮会触发 GitHub Actions 运行
              <code>scripts/build-weekly-digest.mjs</code>，
              自动生成草稿到 <code>drafts/</code> 并开 PR。
            </p>

            <!-- 未配置 Token -->
            <div v-if="!hasToken" class="token-setup">
              <label class="token-label">
                GitHub Personal Access Token
                <input
                  v-model="tokenInput"
                  type="password"
                  placeholder="github_pat_xxx 或 ghp_xxx"
                  class="token-input"
                  @keydown.enter="saveToken"
                />
              </label>

              <div class="hint">
                <strong>🔒 安全说明</strong>
                <ul>
                  <li>Token 只存在你浏览器 localStorage，不上传任何服务器</li>
                  <li>推荐用
                    <a
                      href="https://github.com/settings/tokens?type=beta"
                      target="_blank"
                      rel="noopener"
                      >Fine-grained token</a
                    >，<strong>只勾本仓库 + Actions: Write</strong>
                  </li>
                  <li>任何 XSS 都能读到这个 Token，所以这是个 trade-off</li>
                </ul>
              </div>

              <div class="modal-actions">
                <button
                  class="btn-primary"
                  :disabled="!tokenInput.trim()"
                  @click="saveToken"
                >
                  保存 Token
                </button>
                <button class="btn-secondary" @click="close">取消</button>
              </div>
            </div>

            <!-- 已配置 Token -->
            <div v-else>
              <p class="token-status">
                ✓ Token 已配置
                <code class="masked-token">{{ masked }}</code>
                <button class="link-btn" @click="clearToken">清除</button>
              </p>

              <div class="modal-actions">
                <button class="btn-primary" :disabled="running" @click="trigger">
                  {{ running ? '触发中…' : '⚡ 立即触发' }}
                </button>
                <a
                  class="btn-secondary"
                  :href="`https://github.com/${REPO}/actions`"
                  target="_blank"
                  rel="noopener"
                  >查看 Actions</a
                >
              </div>

              <p v-if="result" class="result" :class="{ ok: result.ok }">
                {{ result.msg }}
                <a v-if="result.url" :href="result.url" target="_blank" rel="noopener"
                  >打开 →</a
                >
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 28px 0 36px;
  border-top: 1px solid var(--border);
}

.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 13.5px;
  color: var(--text-muted);
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.digest-btn {
  display: inline-flex;
  gap: 5px;
  align-items: center;
  padding: 5px 11px;
  font-size: 12.5px;
  font-family: inherit;
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

.digest-btn:hover {
  color: var(--accent-deep);
  border-color: var(--accent);
  background: var(--accent-soft);
}

/* ————— Modal ————— */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

[data-theme='dark'] .modal-backdrop {
  background: rgba(0, 0, 0, 0.6);
}

.modal-card {
  position: relative;
  width: min(480px, 100%);
  padding: 28px 28px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow);
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 14px;
  width: 28px;
  height: 28px;
  padding: 0;
  font-size: 20px;
  line-height: 1;
  color: var(--text-muted);
  background: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition:
    color 0.2s,
    background-color 0.2s;
}

.modal-close:hover {
  color: var(--text);
  background: var(--accent-soft);
}

.modal-title {
  margin-bottom: 10px;
  font-size: 17px;
  font-weight: 600;
}

.modal-desc {
  margin-bottom: 18px;
  font-size: 13.5px;
  line-height: 1.7;
  color: var(--text-muted);
}

.modal-desc code {
  padding: 1px 6px;
  font-family: var(--mono);
  font-size: 0.88em;
  background: var(--accent-soft);
  border-radius: 4px;
}

.token-setup {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.token-label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
}

.token-input {
  padding: 9px 12px;
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s;
}

.token-input:focus {
  border-color: var(--accent);
}

.hint {
  padding: 12px 14px;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--text-muted);
  background: var(--accent-soft);
  border-radius: 10px;
}

.hint ul {
  margin: 6px 0 0;
  padding-left: 1.4em;
}

.hint li {
  margin-bottom: 2px;
  list-style: disc;
}

.hint a {
  color: var(--accent-deep);
  text-decoration: underline;
}

.modal-actions {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 8px 0;
  font-size: 13.5px;
  font-family: inherit;
  border-radius: 10px;
  cursor: pointer;
  transition:
    opacity 0.2s,
    border-color 0.2s,
    color 0.2s;
  text-align: center;
}

.btn-primary {
  color: #fff;
  background: var(--accent);
  border: none;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.85;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  color: var(--text-muted);
  background: transparent;
  border: 1px solid var(--border);
  text-decoration: none;
}

.btn-secondary:hover {
  color: var(--accent-deep);
  border-color: var(--accent);
}

.token-status {
  margin-bottom: 16px;
  font-size: 13.5px;
  color: var(--text-muted);
}

.masked-token {
  margin: 0 6px;
  padding: 1px 6px;
  font-family: var(--mono);
  font-size: 12.5px;
  background: var(--accent-soft);
  border-radius: 4px;
}

.link-btn {
  padding: 0;
  font-size: 12.5px;
  color: var(--accent-deep);
  background: transparent;
  border: none;
  cursor: pointer;
  text-decoration: underline;
}

.result {
  margin-top: 14px;
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.6;
  background: rgba(192, 102, 92, 0.1);
  border-left: 3px solid #c0665c;
  border-radius: 6px;
}

.result.ok {
  background: var(--accent-soft);
  border-left-color: var(--accent);
}

.result a {
  margin-left: 8px;
  color: var(--accent-deep);
  text-decoration: underline;
}

/* ————— Modal 过渡 ————— */
.modal-enter-active,
.modal-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.96);
}
</style>
