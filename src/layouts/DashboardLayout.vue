<template>
  <div class="dashboard-layout">
    <header class="header">
      <div class="logo">CipiLab</div>
      <nav class="nav">
        <a href="#prehled" class="nav-link">Přehled</a>
        <a href="#monitoring" class="nav-link">Monitoring</a>
        <a href="#sluzby" class="nav-link">Služby</a>
        <a href="#nastaveni" class="nav-link">Nastavení</a>
        <a href="#administrace" class="nav-link">⚙️ Administrace</a>
      </nav>
      <div class="user-section">
        <button class="btn btn-primary">➕ Spustit novou službu</button>
        <div class="user-info">
          <span class="user-avatar">👤</span>
          <div class="user-details">
            <div class="user-email">{{ authStore.user?.username }}</div>
            <div class="user-role">Správce</div>
          </div>
        </div>
        <button class="btn btn-secondary">Účet</button>
        <button class="btn btn-secondary" @click="handleLogout">Odhlásit</button>
      </div>
    </header>

    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

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
