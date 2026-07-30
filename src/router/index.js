import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: '首页' },
  },
  {
    path: '/post/:slug',
    name: 'post',
    component: () => import('../views/PostView.vue'),
    meta: { title: '文章' },
  },
  {
    path: '/archive',
    name: 'archive',
    component: () => import('../views/ArchiveView.vue'),
    meta: { title: '归档' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: { title: '关于' },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  },
})

const SITE_NAME = '拾光集'

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} · ${SITE_NAME}` : SITE_NAME
})
