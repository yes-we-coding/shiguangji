// 构建期生成 RSS feed，写入 public/rss.xml（Vite 会自动复制到 dist/）
// 用法：node scripts/build-rss.mjs（在 vite build 之前跑）

import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const SITE = {
  title: '拾光集 · 阿拾的博客',
  link: 'https://yes-we-coding.github.io/shiguangji/',
  description: '拾起时光的碎片——记录学习笔记、技术思考与生活随想。',
  language: 'zh-CN',
}

// 复刻 src/data/posts.js 的 front matter 解析
function parsePost(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return null
  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^(\w+):\s*(.+)$/)
    if (!m) continue
    let v = m[2].trim()
    if (v.startsWith('[') && v.endsWith(']')) {
      v = v.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean)
    }
    data[m[1]] = v
  }
  return data
}

const posts = readdirSync('src/posts')
  .filter((f) => f.endsWith('.md'))
  .map((f) => {
    const data = parsePost(readFileSync(join('src/posts', f), 'utf8'))
    if (!data) return null
    return {
      slug: f.replace(/\.md$/, ''),
      title: data.title || '',
      date: data.date || '',
      excerpt: data.excerpt || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
    }
  })
  .filter(Boolean)
  .filter((p) => p.date) // 跳过没日期的草稿
  .sort((a, b) => (b.date || '').localeCompare(a.date || ''))

const escapeXml = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const items = posts
  .map(
    (p) => `  <item>
    <title>${escapeXml(p.title)}</title>
    <link>${SITE.link}#/post/${p.slug}</link>
    <guid isPermaLink="false">${SITE.link}#/post/${p.slug}</guid>
    <pubDate>${new Date(p.date + 'T00:00:00Z').toUTCString()}</pubDate>
    <description>${escapeXml(p.excerpt)}</description>${(p.tags || [])
      .map((t) => `\n    <category>${escapeXml(t)}</category>`)
      .join('')}
  </item>`,
  )
  .join('\n')

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE.title)}</title>
    <link>${SITE.link}</link>
    <description>${escapeXml(SITE.description)}</description>
    <language>${SITE.language}</language>
    <atom:link href="${SITE.link}rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`

writeFileSync('public/rss.xml', rss)
console.log(`✓ Generated public/rss.xml with ${posts.length} posts`)
