<template>
  <div class="settings-page">
    <h1 class="page-title">{{ $t('dashboard.account.profile') }}</h1>

    <div class="settings-card">
      <h3 class="card-title">{{ $t('dashboard.account.userInfo') }}</h3>
      <div class="form-group">
        <label class="form-label">{{ $t('auth.username') }}</label>
        <input
          v-model="userInfo.username"
          type="text"
          class="form-input"
          placeholder="Můj Server"
        />
      </div>
      <div class="form-group">
        <label class="form-label">{{ $t('auth.email') }}</label>
        <input
          v-model="userInfo.email"
          type="email"
          class="form-input"
          placeholder="Popis vašeho serveru"
        />
      </div>

      <button class="btn btn-primary" @click="saveSettings">Uložit změny</button>
      <button class="btn btn-secondary" @click="resetSettings">Obnovit výchozí</button>
    </div>

    <div class="settings-card">
      <h3 class="card-title">{{ $t('dashboard.account.changePassword') }}</h3>
      <div class="form-group">
        <label class="form-label" for="password">{{ $t('dashboard.account.oldPassword') }}</label>
        <div class="password-wrapper">
          <input
            v-model="changePassowrd.oldPassword"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            class="form-input"
            maxlength="128"
            placeholder="••••••••"
            @input="touched.password = true"
            required
          />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="password">{{ $t('dashboard.account.newPassword') }}</label>
        <div class="password-wrapper">
          <input
            v-model="changePassowrd.password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            class="form-input"
            maxlength="128"
            placeholder="••••••••"
            @input="touched.password = true"
            required
          />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </button>
        </div>
                <div class="form-hint" >
          {{ $t('auth.passwordMinLength', { min: validationRules.password?.minLength }) }}
        </div>
        <div class="form-hint">{{ $t('auth.passwordPattern') }}</div>
      </div>

      <div class="form-group">
        <label class="form-label" for="password">{{
          $t('dashboard.account.confirmNewPassword')
        }}</label>
        <div class="password-wrapper">
          <input
            v-model="changePassowrd.rePassword"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            class="form-input"
            maxlength="128"
            placeholder="••••••••"
            @input="touched.password = true"
            required
          />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </button>
        </div>
      </div>

      <button class="btn btn-primary" @click="saveSettings">
        {{ $t('dashboard.account.changePassword') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { getValidationRules } from '@/utils/validation'
import { ref } from 'vue'

const authStore = useAuthStore()

const showPassword = ref(false)
const touched = ref({
  password: false,
  rePassword: false,
})

const changePassowrd = ref({
  oldPassword: '',
  password: '',
  rePassword: '',
})


const userInfo = ref({
  username: authStore.user?.username || '',
  email: authStore.user?.email || '',
})

const validationRules = {
  username: getValidationRules('InitDashboardReqDto', 'username'),
  password: getValidationRules('InitDashboardReqDto', 'password'),
}

const saveSettings = () => {
  console.log('Saving settings:', userInfo.value)
}

const resetSettings = () => {
  console.log('Reset settings')
}
</script>
