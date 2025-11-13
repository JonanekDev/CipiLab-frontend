<template>
  <div class="settings-page">
    <h1 class="page-title">{{ $t('dashboard.account.profile') }}</h1>
    <div class="settings-grid">
      <ChangeProfile></ChangeProfile>
      <ChangePassword></ChangePassword>
    </div>
  </div>
</template>

<script setup lang="ts">
import ChangePassword from './AccountProfile/ChangePassword.vue'
import ChangeProfile from './AccountProfile/ChangeProfile.vue'
</script>