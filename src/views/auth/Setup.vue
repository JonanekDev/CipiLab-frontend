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
          v-model="username"
          type="text"
          id="username"
          class="form-input"
          placeholder="admin"
          required
        >
      </div>

      <div class="form-group">
        <label class="form-label" for="email">{{ $t('auth.email') }}</label>
        <input
          v-model="email"
          type="email"
          id="email"
          class="form-input"
          placeholder="email@scipak.eu"
          required
        >
      </div>

      <div class="form-group">
        <label class="form-label" for="password">{{ $t('auth.password') }}</label>
        <div class="password-wrapper">
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            id="password"
            class="form-input"
            placeholder="••••••••"
            required
          >
          <button type="button" class="toggle-password" @click="showPassword = !showPassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </button>
        </div>
        <div class="form-hint">Minimálně 8 znaků</div>
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
            required
          >
          <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
            {{ showConfirmPassword ? '🙈' : '👁️' }}
          </button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="serverName">{{ $t('setup.serverName') }}</label>
        <input
          v-model="serverName"
          type="text"
          id="serverName"
          class="form-input"
          placeholder="Jonáš's CipiLab"
          required
        >
      </div>

      <button type="submit" class="btn btn-primary btn-full" :disabled="loading">
        {{ loading ? $t('setup.completeSetupLoading') : $t('setup.completeSetup') }}
      </button>
    </form>

  </div>
</template>

<script setup>
import { ref } from 'vue';

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const serverName = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const handleSetup = async () => {
  errorMessage.value = '';
  successMessage.value = '';

  if (password.value.length < 8) {
    errorMessage.value = 'Heslo musí mít alespoň 8 znaků';
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Hesla se neshodují';
    return;
  }

  loading.value = true;

  setTimeout(() => {
    successMessage.value = 'Účet byl úspěšně vytvořen!';
    loading.value = false;
  }, 1500);
};
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