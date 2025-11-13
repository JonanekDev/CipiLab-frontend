<template>
  <div class="settings-card">
    <h3 class="card-title">{{ $t('dashboard.account.changePassword') }}</h3>
    <div class="form-group">
      <label class="form-label" for="password">{{ $t('dashboard.account.oldPassword') }}</label>
      <div class="password-wrapper">
        <input
          v-model="changePassword.currentPassword"
          :type="showPassword ? 'text' : 'password'"
          id="password"
          class="form-input"
          :class="{ 'input-error': hasError('currentPassword', 'length') }"
          maxlength="128"
          placeholder="••••••••"
          @input="onFieldChange('currentPassword')"
          required
        />
        <button type="button" class="toggle-password" @click="showPassword = !showPassword">
          {{ showPassword ? '🙈' : '👁️' }}
        </button>
      </div>
    </div>

    <div class="form-group">
      <label class="form-label" for="new-password">{{ $t('dashboard.account.newPassword') }}</label>
      <div class="password-wrapper">
        <input
          v-model="changePassword.password"
          :type="showNewPassword ? 'text' : 'password'"
          id="new-password"
          class="form-input"
          :class="{
            'input-error': hasError('password', 'length') || hasError('password', 'pattern'),
          }"
          maxlength="128"
          placeholder="••••••••"
          @input="onFieldChange('password')"
          required
        />
        <button type="button" class="toggle-password" @click="showNewPassword = !showNewPassword">
          {{ showNewPassword ? '🙈' : '👁️' }}
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
      <label class="form-label" for="confirmPassword">{{
        $t('dashboard.account.confirmNewPassword')
      }}</label>
      <div class="password-wrapper">
        <input
          v-model="changePassword.confirmPassword"
          type="password"
          id="confirmPassword"
          class="form-input"
          :class="{ 'input-error': hasError('confirmPassword', 'match') }"
          maxlength="128"
          placeholder="••••••••"
          @input="onFieldChange('confirmPassword')"
          required
        />
      </div>
      <div v-if="hasError('confirmPassword', 'match')" class="form-hint hint-error">
        {{ $t('auth.passwordsHasToMatch') }}
      </div>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <button class="btn btn-primary" @click="changePasswordReq" :disabled="isSubmitDisabled">
      {{
        loading ? $t('dashboard.account.changingPassword') : $t('dashboard.account.changePassword')
      }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { UsersService, type ChangePasswordReqDto } from '@/api'
import { i18n } from '@/utils/i18n'
import { getValidationRules, validateField, type SchemaName, type ValidationError } from '@/utils/validation'
import type { AxiosError } from 'axios'
import { computed, ref } from 'vue'

type changePasswordFrom = ChangePasswordReqDto & {
  confirmPassword: string
}

const showPassword = ref(false)
const showNewPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const changePassword = ref<changePasswordFrom>({
  currentPassword: '',
  password: '',
  confirmPassword: '',
})

const fieldErrors = ref<Record<keyof typeof changePassword.value, ValidationError[] | null>>({
  currentPassword: [],
  password: [],
  confirmPassword: [],
})

const schemaName: SchemaName = 'ChangePasswordReqDto'

function onFieldChange(field: keyof typeof changePassword.value) {
  if (field == 'confirmPassword') {
    fieldErrors.value.confirmPassword =
      changePassword.value.password === changePassword.value.confirmPassword ? [] : ['match']
    return
  }
  fieldErrors.value[field] = validateField(
    schemaName,
    field,
    changePassword.value[field],
  )
}

const hasError = (field: keyof typeof changePassword.value, errorType: ValidationError) => {
  return fieldErrors.value[field]?.includes(errorType) ?? false
}

const isSubmitDisabled = computed(() => {
  const allFilled = Object.values(changePassword.value).every((v) => v.trim().length > 0)
  const noErrors = Object.values(fieldErrors.value).every((errs) => errs?.length === 0)
  return !allFilled || !noErrors || loading.value
})

const validationRules = {
  password: getValidationRules(schemaName, 'password'),
}

const changePasswordReq = async () => {
  if (isSubmitDisabled.value) return
  const { confirmPassword, ...dto } = changePassword.value
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''
await UsersService.usersControllerChangePassword(dto)
    .then(() => {
      successMessage.value = i18n.global.t('dashboard.account.changePasswordSuccess')
    })
    .catch ((error: AxiosError) => {
    setTimeout(() => {
      errorMessage.value = ''
    }, 8000)
    if (error.status === 400) {
      errorMessage.value = i18n.global.t('dashboard.account.changePasswordBadOldPassword')
      return
    }
    errorMessage.value = i18n.global.t('dashboard.account.changePasswordError')
  })
  .finally(() => {
    changePassword.value.currentPassword = ''
    changePassword.value.password = ''
    changePassword.value.confirmPassword = ''
    loading.value = false
  })
}
</script>
