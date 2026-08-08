// v-reveal：元素进入视口时浮现，用 --delay 控制交错延迟
//  注意：列表动态新增时 IntersectionObserver 不一定及时触发，
//  所以加一道保底——observe 后 100ms 内若元素已在视口，直接 mark revealed
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
        observer.unobserve(entry.target)
      }
    }
  },
  { threshold: 0.08, rootMargin: '0px 0px -24px' },
)

// 保底：浏览器无 IntersectionObserver 时、或 observe 后元素已在视口却未触发时
const isInViewport = (el) => {
  const rect = el.getBoundingClientRect()
  return rect.top < window.innerHeight && rect.bottom > 0
}

export const reveal = {
  mounted(el) {
    el.classList.add('reveal')
    observer.observe(el)
    // 保底：检查元素是否已在视口
    if (isInViewport(el)) {
      requestAnimationFrame(() => {
        if (isInViewport(el)) {
          el.classList.add('revealed')
          observer.unobserve(el)
        }
      })
    }
  },
  unmounted(el) {
    observer.unobserve(el)
  },
}
