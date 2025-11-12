<template>
  <SidebarLayout :title="i18n.global.t('nav.settings')" :menu-items="menuItems" />
</template>

<script setup lang="ts">
import { i18n } from '@/utils/i18n'
import SidebarLayout from './SidebarLayout.vue'

const menuItems = [
  { name: 'SettingsGeneral', label: i18n.global.t('nav.globalSettings'), icon: '⚙️' },
  { name: 'SettingsUser', label: i18n.global.t('nav.userManagement'), icon: '👥' },

]
</script>