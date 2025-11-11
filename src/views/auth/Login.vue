<template>
  <div class="login-view">
    <div class="welcome-text">
      <h2>{{ $t('auth.welcomeBack') }}</h2>
      <p>{{ $t('auth.loginDesc') }}</p>
    </div>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label class="form-label" for="email">{{ $t('auth.email') }}</label>
        <input
          v-model="credentials.email"
          type="text"
          id="email"
          class="form-input"
          placeholder="email@scipak.eu"
          required
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="password">{{ $t('auth.password') }}</label>
        <div class="password-wrapper">
          <input
            v-model="credentials.password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            class="form-input"
            placeholder="••••••••"
            required
          />
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </button>
        </div>
      </div>

      <div class="form-options">
        <label class="checkbox-wrapper">
          <input v-model="credentials.rememberMe" type="checkbox" id="remember" />
          <span>{{ $t('auth.rememberMe') }}</span>
        </label>
        <a href="#" class="link-primary">{{ $t('auth.forgotPassword') }}</a>
      </div>

      <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
        {{ loading ? $t('auth.loginLoading') : $t('auth.login') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { LoginReqDto } from '@/api';
import { i18n } from '@/i18n';
import { useAuthStore } from '@/stores/auth';
import { ref, watch } from 'vue';

const credentials = ref<LoginReqDto>({
  email: '',
  password: '',
  rememberMe: false,
});
const showPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');

// Clear error message when user starts typing
watch([credentials], () => {
  if (errorMessage.value) {
    errorMessage.value = ''
  }
}, { deep: true });

const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  const AuthStore = useAuthStore();
  try {
    await AuthStore.login(credentials.value);
  } catch (error: any) {
    errorMessage.value = i18n.global.t('auth.loginError') as string;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-view {
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  font-size: 14px;
}

.footer-text {
  text-align: center;
  margin-top: 30px;
  font-size: 14px;
  color: rgba(253, 238, 216, 0.5);
}

@media (max-width: 480px) {
  .social-login {
    grid-template-columns: 1fr;
  }
}
</style>
