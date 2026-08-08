// 动态更新 <meta> 标签，供 PostView 在文章页写入专属信息
// 离开文章页时调用 resetMeta() 恢复到 index.html 的默认值

export const DEFAULT_META = {
  description: '拾起时光的碎片——记录学习笔记、技术思考与生活随想。',
  'og:title': '拾光集 · 阿拾的博客',
  'og:description': '拾起时光的碎片——记录学习笔记、技术思考与生活随想。',
  'og:type': 'website',
}

const attrFor = (key) =>
  key.startsWith('og:') || key.startsWith('article:') ? 'property' : 'name'

const set = (key, content, attr) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export const updateMeta = (meta) => {
  for (const [key, value] of Object.entries(meta)) {
    if (!value) continue
    set(key, value, attrFor(key))
  }
}

export const resetMeta = () => updateMeta(DEFAULT_META)
