import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { resolveMessage } from '@/utils/messageResolver'

// 扩展 Window 接口以支持全局 snackbar 函数
declare global {
  interface Window {
    showSnackbar?: (
      message: string,
      color?: 'success' | 'error' | 'info' | 'warning',
      timeout?: number
    ) => void
  }
}

const apiClient: AxiosInstance = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 确保发送cookie
})

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  messageCode?: string
  messageArgs?: string[]
  message?: string
}

// 标记正在刷新token的promise，避免重复刷新
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

// 解析并显示错误消息
const showError = (messageCode: string, messageArgs?: string[], requestUrl?: string) => {
  let message = resolveMessage(messageCode, ...(messageArgs || []))

  // 根据API路径对特定错误码进行特殊处理
  if (messageCode === 'E010' && requestUrl) {
    // 用户查询相关API的参数错误，通常表示用户不存在
    if (
      requestUrl.includes('/api/users/') &&
      !requestUrl.includes('/api/users/batch') &&
      !requestUrl.includes('/api/users/create') &&
      !requestUrl.includes('/api/users/update')
    ) {
      message = '用户未找到'
    }
    // 批量查询用户的参数错误
    else if (requestUrl.includes('/api/users/batch')) {
      message = '指定的用户未找到'
    }
  }

  // 尝试使用全局 snackbar 函数，如果不存在则使用 alert
  if (window.showSnackbar) {
    window.showSnackbar(message, 'error')
  } else {
    // 临时使用 alert，后续可以替换为真正的 snackbar
    console.error('API Error:', message)
    // 可以考虑使用其他通知机制
  }
}

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

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // 统一处理 API 响应
    const apiResponse = response.data

    if (!apiResponse.success) {
      // 处理业务逻辑错误
      if (apiResponse.messageCode) {
        showError(apiResponse.messageCode, apiResponse.messageArgs, response.config.url)
      }

      // 拒绝 Promise，让调用方知道请求失败
      return Promise.reject(new Error(apiResponse.messageCode || 'Request failed'))
    }

    // 成功情况，直接返回响应
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
        // 如果已经在刷新，将请求加入队列
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
          // 刷新成功，更新原请求的token
          originalRequest.headers.Authorization = `Bearer ${authStore.token}`
          processQueue(null, authStore.token)
          return apiClient(originalRequest)
        } else {
          // 刷新失败，跳转到登录页
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

    // 处理网络错误或其他异常
    if (error.response) {
      // 服务器返回了错误响应（非 401）
      const apiResponse = error.response.data as ApiResponse
      if (apiResponse && apiResponse.messageCode) {
        showError(apiResponse.messageCode, apiResponse.messageArgs, error.config?.url)
      }
    }

    return Promise.reject(error)
  }
)

export const request = async <T = any>(config: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  const response = await apiClient.request<ApiResponse<T>>(config)
  return response.data
}

export default apiClient
