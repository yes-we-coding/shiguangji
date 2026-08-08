// 文章数据：自动加载 src/posts/ 下的 Markdown 文件（带 front matter）
// 新增文章只需在该目录放一个 .md 文件，无需改动任何代码
const files = import.meta.glob('../posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

// 解析 front matter（支持 key: value 与 key: [a, b] 两种写法）
function parsePost(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, content: raw.trim() }

  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^(\w+):\s*(.+)$/)
    if (!m) continue
    let value = m[2].trim()
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    }
    // 布尔字段：pinned / draft
    if (value === 'true') value = true
    else if (value === 'false') value = false
    data[m[1]] = value
  }
  return { data, content: match[2].trim() }
}

// 纯字符数（去掉空白和 Markdown 标记符号），用于字数统计与阅读时长
const charCount = (content) => content.replace(/[#>*`\-|[\]()~\s]/g, '').length

export const posts = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.match(/([^/]+)\.md$/)[1]
    const { data, content } = parsePost(raw)
    const words = charCount(content)
    return {
      id: slug,
      slug,
      title: data.title || slug,
      date: data.date || '',
      excerpt: data.excerpt || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      pinned: data.pinned === true,
      words,
      readTime: Math.max(1, Math.round(words / 400)),
      content,
    }
  })
  // 排序：pinned 排前 → 然后按日期倒序 → 同日期保持原顺序（稳定排序）
  .sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return b.date.localeCompare(a.date)
  })

export const getPost = (slug) => posts.find((p) => p.slug === slug)
