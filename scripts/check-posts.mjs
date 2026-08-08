// 构建前扫描 src/posts/*.md，检测未审阅的草稿
// 规则：含有 "📝 编辑提示" 或 "删除本提示块后即可发布" 字样的文件视为未审阅
// 目的：防止自动化生成的草稿（带编辑提示块）未经审阅就被部署上线

import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const POSTS_DIR = 'src/posts'
const MARKERS = [
  '📝 编辑提示',
  '删除本提示块',
]

let hasUnfinished = false

try {
  const files = readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'))
  for (const f of files) {
    const content = readFileSync(join(POSTS_DIR, f), 'utf-8')
    const hits = MARKERS.filter(m => content.includes(m))
    if (hits.length > 0) {
      console.error(`🚫 ${f} 含未审阅标记: ${hits.join(', ')}`)
      hasUnfinished = true
    }
  }
} catch (e) {
  // 首次构建时目录可能不存在，忽略
  if (e.code !== 'ENOENT') {
    console.error('check-posts 错误:', e.message)
    process.exit(1)
  }
}

if (hasUnfinished) {
  console.error('\n❌ 构建失败：请删除 src/posts/ 中所有文件的"编辑提示"块')
  console.error('   这些是自动化生成的草稿，需要人工审阅后才能发布。')
  process.exit(1)
}

console.log('✓ 文章目录干净，可以构建')
