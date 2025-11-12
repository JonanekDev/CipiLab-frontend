import { useAuthStore } from '@/stores/auth'
import Login from '@/views/auth/Login.vue'
import Setup from '@/views/auth/Setup.vue'
import SettingsLayout from '@/layouts/dashboard/SettingsLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'
import GeneralSettings from '@/views/dashboard/settings/GeneralSettings.vue'
import Users from '@/views/dashboard/settings/Users.vue'
import { hasPermission } from '@/utils/roles'
import { UserRole } from '@/api'
import Main from '@/views/dashboard/Main.vue'
import { i18n } from '@/utils/i18n'
import AccountLayout from '@/layouts/dashboard/AccountLayout.vue'
import AccountProfile from '@/views/dashboard/account/AccountProfile.vue'
import AccountSessions from '@/views/dashboard/account/AccountSessions.vue'


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
        title: 'auth.loginTitle',
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
        title: 'setup.setupTitle',
      },
    },
    {
      path: '/',
      name: 'Overview',
      component: Main,
      meta: {
        requiresAuth: true,
        title: 'dashboard.overviewTitle',
      },
    },
    {
      path: '/settings',
      name: 'Settings',
      component: SettingsLayout,
      meta: {
        requiresAuth: true,
        layout: 'Dashboard',
        requiredRole: UserRole.FULL_ADMIN,
      },
      children: [
        {
          path: '',
          redirect: '/settings/general'
        },
        {
          path: 'general',
          name: 'SettingsGeneral',
          component: GeneralSettings,
          meta: {
            title: 'nav.globalSettings',
          },
        },
        {
          path: 'users',
          name: 'SettingsUser',
          component: Users,
          meta: {
            title: 'nav.userManagement',
          },
        }
      ],
    },
    {
      path: '/account',
      name: 'Account',
      component: AccountLayout,
      meta: {
        requiresAuth: true,
        layout: 'Dashboard',
      },
      children: [
        {
          path: '',
          redirect: '/account/profile'
        },
        {
          path: 'profile',
          name: 'AccountProfile',
          component: AccountProfile,
          meta: {
            title: 'dashboard.account.profile',
          },
        },
        {
          path: 'sessions',
          name: 'AccountSessions',
          component: AccountSessions,
          meta: {
            title: 'dashboard.account.activeSessions',
          },
        }
      ],
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  await authStore.init()

  const isAuthenticated = authStore.isAuthenticated
  const setupCompleted = authStore.setupCompleted
  const requiresAuth = to.meta.requiresAuth
  const requiresSetup = to.meta.requiresSetup
  const requiredRole = to.meta.requiredRole
  if (to.meta.title) {
    document.title = to.meta.title ? `${i18n.global.t(to.meta.title as string)} - CipiLab` : 'CipiLab'
  } else {
    document.title =  authStore.serverName + ' | CipiLab'
  }
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

    
  if (requiredRole) {
    if (!authStore.user || !hasPermission(authStore.user.role, requiredRole as UserRole)) {
      return next({ name: 'Dashboard' })
    }
  }

  if (isAuthenticated && to.meta.layout == 'auth') {
    return next({ name: 'Dashboard' })
  }

  next()
})

export default router
