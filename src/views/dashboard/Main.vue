<template>
  <div class="dashboard-view">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Online služby</div>
        <div class="stat-value">{{ stats.online }}</div>
      </div>
      <div class="stat-card offline">
        <div class="stat-label">Offline služby</div>
        <div class="stat-value">{{ stats.offline }}</div>
        <div class="power-icon">⏻</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">CPU Využití</div>
        <div class="stat-value small">{{ stats.cpu }}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">RAM Využití</div>
        <div class="stat-value small">{{ stats.ram }}%</div>
      </div>
    </div>

    <section class="apps-section">
      <h2 class="section-title">Rychlý přístup k aplikacím</h2>
      <div class="apps-grid">
        <a v-for="app in apps" :key="app.name" :href="app.url" class="app-card">
          <div class="app-icon">{{ app.icon }}</div>
          <div class="app-name">{{ app.name }}</div>
          <div class="app-status" :class="app.status">
            {{ app.status === 'online' ? 'Online' : 'Offline' }}
          </div>
        </a>
      </div>
    </section>

    <section class="services-section">
      <h2 class="section-title">Služby</h2>
      <table class="services-table">
        <thead>
          <tr>
            <th style="width: 50px"></th>
            <th>Název služby</th>
            <th>Stav</th>
            <th>Akce</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="(service, index) in services" :key="service.name">
            <tr>
              <td>
                <button
                  v-if="service.type === 'compose'"
                  class="expand-btn"
                  @click="toggleService(index)"
                >
                  {{ expandedServices.includes(index) ? '▼' : '▶' }}
                </button>
              </td>
              <td>
                <div class="service-name">
                  <span class="service-icon">{{ service.icon }}</span>
                  <span>{{ service.name }}</span>
                </div>
                <div class="service-type">{{ service.typeLabel }}</div>
              </td>
              <td>
                <span
                  class="status-badge"
                  :class="service.status === 'online' ? 'status-online' : 'status-offline'"
                >
                  {{ service.status === 'online' ? 'Online' : 'Offline' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn" @click="handleAction(service, 'stop')">
                    {{ service.status === 'online' ? 'Zastavit' : 'Spustit' }}
                  </button>
                  <button
                    v-if="service.type === 'container' && service.status === 'online'"
                    class="action-btn"
                    @click="handleAction(service, 'restart')"
                  >
                    🔄 Restart
                  </button>
                  <button
                    v-if="service.type === 'container' && service.status === 'online'"
                    class="action-btn"
                    @click="handleAction(service, 'console')"
                  >
                    📟 Konzole
                  </button>
                  <button
                    v-if="service.type === 'container' && service.status === 'online'"
                    class="action-btn"
                    @click="handleAction(service, 'logs')"
                  >
                    📋 Logy
                  </button>
                </div>
              </td>
            </tr>
            <tr
              v-if="service.type === 'compose' && expandedServices.includes(index)"
              class="sub-row"
            >
              <td colspan="4">
                <div class="sub-services">
                  <div
                    v-for="container in service.containers"
                    :key="container.name"
                    class="sub-service"
                  >
                    <div class="container-name">
                      <span class="docker-icon">🐳</span>
                      <span>{{ container.name }}</span>
                      <span
                        class="status-badge small"
                        :class="container.status === 'online' ? 'status-online' : 'status-offline'"
                      >
                        {{ container.status === 'online' ? 'online' : 'offline' }}
                      </span>
                    </div>
                    <div class="action-buttons">
                      <button
                        class="action-btn"
                        @click="handleContainerAction(container, 'restart')"
                      >
                        🔄 Restart
                      </button>
                      <button
                        class="action-btn"
                        @click="handleContainerAction(container, 'console')"
                      >
                        📟 Konzole
                      </button>
                      <button class="action-btn" @click="handleContainerAction(container, 'logs')">
                        📋 Logy
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref({
  online: 5,
  offline: 1,
  cpu: 24,
  ram: 58,
})

const apps = ref([
  { name: 'Immich', icon: '📸', url: '#immich', status: 'online' },
  { name: 'AdGuard Home', icon: '🛡️', url: '#adguard', status: 'online' },
  { name: 'Web API', icon: '🌐', url: '#webapi', status: 'online' },
  { name: 'Database', icon: '🗄️', url: '#database', status: 'offline' },
  { name: 'Monitoring', icon: '📊', url: '#monitoring', status: 'online' },
  { name: 'Portainer', icon: '🐳', url: '#portainer', status: 'online' },
])

const services = ref([
  {
    name: 'Immich',
    icon: '📸',
    type: 'compose',
    typeLabel: 'Docker Compose stack',
    status: 'online',
    containers: [
      { name: 'immich-server', status: 'online' },
      { name: 'immich-ml', status: 'online' },
    ],
  },
  {
    name: 'AdGuard Home',
    icon: '🛡️',
    type: 'container',
    typeLabel: 'Docker container',
    status: 'online',
  },
  {
    name: 'Web API',
    icon: '🌐',
    type: 'compose',
    typeLabel: 'Docker Compose stack',
    status: 'online',
    containers: [
      { name: 'nginx-proxy', status: 'online' },
      { name: 'backend', status: 'online' },
    ],
  },
  {
    name: 'Database',
    icon: '🗄️',
    type: 'compose',
    typeLabel: 'Docker Compose stack',
    status: 'offline',
    containers: [{ name: 'postgres', status: 'offline' }],
  },
  {
    name: 'Monitoring',
    icon: '📊',
    type: 'compose',
    typeLabel: 'Docker Compose stack',
    status: 'online',
    containers: [
      { name: 'prometheus', status: 'online' },
      { name: 'grafana', status: 'online' },
    ],
  },
])

const expandedServices = ref([])

const toggleService = (index) => {
  const idx = expandedServices.value.indexOf(index)
  if (idx > -1) {
    expandedServices.value.splice(idx, 1)
  } else {
    expandedServices.value.push(index)
  }
}

const handleAction = (service, action) => {
  console.log(`Action: ${action} on service: ${service.name}`)
}

const handleContainerAction = (container, action) => {
  console.log(`Action: ${action} on container: ${container.name}`)
}
</script>

<style scoped>
.dashboard-view {
  width: 100%;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: linear-gradient(135deg, rgba(28, 175, 135, 0.05), rgba(7, 81, 141, 0.05));
  border: 1px solid rgba(28, 175, 135, 0.2);
  border-radius: 16px;
  padding: 30px;
  position: relative;
  transition: all 0.3s;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(28, 175, 135, 0.2);
  border-color: var(--color-primary);
}

.stat-label {
  color: rgba(253, 238, 216, 0.7);
  font-size: 14px;
  margin-bottom: 15px;
  font-weight: 500;
}

.stat-value {
  font-size: 48px;
  font-weight: bold;
  color: var(--color-primary);
  text-shadow: 0 0 20px rgba(28, 175, 135, 0.4);
}

.stat-value.small {
  font-size: 36px;
}

.offline .stat-value {
  color: #ef4444;
  text-shadow: 0 0 20px rgba(239, 68, 68, 0.4);
}

.power-icon {
  position: absolute;
  top: 25px;
  right: 25px;
  color: #ef4444;
  font-size: 28px;
  filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.5));
}

