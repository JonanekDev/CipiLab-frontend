import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  type UserEntity,
  type LoginReqDto,
  type TokenRefreshResDto,
  type TokenRefreshReqDto,
  AuthService,
  StatusService,
} from '@/api'
import router from '@/router'

// Local storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  SESSION_ID: 'sessionId',
} as const

export const useAuthStore = defineStore('auth', () => {
  // State
  const session = ref<TokenRefreshResDto | null>(null)
  const user = ref<UserEntity | null>(null)
  const setupCompleted = ref<boolean | null>(null)
  const loading = ref(true)

  // Computed
  const isAuthenticated = computed(() => !!session.value && !!user.value)

  // Actions
  function setSession(sessionData: TokenRefreshResDto): void {
    session.value = sessionData
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, sessionData.accessToken)
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, sessionData.sessionId.toString())
  }

  function clearSession(): void {
    session.value = null
    user.value = null
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.SESSION_ID)
  }

  async function login(dto: LoginReqDto): Promise<void> {
    try {
      const response = await AuthService.authControllerLogin(dto)
      setSession(response.session)
      user.value = response.user
      await router.push('/')
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  async function logout(): Promise<void> {
    try {
      if (session.value?.sessionId) {
        await AuthService.authControllerLogout({ sessionId: session.value.sessionId })
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      clearSession()
      await router.push('/login')
    }
  }

  async function refreshAccessToken(): Promise<void> {
    if (!session.value?.sessionId) {
      throw new Error('No session ID available for refresh')
    }

    try {
      const dto: TokenRefreshReqDto = { sessionId: session.value.sessionId }
      const response = await AuthService.authControllerRefresh(dto)
      setSession(response)
    } catch (error) {
      console.error('Failed to refresh access token:', error)
      clearSession()
      await router.push('/login')
      throw error
    }
  }

  async function fetchCurrentUser(): Promise<void> {
    try {
      const response = await StatusService.statusControllerGetStatus()
      
      setupCompleted.value = response.setupCompleted
      
      if (response.user) {
        user.value = response.user
      } else if (session.value?.accessToken) {
        try {
          await refreshAccessToken()
        } catch (refreshError) {
          console.warn('Token refresh failed, clearing session')
          clearSession()
        }
      }
    } catch (error) {
      console.error('Failed to fetch status:', error)
    }
  }

  async function init(): Promise<void> {
    loading.value = true

    try {
      // Try to restore session from localStorage
      const storedToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
      const storedSessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID)

      if (storedToken && storedSessionId) {
        session.value = {
          accessToken: storedToken,
          sessionId: parseInt(storedSessionId, 10),
        }
      }

      // Fetch user and setup status
      await fetchCurrentUser()
    } catch (error) {
      console.error('Auth initialization failed:', error)
      clearSession()
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    session,
    user,
    loading,
    setupCompleted,
    
    // Computed
    isAuthenticated,
    
    // Actions
    login,
    logout,
    refreshAccessToken,
    init,
  }
})