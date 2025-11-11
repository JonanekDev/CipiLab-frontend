<template>
  <div class="loading-view">
    <div class="loading-container">
      <div class="loading-logo">CipiLab</div>
      
      <div class="dots-animation">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
.loading-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.loading-logo {
  font-size: 48px;
  font-weight: bold;
  color: var(--color-primary);
  text-shadow: 0 0 40px rgba(28, 175, 135, 0.6);
}

.dots-animation {
  display: flex;
  gap: 12px;
  align-items: center;
}

.dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: bounce 1.4s ease-in-out infinite;
  box-shadow: 0 0 15px rgba(28, 175, 135, 0.6);
}

.dot:nth-child(1) {
  animation-delay: 0s;
  background: var(--color-primary);
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
  background: var(--color-secondary);
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
  background: var(--color-accent);
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.8) translateY(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.2) translateY(-20px);
    opacity: 1;
  }
}
</style>