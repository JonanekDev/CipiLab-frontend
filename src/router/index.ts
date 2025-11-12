import { useAuthStore } from '@/stores/auth'
import Login from '@/views/auth/Login.vue'
import Setup from '@/views/auth/Setup.vue'
import Main from '@/views/dashboard/Main.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        layout: 'auth',
        requiresAuth: false,
        title: 'Přihlášení',
      },
    },
    {
      path: '/setup',
      name: 'Setup',
      component: Setup,
      meta: {
        layout: 'auth',
        requiresAuth: false,
        requiresSetup: true,
        title: 'Nastavení',
      },
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Main,
      meta: {
        requiresAuth: true,
        title: 'Dashboard',
      },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  await authStore.init()

  const isAuthenticated = authStore.isAuthenticated
  const setupCompleted = authStore.setupCompleted
  const requiresAuth = to.meta.requiresAuth
  const requiresSetup = to.meta.requiresSetup

  if (!setupCompleted) {
    if (to.name !== 'Setup') {
      return next({ name: 'Setup' })
    }
    return next()
  }

  if (requiresSetup) {
    return next({ name: 'Dashboard' })
  }

  if (requiresAuth && !isAuthenticated) {
    return next({ name: 'Login' })
  }

  if (isAuthenticated && to.meta.layout == 'auth') {
    return next({ name: 'Dashboard' })
  }

  next()
})

export default router
