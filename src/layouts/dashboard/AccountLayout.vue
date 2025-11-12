<template>
  <SidebarLayout :title="i18n.global.t('nav.account')" :menu-items="menuItems" />
</template>

<script setup lang="ts">
import { i18n } from '@/utils/i18n'
import SidebarLayout from './SidebarLayout.vue'

const menuItems = [
  { name: 'AccountProfile', label: i18n.global.t('dashboard.account.profile'), icon: '👤' },
  { name: 'AccountSessions', label: i18n.global.t('dashboard.account.activeSessions'), icon: '📱' },
]
</script>