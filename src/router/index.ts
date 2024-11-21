import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { pageTitle: 'Timetracker' }
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('../views/ReportsView.vue'),
      meta: { pageTitle: 'Reports' }
    },
  ],
})

router.beforeEach((to, from, next) => {
  const defaultTitle = 'Timetracker' // Fallback title
  document.title = to.meta.pageTitle || defaultTitle
  next()
})

export default router
