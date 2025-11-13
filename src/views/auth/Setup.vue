<template>
  <div class="setup-view">
    <div class="welcome-text">
      <h2>{{ $t('setup.welcome') }}</h2>
      <p>{{ $t('setup.setupDesc') }}</p>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
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
          :maxlength="validationRules.username?.maxLength"
          :class="{
            'input-error': hasError('username', 'length') || hasError('username', 'pattern'),
          }"
          placeholder="Admin"
          @input="onFieldChange('username')"
          required
        />
        <div class="form-hint" :class="{ 'hint-error': hasError('username', 'length') }">
          {{
            $t('auth.usernameLength', {
              min: validationRules.username?.minLength,
              max: validationRules.username?.maxLength,
            })
          }}
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
          @input="onFieldChange('email')"
          required
        />
        <div v-if="hasError('email', 'pattern')" class="form-hint hint-error">
          {{ $t('auth.emailPattern') }}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="password">{{ $t('auth.password') }}</label>
        <div class="password-wrapper">
          <input
            v-model="setup.password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            class="form-input"
            maxlength="128"
            placeholder="••••••••"
            :class="{
              'input-error': hasError('password', 'length') || hasError('password', 'pattern'),
            }"
            @input="onFieldChange('password')"
            required
          />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </button>
        </div>
        <div class="form-hint" :class="{ 'hint-error': hasError('password', 'length') }">
          {{ $t('auth.passwordMinLength', { min: validationRules.password?.minLength }) }}
        </div>
        <div class="form-hint" :class="{ 'hint-error': hasError('password', 'pattern') }">
          {{ $t('auth.passwordPattern') }}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="confirmPassword">{{ $t('auth.confirmPassword') }}</label>
        <div class="password-wrapper">
          <input
            v-model="setup.confirmPassword"
            type="password"
            id="confirmPassword"
            class="form-input"
            placeholder="••••••••"
            @input="onFieldChange('confirmPassword')"
            :class="{ 'input-error': hasError('confirmPassword', 'match') }"
            required
          />
        </div>
        <div v-if="hasError('confirmPassword', 'match')" class="form-hint hint-error">
          {{ $t('auth.passwordsHasToMatch') }}
        </div>
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
          @input="onFieldChange('serverName')"
          required
        />
        <div v-if="hasError('serverName', 'length')" class="form-hint hint-error">
          {{
            $t('setup.serverNameLength', {
              min: validationRules.serverName?.minLength,
              max: validationRules.serverName?.maxLength,
            })
          }}
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
import { i18n } from '@/utils/i18n'
import {
  getValidationRules,
  validateField,
  type SchemaName,
  type ValidationError,
} from '@/utils/validation'
import { computed, ref } from 'vue'

const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref<string>('')
const successMessage = ref('')

type SetupForm = InitDashboardReqDto & {
  confirmPassword: string
}

const setup = ref<SetupForm>({
  username: '',
  email: '',
  password: '',
  serverName: '',
  confirmPassword: '',
})

const schemaName: SchemaName = 'InitDashboardReqDto'

const validationRules = {
  username: getValidationRules(schemaName, 'username'),
  email: getValidationRules(schemaName, 'email'),
  password: getValidationRules(schemaName, 'password'),
  serverName: getValidationRules(schemaName, 'serverName'),
}

const fieldErrors = ref<Record<keyof typeof setup.value, ValidationError[] | null>>({
  username: [],
  email: [],
  password: [],
  serverName: [],
  confirmPassword: [],
})

function onFieldChange(field: keyof typeof setup.value) {
  if (field == 'confirmPassword') {
    fieldErrors.value.confirmPassword =
      setup.value.password === setup.value.confirmPassword ? [] : ['match']
    return
  }
  fieldErrors.value[field] = validateField(schemaName, field, setup.value[field])
}

const hasError = (field: keyof typeof setup.value, errorType: ValidationError) => {
  return fieldErrors.value[field]?.includes(errorType) ?? false
}

const isSubmitDisabled = computed(() => {
  const allFilled = Object.values(setup.value).every((v) => v.trim().length > 0)
  const noErrors = Object.values(fieldErrors.value).every((errs) => errs?.length === 0)
  return !allFilled || !noErrors || loading.value
})

const handleSetup = async () => {
  if (isSubmitDisabled.value) return
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  const { confirmPassword, ...dto } = setup.value

  try {
    await SetupService.setupControllerInitializeSetup(dto)
    successMessage.value = i18n.global.t('setup.setupWasSuccessful')
    setTimeout(() => {
      router.push({ name: 'Login' })
    }, 1500)
  } catch (error: any) {
    errorMessage.value = i18n.global.t('setup.error')
    console.log(error)
    setTimeout(() => {
      errorMessage.value = ''
    }, 8000)
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
