import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/records',
      name: 'Records',
      component: () => import('@/views/RecordsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/stats',
      name: 'Stats',
      component: () => import('@/views/StatsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation guard
router.beforeEach((to, from, next) => {
  // 直接从 localStorage 检查 token，避免在路由守卫中使用 Pinia store
  const hasToken = !!localStorage.getItem('access_token')

  if (to.meta.requiresAuth && !hasToken) {
    next('/login')
  } else if (to.meta.public && hasToken) {
    next('/')
  } else {
    next()
  }
})

export default router
