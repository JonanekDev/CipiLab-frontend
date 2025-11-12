<template>
  <div class="sidebar-layout">
    <aside class="sidebar">
      <h2 class="sidebar-title">{{ title }}</h2>
      <nav class="sidebar-nav">
        <router-link
          v-for="item in menuItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="sidebar-link"
        >
          <span class="sidebar-icon">{{ item.icon }}</span>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>

    <main class="sidebar-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
interface MenuItem {
  name: string
  label: string
  icon: string
}

defineProps<{
  title: string
  menuItems: MenuItem[]
}>()
</script>

<style scoped>
.sidebar-layout {
  display: flex;
  gap: 30px;
  min-height: calc(100vh - 200px);
}

.sidebar {
  width: 280px;
  background: linear-gradient(135deg, rgba(28, 175, 135, 0.05), rgba(7, 81, 141, 0.05));
  border: 1px solid rgba(28, 175, 135, 0.2);
  border-radius: 16px;
  padding: 30px 0;
  height: fit-content;
  position: sticky;
  top: 20px;
}

.sidebar-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary);
  padding: 0 30px 20px;
  border-bottom: 1px solid rgba(28, 175, 135, 0.2);
  margin-bottom: 20px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 30px;
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.3s;
  border-left: 3px solid transparent;
  opacity: 0.7;
}

.sidebar-link:hover {
  background: rgba(28, 175, 135, 0.1);
  opacity: 1;
}

.sidebar-link.router-link-active {
  background: rgba(28, 175, 135, 0.15);
  border-left-color: var(--color-primary);
  opacity: 1;
  font-weight: 600;
}

.sidebar-icon {
  font-size: 20px;
}

.sidebar-content {
  flex: 1;
  min-width: 0;
}

@media (max-width: 1024px) {
  .sidebar-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    position: static;
  }

  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 10px;
    padding: 0 20px;
  }

  .sidebar-link {
    padding: 10px 16px;
    border-left: none;
    border-bottom: 2px solid transparent;
    border-radius: 8px;
  }

  .sidebar-link.router-link-active {
    border-left: none;
    border-bottom-color: var(--color-primary);
  }
}
</style>