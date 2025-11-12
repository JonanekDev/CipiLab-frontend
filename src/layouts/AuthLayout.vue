<template>
  <div class="auth-layout">
    <div class="bg-animation">
      <div class="circle circle1"></div>
      <div class="circle circle2"></div>
      <div class="circle circle3"></div>
    </div>

    <div class="auth-container">
      <div class="auth-box">
        <div class="logo-section">
          <div class="logo">CipiLab</div>
          <div class="logo-subtitle">{{ $t('common.slogan') }}</div>
        </div>

        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.bg-animation {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 20s infinite ease-in-out;
}

.circle1 {
  width: 300px;
  height: 300px;
  background: var(--color-primary);
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.circle2 {
  width: 200px;
  height: 200px;
  background: var(--color-secondary);
  bottom: -100px;
  right: -100px;
  animation-delay: 5s;
}

.circle3 {
  width: 250px;
  height: 250px;
  background: var(--color-accent);
  top: 50%;
  right: 10%;
  animation-delay: 10s;
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(50px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-30px, 30px) scale(0.9);
  }
}

.auth-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 450px;
  padding: 20px;
  margin: 0 auto;
}

.auth-box {
  background: linear-gradient(135deg, rgba(28, 175, 135, 0.08), rgba(7, 81, 141, 0.08));
  border: 1px solid rgba(28, 175, 135, 0.3);
  border-radius: 24px;
  padding: 50px 40px;
  backdrop-filter: blur(10px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;
}

.auth-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
}

.logo-section {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  font-size: 42px;
  font-weight: bold;
  color: var(--color-primary);
  text-shadow: 0 0 30px rgba(28, 175, 135, 0.5);
  margin-bottom: 10px;
}

.logo-subtitle {
  color: rgba(253, 238, 216, 0.6);
  font-size: 16px;
}

@media (max-width: 480px) {
  .auth-box {
    padding: 40px 25px;
  }

  .logo {
    font-size: 36px;
  }
}
</style>
