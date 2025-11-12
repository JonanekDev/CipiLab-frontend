<template>
  <div class="settings-page">
    <div class="page-header">
      <h1 class="page-title">{{ $t('nav.userManagement') }}</h1>
      <button class="btn btn-primary" @click="showAddUser = true">➕ Přidat uživatele</button>
    </div>

    <div class="settings-card">
      <table class="users-table">
        <thead>
          <tr>
            <th>Jméno</th>
            <th>E-mail</th>
            <th>Role</th>
            <th>Poslední přihlášení</th>
            <th>Akce</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>
              <div class="user-cell">
                <span class="user-avatar">{{ user.avatar }}</span>
                <span>{{ user.name }}</span>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span class="role-badge" :class="user.role">{{ getRoleLabel(user.role) }}</span>
            </td>
            <td>{{ user.lastLogin }}</td>
            <td>
              <div class="action-buttons">
                <button class="action-btn" @click="editUser(user)">✏️</button>
                <button class="action-btn danger" @click="deleteUser(user)">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showAddUser = ref(false)

const users = ref([
  { id: 1, name: 'Admin User', email: 'cipi@lab.dev', role: 'admin', avatar: '👤', lastLogin: '5 minut' },
  { id: 2, name: 'Jan Novák', email: 'jan@example.com', role: 'user', avatar: '👨', lastLogin: '2 hodiny' },
  { id: 3, name: 'Marie Svobodová', email: 'marie@example.com', role: 'user', avatar: '👩', lastLogin: '1 den' }
])

const getRoleLabel = (role: string) => {
  const labels: Record<string, string> = {
    admin: 'Administrátor',
    user: 'Uživatel'
  }
  return labels[role] || role
}

const editUser = (user: any) => {
  console.log('Edit user:', user)
}

const deleteUser = (user: any) => {
  console.log('Delete user:', user)
}
</script>

<style scoped>

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}


.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table thead {
  border-bottom: 1px solid rgba(28, 175, 135, 0.2);
}

.users-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: var(--color-primary);
}

.users-table td {
  padding: 15px;
  border-bottom: 1px solid rgba(253, 238, 216, 0.05);
}

.users-table tbody tr:hover {
  background: rgba(28, 175, 135, 0.05);
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  font-size: 24px;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.role-badge.admin {
  background: rgba(28, 175, 135, 0.2);
  color: var(--color-primary);
}

.role-badge.user {
  background: rgba(7, 81, 141, 0.2);
  color: var(--color-secondary);
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

.action-btn.danger {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.action-btn.danger:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>