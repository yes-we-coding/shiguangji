// 自动生成技术周报草稿
// 用法：node scripts/build-weekly-digest.mjs [--date=YYYY-MM-DD]
// 输出：drafts/digest-YYYY-MM-DD.md

import { mkdirSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'

// ---- 参数解析 ----
const ARGS = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => {
      const [k, v] = a.slice(2).split('=')
      return [k, v ?? true]
    })
)
const TODAY = ARGS.date || new Date().toISOString().slice(0, 10)
const SITE_NAME = '拾光集'

// ---- 工具函数 ----
const fmt = (n) => n.toLocaleString('en-US')
const fetchJSON = async (url, opts = {}) => {
  const res = await fetch(url, {
    ...opts,
    headers: { 'User-Agent': 'shiguangji-digest/1.0', ...(opts.headers || {}) },
  })
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`)
  return res.json()
}
const fetchText = async (url, opts = {}) => {
  const res = await fetch(url, {
    ...opts,
    headers: { 'User-Agent': 'shiguangji-digest/1.0', ...(opts.headers || {}) },
  })
  if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`)
  return res.text()
}
const safeRun = async (name, fn) => {
  try {
    return await fn()
  } catch (e) {
    console.warn(`⚠ ${name} 抓取失败: ${e.message}`)
    return null
  }
}

