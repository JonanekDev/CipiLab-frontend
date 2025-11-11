<template>
  <Loading v-if="loading" :text="'Načítání dat...'" />
  <div v-else>
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DashboardLayout from './layouts/DashboardLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import Loading from './views/Loading.vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

const loading = computed(() => authStore.loading)
const route = useRoute()
const router = useRouter()

const layout = computed(() => (route.meta.layout === 'auth' ? AuthLayout : DashboardLayout))
</script>
