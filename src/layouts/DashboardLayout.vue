<template>
  <div class="dashboard-layout">
    <header class="header">
      <div class="logo">CipiLab<br>
        <span class="logo-subtitle">{{ authStore.serverName }}</span>
      </div>
      <nav class="nav">
        <router-link
          v-for="item in visibleMenuItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="nav-link"
        >
          {{ item.label }}
        </router-link>
      </nav>
      <div class="user-section">
        <button class="btn btn-primary">➕ Spustit novou službu</button>
        <div class="user-info">
          <span class="user-avatar">👤</span>
          <div class="user-details">
            <div class="user-email">{{ authStore.user?.username }}</div>
            <div class="user-role">{{ $t(`roles.${authStore.user?.role}`) }}</div>
          </div>
        </div>
        <router-link :to="{ name: 'AccountProfile' }" class="btn btn-secondary">{{ $t('nav.account') }}</router-link>
        <button class="btn btn-secondary" @click="handleLogout">{{ $t('auth.logout') }}</button>
      </div>
    </header>

    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">

import type { UserRole } from '@/api';
import { useAuthStore } from '@/stores/auth'
import { i18n } from '@/utils/i18n';
import { hasPermission } from '@/utils/roles';
import { computed } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const authStore = useAuthStore()
const router = useRouter()

const menuItems = [
  { name: 'Overview', label: '🏠 ' + i18n.global.t('nav.overview') },
  { name: 'SettingsGeneral', label: '⚙️ ' + i18n.global.t('nav.settings') },
]

const visibleMenuItems = computed(() => {
  return menuItems.filter(item => {
    const route = router.resolve({ name: item.name })
    const requiredRole = route.meta.requiredRole as UserRole | undefined
    
    if (!requiredRole) {
      return true
    }
    
    return authStore.user && hasPermission(authStore.user.role, requiredRole)
  })
})

async function handleLogout() {
  await authStore.logout()
}
</script>

<style scoped>
.dashboard-layout {
  min-height: 100vh;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(253, 238, 216, 0.1);
  margin-bottom: 30px;
}

.logo {
  font-size: 28px;
  font-weight: bold;
  color: var(--color-primary);
  text-shadow: 0 0 20px rgba(28, 175, 135, 0.3);
}

.logo-subtitle {
  font-size: 20px;
  color: var(--color-text);
  text-shadow: none;
}

.nav {
  display: flex;
  gap: 30px;
  align-items: center;
}

.nav-link {
  color: var(--color-text);
  text-decoration: none;
  opacity: 0.8;
  transition: all 0.3s;
  padding: 8px 16px;
  border-radius: 8px;
}

.nav-link:hover {
  opacity: 1;
  background: rgba(28, 175, 135, 0.1);
}

.user-section {
  display: flex;
  gap: 20px;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  font-size: 24px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-email {
  font-size: 14px;
}

.user-role {
  font-size: 12px;
  opacity: 0.6;
}

.main-content {
  width: 100%;
}

@media (max-width: 1200px) {
  .header {
    flex-wrap: wrap;
    gap: 20px;
  }
}
</style>
