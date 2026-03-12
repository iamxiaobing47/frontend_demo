import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { resolveMessage } from '@/utils/messageResolver'

// 1. 扩展Window接口以支持全局消息提示函数
declare global {
  interface Window {
    showSnackbar?: (
      message: string,
      color?: 'success' | 'error' | 'info' | 'warning',
      timeout?: number
    ) => void
  }
}

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  messageCode?: string
  messageArgs?: string[]
  message?: string
}

const apiClient: AxiosInstance = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// 2. 令牌刷新队列管理，避免重复刷新请求
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// 3. 统一错误消息处理和显示
const showError = (messageCode: string, messageArgs?: string[]) => {
  let message = resolveMessage(messageCode, ...(messageArgs || []))

  if (window.showSnackbar) {
    window.showSnackbar(message, 'error')
  } else {
    console.error('API Error:', message)
  }
}

// 4. 请求拦截器：添加认证令牌
apiClient.interceptors.request.use(
  config => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 5. 响应拦截器：统一处理API响应和错误
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const apiResponse = response.data

    if (!apiResponse.success) {
      if (apiResponse.messageCode) {
        showError(apiResponse.messageCode, apiResponse.messageArgs)
      }

      return Promise.reject(new Error(apiResponse.messageCode || 'Request failed'))
    }

    return response
  },
  async error => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/api/auth/login'
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const authStore = useAuthStore()
        const newToken = await authStore.refreshToken()

        if (newToken && authStore.token) {
          originalRequest.headers.Authorization = `Bearer ${authStore.token}`
          processQueue(null, authStore.token)
          return apiClient(originalRequest)
        } else {
          authStore.logout()
          window.location.href = '/login'
          processQueue(new Error('Token refresh failed'))
          return Promise.reject(error)
        }
      } catch (refreshError) {
        useAuthStore().logout()
        window.location.href = '/login'
        processQueue(refreshError)
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    if (error.response) {
      const apiResponse = error.response.data as ApiResponse
      if (apiResponse && apiResponse.messageCode) {
        showError(apiResponse.messageCode, apiResponse.messageArgs)
      }
    }

    return Promise.reject(error)
  }
)

// 6. 封装请求函数，直接返回数据部分
export const request = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.request<ApiResponse<T>>(config)
  return response.data.data
}

export default apiClient
