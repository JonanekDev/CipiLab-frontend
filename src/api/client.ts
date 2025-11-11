import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { OpenAPI } from './core/OpenAPI'
import { useAuthStore } from '@/stores/auth'

// Configure OpenAPI client
OpenAPI.BASE = import.meta.env.VITE_API_BASE_URL || '/api'
OpenAPI.WITH_CREDENTIALS = true

// Dynamic headers with auth token
OpenAPI.HEADERS = async () => {
  const authStore = useAuthStore()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (authStore.session?.accessToken) {
    headers.Authorization = `Bearer ${authStore.session.accessToken}`
  }

  return headers
}

// Token refresh queue management
interface QueuedRequest {
  resolve: (value?: unknown) => void
  reject: (error: unknown) => void
  config: InternalAxiosRequestConfig
}

let isRefreshing = false
let failedQueue: QueuedRequest[] = []

function processQueue(error: Error | null, token: string | null = null): void {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error)
    } else if (token) {
      // Update authorization header and retry request
      promise.config.headers.Authorization = `Bearer ${token}`
      axios(promise.config).then(promise.resolve).catch(promise.reject)
    } else {
      promise.reject(new Error('No token available'))
    }
  })

  failedQueue = []
}

// Request interceptor
axios.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor with token refresh logic
axios.interceptors.response.use(
  (response) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // If no config or not a 401 error, reject immediately
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    if (originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error)
    }

    // Prevent infinite retry loops
    if (originalRequest._retry) {
      return Promise.reject(error)
    }

    originalRequest._retry = true

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest })
      })
    }

    isRefreshing = true

    const authStore = useAuthStore()

    try {
      // Attempt to refresh the access token
      await authStore.refreshAccessToken()

      const newToken = authStore.session?.accessToken

      if (!newToken) {
        throw new Error('Token refresh failed - no new token received')
      }

      // Process all queued requests with the new token
      processQueue(null, newToken)

      // Retry the original request with the new token
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return axios(originalRequest)
    } catch (refreshError) {
      // Refresh failed - reject all queued requests
      processQueue(refreshError as Error, null)
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export { axios }