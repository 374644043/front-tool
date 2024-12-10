import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

const routes = [
  {
    path: '/',
    component: () => import('./views/toolMenu.vue'),
  },
  {
    path: '/toggle-case',
    component: () => import('./views/toggleCase.vue'),
  },
  {
    path: '/rem-compute',
    component: () => import('./views/remCompute.vue'),
  },
  {
    path: '/api-test',
    component: () => import('./views/apiTest.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})
router.afterEach(() => NProgress.done())

export default router