// ---- 1. HackerNews 热门 ----
async function fetchHackerNews(limit = 8) {
  const ids = await fetchJSON('https://hacker-news.firebaseio.com/v0/topstories.json')
  const top = ids.slice(0, Math.max(limit * 3, 30))
  const items = await Promise.all(
    top.map(id => fetchJSON(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).catch(() => null)),
  )
  return items
    .filter(s => s && s.title && !s.deleted && !s.dead && s.score > 50)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

// ---- 2. GitHub Trending ----
function parseTrending(html) {
  const rows = html.match(/<article class="Box-row">[\s\S]*?<\/article>/g) || []
  return rows.map(row => {
    const pathMatch = row.match(/<h2[^>]*>\s*<a[^>]*href="(\/[^"]+)"/)
    const descMatch = row.match(/<p class="col-9[^"]*">([\s\S]*?)<\/p>/)
    const langMatch = row.match(/itemprop="programmingLanguage">([^<]+)</)
    const starsMatch = row.match(/(\d+(?:,\d+)*)\s*stars this week/i)
    if (!pathMatch) return null
    return {
      path: pathMatch[1],
      lang: langMatch ? langMatch[1] : '',
      desc: descMatch ? descMatch[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim() : '',
      stars: starsMatch ? parseInt(starsMatch[1].replace(/,/g, ''), 10) : 0,
    }
  }).filter(Boolean)
}

async function fetchTrending(category, limit = 10) {
  const url = category === 'all'
    ? 'https://github.com/trending?since=weekly'
    : `https://github.com/trending/${category}?since=weekly`
  const html = await fetchText(url)
  return parseTrending(html).slice(0, limit)
}

// ---- 3. npm 下载量 ----
async function fetchNpmDownloads(packages) {
  return Promise.all(
    packages.map(async pkg => {
      const data = await fetchJSON(`https://api.npmjs.org/downloads/point/last-week/${pkg}`).catch(() => null)
      return { pkg, downloads: data?.downloads ?? 0 }
    }),
  )
}

// ---- 4. 主流框架最新版 ----
const FRAMEWORKS = [
  { name: 'Vue', repo: 'vuejs/core' },
  { name: 'React', repo: 'facebook/react' },
  { name: 'Svelte', repo: 'sveltejs/svelte' },
  { name: 'Vite', repo: 'vitejs/vite' },
  { name: 'TypeScript', repo: 'microsoft/TypeScript' },
  { name: 'Astro', repo: 'withastro/astro' },
]
async function fetchFrameworkReleases() {
  return Promise.all(
    FRAMEWORKS.map(async ({ name, repo }) => {
      const r = await fetchJSON(`https://api.github.com/repos/${repo}/releases/latest`).catch(() => null)
      return r ? { name, tag: r.tag_name, date: r.published_at, url: r.html_url } : { name, error: true }
    }),
  )
}

// ---- 5. Markdown 生成 ----
function generateDigest({ date, hn, trendingAll, trendingTs, npmStats, releases }) {
  const lines = []
  const push = (s = '') => lines.push(s)

  push('---')
  push(`title: 技术周报 · ${date}`)
  push(`date: ${date}`)
  push(`excerpt: 自动汇总 HN 热门、GitHub Trending 周榜、npm 下载趋势、主流框架新版本。发布前请审阅内容。`)
  push(`tags: [周报, 资讯]`)
  push(`pinned: true`)
  push('---')
  push('')
  push(`> 本周报由 \`scripts/build-weekly-digest.mjs\` 自动生成于 ${date}。请在发布前审阅、补充上下文、删除不适用的条目。`)
  push('')

  // HN
  push('## 📰 HN 热门')
  push('')
  if (hn && hn.length) {
    for (const item of hn) {
      push(`- **[${item.title}](${item.url || `https://news.ycombinator.com/item?id=${item.id}`})**`)
      push(`  - 分数 ${fmt(item.score)} · 评论 ${item.descendants || 0} · 作者 ${item.by}`)
    }
  } else {
    push('_抓取失败或无数据_')
  }
  push('')

  // GitHub Trending - all
  push('## ⭐ GitHub Trending 周榜（全部语言）')
  push('')
  if (trendingAll && trendingAll.length) {
    push('| 仓库 | 语言 | +★ | 简介 |')
    push('|---|---|---:|---|')
    for (const r of trendingAll) {
      const short = r.desc.length > 60 ? r.desc.slice(0, 60) + '…' : r.desc
      push(`| [${r.path.slice(1)}](https://github.com${r.path}) | ${r.lang || '-'} | ${fmt(r.stars)} | ${short.replace(/\|/g, '\\|')} |`)
    }
  } else {
    push('_抓取失败或无数据_')
  }
  push('')

  // GitHub Trending - TypeScript
  push('## ⭐ TypeScript 周榜')
  push('')
  if (trendingTs && trendingTs.length) {
    push('| 仓库 | +★ | 简介 |')
    push('|---|---:|---|')
    for (const r of trendingTs) {
      const short = r.desc.length > 60 ? r.desc.slice(0, 60) + '…' : r.desc
      push(`| [${r.path.slice(1)}](https://github.com${r.path}) | ${fmt(r.stars)} | ${short.replace(/\|/g, '\\|')} |`)
    }
  } else {
    push('_抓取失败或无数据_')
  }
  push('')

  // npm
  push('## 📦 关注包的周下载')
  push('')
  if (npmStats && npmStats.length) {
    push('| 包 | 上周下载 |')
    push('|---|---:|')
    for (const s of npmStats.sort((a, b) => b.downloads - a.downloads)) {
      push(`| \`${s.pkg}\` | ${fmt(s.downloads)} |`)
    }
  } else {
    push('_抓取失败或无数据_')
  }
  push('')

  // 框架版本
  push('## 🚀 主流框架最新版本')
  push('')
  if (releases && releases.length) {
    push('| 框架 | 版本 | 发布日期 |')
    push('|---|---|---|')
    for (const r of releases) {
      if (r.error) {
        push(`| ${r.name} | _抓取失败_ | - |`)
      } else {
        const d = r.date ? r.date.slice(0, 10) : '-'
        push(`| ${r.name} | [\`${r.tag}\`](${r.url}) | ${d} |`)
      }
    }
  } else {
    push('_抓取失败或无数据_')
  }
  push('')

  push('---')
  push('')
  push('## 📝 编辑提示')
  push('')
  push('- HN 部分挑 3-5 条最能引发思考的，**配上你自己的点评**')
  push('- GitHub Trending 表格挑 5-7 个最相关的**单独展开**，写为什么值得关注')
  push('- npm 数据可以**纵向对比上周**形成趋势观察')
  push('- 框架新版本：列了不等于要展开，挑**有重大变更**的深入')
  push('- 结尾可以写一段「本周观察」收束')
  push('')
  push('> 删除本提示块后即可发布。')
  push('')

  return lines.join('\n')
}

// ---- 主流程 ----
async function main() {
  console.log(`📰 开始生成技术周报（${TODAY}）…`)

  // 并行抓取所有源
  const [hn, trendingAll, trendingTs, npmStats, releases] = await Promise.all([
    safeRun('HN', () => fetchHackerNews(8)),
    safeRun('GitHub Trending', () => fetchTrending('all', 10)),
    safeRun('GitHub Trending (TS)', () => fetchTrending('typescript', 10)),
    safeRun('NPM 下载', () => fetchNpmDownloads([
      'vue', 'react', 'svelte', 'vite', 'typescript', 'astro',
      'tailwindcss', 'marked', 'pinia', 'nuxt', 'next',
    ])),
    safeRun('框架版本', () => fetchFrameworkReleases()),
  ])

  const md = generateDigest({
    date: TODAY,
    hn, trendingAll, trendingTs, npmStats, releases,
  })

  // 写入 drafts/
  const outDir = 'drafts'
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
  const outPath = join(outDir, `digest-${TODAY}.md`)
  writeFileSync(outPath, md)
  console.log(`✓ 草稿已生成: ${outPath}`)
  console.log(`  字节数: ${md.length}`)
  console.log(`  HN: ${hn?.length || 0} 条`)
  console.log(`  Trending 总榜: ${trendingAll?.length || 0} 个`)
  console.log(`  Trending TS: ${trendingTs?.length || 0} 个`)
  console.log(`  npm 包: ${npmStats?.length || 0} 个`)
  console.log(`  框架版本: ${releases?.length || 0} 个`)
}

main().catch(e => {
  console.error('✗ 生成失败:', e.message)
  process.exit(1)
})
