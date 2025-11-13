<template>
  <div class="settings-card">
    <h3 class="card-title">{{ $t('dashboard.account.userInfo') }}</h3>
    <div class="form-group">
      <label class="form-label">{{ $t('auth.username') }}</label>
      <input
        v-model="userInfo.username"
        type="text"
        class="form-input"
        :class="{
          'input-error': hasError('username', 'length') || hasError('username', 'pattern'),
        }"
        placeholder="Admin"
        @input="onFieldChange('username')"
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
        v-model="userInfo.email"
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
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
    <div class="btn-group">
      <button class="btn btn-primary" :disabled="isSubmitDisabled" @click="saveProfile">
        {{ loading ? $t('dashboard.account.savingChanges') : $t('dashboard.account.saveChanges') }}
      </button>
      <button class="btn btn-secondary" @click="reset">
        {{ $t('dashboard.account.reset') }}
      </button>
    </div>
    <div class="form-group">
      <label class="form-label" for="lang">{{ $t('dashboard.account.language') }}</label>
      <select id="lang" class="form-select" v-model="selectedLang" @change="setLang(selectedLang)">
        <option
          v-for="[value, label] in Object.entries(availableLocales)"
          :key="value"
          :value="value"
        >
          {{ label }}
        </option>
      </select>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { UsersService, type UpdateProfileReqDto } from '@/api'
import { availableLocales, type Lang, setLang } from '@/utils/i18n'
import {
  getValidationRules,
  validateField,
  type SchemaName,
  type ValidationError,
} from '@/utils/validation'
import { i18n } from '@/utils/i18n'

const loading = ref(false)
const errorMessage = ref<string>('')
const successMessage = ref<string>('')
const authStore = useAuthStore()
const selectedLang = ref<Lang>(i18n.global.locale.value as Lang)

const schemaName: SchemaName = 'UpdateProfileReqDto'

const userInfo = ref<UpdateProfileReqDto>({
  username: '',
  email: '',
})

const validationRules = {
  username: getValidationRules(schemaName, 'username'),
  email: getValidationRules(schemaName, 'email'),
}

const fieldErrors = ref<Record<keyof typeof userInfo.value, ValidationError[] | null>>({
  username: [],
  email: [],
})

function onFieldChange(field: keyof typeof userInfo.value) {
  fieldErrors.value[field] = validateField(schemaName, field, userInfo.value[field])
}

const hasError = (field: keyof typeof userInfo.value, errorType: ValidationError) => {
  return fieldErrors.value[field]?.includes(errorType) ?? false
}

const isSubmitDisabled = computed(() => {
  const allFilled = Object.values(userInfo.value).every((v) => v.trim().length > 0)
  const noErrors = Object.values(fieldErrors.value).every((errs) => errs?.length === 0)
  const changed =
    userInfo.value.username !== (authStore.user?.username || '') ||
    userInfo.value.email !== (authStore.user?.email || '')
  return !allFilled || !noErrors || !changed || loading.value
})

const saveProfile = () => {
  if (isSubmitDisabled.value) return
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
  UsersService.usersControllerUpdateProfile(userInfo.value)
    .then(() => {
      successMessage.value = i18n.global.t('dashboard.account.profileUpdated')
      authStore.update(userInfo.value)
    })
    .catch(() => {
      errorMessage.value = i18n.global.t('dashboard.account.profileUpdateError')
      setTimeout(() => {
        errorMessage.value = ''
      }, 8000)
    })
    .finally(() => {
      loading.value = false
    })
}

const reset = () => {
  userInfo.value.username = authStore.user?.username || ''
  userInfo.value.email = authStore.user?.email || ''
  fieldErrors.value = {
    username: [],
    email: [],
  }
}

reset()
</script>
<style scoped>
.btn-group {
  margin-bottom: 25px;
}
</style>
