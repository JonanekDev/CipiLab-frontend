<template>
  <div class="settings-page">
    <h1 class="page-title">{{ $t('dashboard.account.activeSessions') }}</h1>
    
    <div class="settings-card">
      <h3 class="card-title">Základní informace</h3>
      <div class="form-group">
        <label class="form-label">Název serveru</label>
        <input v-model="settings.serverName" type="text" class="form-input" placeholder="Můj Server">
      </div>
      <div class="form-group">
        <label class="form-label">Popis</label>
        <textarea v-model="settings.serverDescription" class="form-input" rows="3" placeholder="Popis vašeho serveru"></textarea>
      </div>
    </div>

    <div class="settings-card">
      <h3 class="card-title">Vzhled</h3>
      <div class="form-group">
        <label class="checkbox-wrapper">
          <input v-model="settings.darkMode" type="checkbox">
          <span>Tmavý režim</span>
        </label>
      </div>
      <div class="form-group">
        <label class="form-label">Jazyk</label>
        <select v-model="settings.language" class="form-input">
          <option value="cs">Čeština</option>
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </div>
    </div>

    <div class="settings-actions">
      <button class="btn btn-primary" @click="saveSettings">Uložit změny</button>
      <button class="btn btn-secondary" @click="resetSettings">Obnovit výchozí</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const settings = ref({
  serverName: 'CipiLab Server',
  serverDescription: 'Můj produkční server',
  darkMode: true,
  language: 'cs'
})

const saveSettings = () => {
  console.log('Saving settings:', settings.value)
}

const resetSettings = () => {
  console.log('Reset settings')
}
</script>

