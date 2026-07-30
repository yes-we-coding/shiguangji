import { ref } from 'vue'

// 文章列表的标签筛选状态，供 PostList 与 TagCloud 共享
export const activeTag = ref('全部')
