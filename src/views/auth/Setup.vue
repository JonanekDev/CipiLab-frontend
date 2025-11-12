<template>
  <div class="setup-view">
    <div class="welcome-text">
      <h2>{{ $t('setup.welcome') }}</h2>
      <p>{{ $t('setup.setupDesc') }}</p>
    </div>

    <div v-if="errorMessage.length > 0" class="error-message">
      <ul>
        <li v-for="(msg, index) in errorMessage" :key="index">{{ msg }}</li>
      </ul>
    </div>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

     <form @submit.prevent="handleSetup">
      <div class="form-group">
        <label class="form-label" for="username">{{ $t('auth.username') }}</label>
        <input
          v-model="setup.username"
          type="text"
          id="username"
          class="form-input"
          :class="{ 'input-error': errors.username.length > 0 }"
          placeholder="Admin"
          @input="touched.username = true"
          required
        />
        <div class="form-hint" :class="{ 'hint-error': hasError('username', 'length') }">
          {{ $t('auth.usernameLength', { min: validationRules.username?.minLength, max: validationRules.username?.maxLength }) }}
        </div>
        <div class="form-hint" :class="{ 'hint-error': hasError('username', 'pattern') }">
          {{ $t('auth.usernamePattern') }}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="email">{{ $t('auth.email') }}</label>
        <input
          v-model="setup.email"
          type="email"
          id="email"
          class="form-input"
          :class="{ 'input-error': hasError('email', 'pattern') }"
          placeholder="email@scipak.eu"
          @input="touched.email = true"
          required
        />
        <div v-if="hasError('email', 'pattern')" class="form-hint hint-error">{{ $t('auth.emailPattern') }}</div>
      </div>

      <div class="form-group">
        <label class="form-label" for="password">{{ $t('auth.password') }}</label>
        <div class="password-wrapper">
          <input
            v-model="setup.password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            class="form-input"
            placeholder="••••••••"
            @input="touched.password = true"
            required
          />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </button>
        </div>
        <div class="form-hint" :class="{ 'hint-error': hasError('password', 'length') }">
          {{ $t('auth.passwordMinLength', { min: validationRules.password?.minLength }) }}
        </div>
        <div class="form-hint" :class="{ 'hint-error': hasError('password', 'pattern') }">{{ $t('auth.passwordPattern') }}</div>
      </div>

      <div class="form-group">
        <label class="form-label" for="confirmPassword">{{ $t('auth.confirmPassword') }}</label>
        <div class="password-wrapper">
          <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            id="confirmPassword"
            class="form-input"
            placeholder="••••••••"
            @input="touched.confirmPassword = true"
            :class="{ 'input-error': hasError('confirmPassword', 'match') }"
            required
          />
          <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
            {{ showConfirmPassword ? '🙈' : '👁️' }}
          </button>
        </div>
        <div v-if="hasError('confirmPassword', 'match')" class="form-hint hint-error">{{ $t('auth.passwordsHasToMatch') }}</div>
      </div>

      <div class="form-group">
        <label class="form-label" for="serverName">{{ $t('setup.serverName') }}</label>
        <input
          v-model="setup.serverName"
          type="text"
          id="serverName"
          class="form-input"
          placeholder="Jonáš's CipiLab"
          :class="{ 'input-error': hasError('serverName', 'length') }"
          @input="touched.serverName = true"
          required
        />
        <div v-if="hasError('serverName', 'length')" class="form-hint hint-error">
          {{ $t('setup.serverNameLength', { min: validationRules.serverName?.minLength }) }}
        </div>
      </div>

      <button type="submit" class="btn btn-primary btn-full" :disabled="isSubmitDisabled">
        {{ loading ? $t('setup.completeSetupLoading') : $t('setup.completeSetup') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { InitDashboardReqDto } from '@/api'
import { SetupService } from '@/api'
import router from '@/router'
import { getValidationRules } from '@/utils/validation'
import { computed, ref, watch } from 'vue'

const setup = ref<InitDashboardReqDto>({
  username: '',
  email: '',
  password: '',
  serverName: '',
})

const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const errorMessage = ref<string[]>([])
const successMessage = ref('')

// Zjednodušená struktura pro touched fields
const touched = ref<Record<string, boolean>>({
  username: false,
  email: false,
  password: false,
  confirmPassword: false,
  serverName: false,
})

// Validační pravidla
const validationRules = {
  username: getValidationRules('InitDashboardReqDto', 'username'),
  password: getValidationRules('InitDashboardReqDto', 'password'),
  email: getValidationRules('InitDashboardReqDto', 'email'),
  serverName: getValidationRules('InitDashboardReqDto', 'serverName'),
}

// Generická validační funkce
const validateField = (field: keyof typeof setup.value, value: string) => {
  const rules = validationRules[field]
  const errors: string[] = []

  if (rules?.minLength && value.length < rules.minLength) {
    errors.push('length')
  }
  if (rules?.maxLength && value.length > rules.maxLength) {
    errors.push('length')
  }
  if (rules?.pattern && !new RegExp(rules.pattern.replace(/^\/|\/$/g, '')).test(value)) {
    errors.push('pattern')
  }

  return errors
}

// Computed validační errors
const errors = computed(() => ({
  username: touched.value.username ? validateField('username', setup.value.username) : [],
  email: touched.value.email ? validateField('email', setup.value.email) : [],
  password: touched.value.password ? validateField('password', setup.value.password) : [],
  serverName: touched.value.serverName ? validateField('serverName', setup.value.serverName) : [],
  confirmPassword: touched.value.confirmPassword && setup.value.password !== confirmPassword.value ? ['match'] : [],
}))

// Helper funkce pro kontrolu typu chyby
const hasError = (field: keyof typeof errors.value, errorType: string) => {
  return errors.value[field].includes(errorType)
}

const hasErrors = computed(() => {
  return Object.values(errors.value).some(fieldErrors => fieldErrors.length > 0)
})

const allFieldsTouched = computed(() => {
  return Object.values(touched.value).every(val => val)
})

const isSubmitDisabled = computed(() => {
  return loading.value || hasErrors.value || !allFieldsTouched.value
})

const handleSetup = async () => {
  errorMessage.value = []
  successMessage.value = ''
  loading.value = true

  try {
    await SetupService.setupControllerInitializeSetup(setup.value)
    successMessage.value = 'Účet byl úspěšně vytvořen!'
    setTimeout(() => {
      router.push({ name: 'Login' })
    }, 1500)
  } catch (error: any) {
    errorMessage.value = [error.response?.data?.message || 'Nastala chyba při vytváření účtu']
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.setup-view {
  width: 100%;
}

.welcome-text {
  text-align: center;
  margin-bottom: 35px;
}

.welcome-text h2 {
  font-size: 24px;
  margin-bottom: 8px;
  color: var(--color-text);
}

.welcome-text p {
  color: rgba(253, 238, 216, 0.6);
  font-size: 14px;
}

.footer-text {
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  color: rgba(253, 238, 216, 0.5);
}
</style>