.apps-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: 600;
  color: var(--color-primary);
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.app-card {
  background: linear-gradient(135deg, rgba(28, 175, 135, 0.08), rgba(7, 81, 141, 0.08));
  border: 1px solid rgba(28, 175, 135, 0.2);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  text-decoration: none;
  color: var(--color-text);
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.app-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  transform: scaleX(0);
  transition: transform 0.3s;
}

.app-card:hover::before {
  transform: scaleX(1);
}

.app-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(28, 175, 135, 0.25);
  border-color: var(--color-primary);
  background: linear-gradient(135deg, rgba(28, 175, 135, 0.12), rgba(7, 81, 141, 0.12));
}

.app-icon {
  font-size: 48px;
  margin-bottom: 12px;
  filter: drop-shadow(0 4px 8px rgba(28, 175, 135, 0.3));
}

.app-name {
  font-weight: 600;
  font-size: 14px;
}

.app-status {
  font-size: 11px;
  margin-top: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-block;
}

.app-status.online {
  background: rgba(28, 175, 135, 0.2);
  color: var(--color-primary);
}

.app-status.offline {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.services-section {
  margin-top: 40px;
}

.services-table {
  width: 100%;
  border-collapse: collapse;
  background: linear-gradient(135deg, rgba(28, 175, 135, 0.03), rgba(7, 81, 141, 0.03));
  border: 1px solid rgba(28, 175, 135, 0.2);
  border-radius: 16px;
  overflow: hidden;
}

.services-table thead {
  background: rgba(28, 175, 135, 0.1);
}

.services-table th {
  padding: 20px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid rgba(28, 175, 135, 0.2);
  color: var(--color-primary);
}

.services-table td {
  padding: 20px;
  border-bottom: 1px solid rgba(253, 238, 216, 0.05);
}

.services-table tbody tr:hover {
  background: rgba(28, 175, 135, 0.05);
}

.service-name {
  font-weight: 600;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.service-icon {
  font-size: 24px;
}

.service-type {
  color: rgba(253, 238, 216, 0.5);
  font-size: 13px;
  margin-top: 4px;
  margin-left: 36px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

.status-badge.small {
  font-size: 11px;
  padding: 2px 8px;
}

.status-online {
  background: rgba(28, 175, 135, 0.2);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.status-offline {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid #ef4444;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid rgba(28, 175, 135, 0.3);
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
}

.action-btn:hover {
  background: rgba(28, 175, 135, 0.1);
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.expand-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  font-size: 18px;
  padding: 5px;
  transition: all 0.3s;
}

.expand-btn:hover {
  transform: scale(1.2);
}

.sub-row td {
  padding: 0 !important;
  background: rgba(28, 175, 135, 0.02);
}

.sub-services {
  padding-left: 40px;
}

.sub-service {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-top: 1px solid rgba(253, 238, 216, 0.05);
}

.container-name {
  display: flex;
  align-items: center;
  gap: 10px;
}

.docker-icon {
  color: var(--color-secondary);
  font-size: 16px;
}
</style>
