import { defineStore } from 'pinia'
import apiClient from '@/services/httpClient'
import { DefaultApi } from '@/services/generated/api'
import { useMenuStore } from '@/stores/menuStore'

interface UserInfo {
  username: string
  email: string
  businessOwnerId?: string
  locationId?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    userInfo: null as UserInfo | null,
    isRefreshing: false,
  }),

  getters: {
    isAuthenticated(): boolean {
      return !!this.token
    },
  },

  actions: {
    // 1. 用户登录：验证凭据并初始化用户会话
    async login(email: string, password: string): Promise<void> {
      const api = new DefaultApi(undefined, '', apiClient)
      const response = await api.login({
        email,
        password,
      })

      const loginData = response.data.data!
      const accessToken = loginData.accessToken

      this.token = accessToken || null

      const user = loginData.userInfo
      if (user) {
        this.userInfo = {
          username: user.userName || '',
          email: user.email || '',
          businessOwnerId: user.orgId,
          locationId: user.orgId,
        }
      }

      const menuStore = useMenuStore()
      await menuStore.fetchUserMenus()
    },

    // 2. 用户登出：清除认证状态并重定向到登录页
    async logout(): Promise<void> {
      try {
        const api = new DefaultApi(undefined, '', apiClient)
        await api.logout()
      } catch (error) {
        console.error('Logout failed:', error)
      } finally {
        this.token = null
        this.userInfo = null
      }
    },

    // 3. 刷新访问令牌：处理令牌过期场景
    async refreshToken(): Promise<boolean> {
      if (this.isRefreshing) {
        return new Promise<boolean>(resolve => {
          const checkRefresh = () => {
            if (!this.isRefreshing) {
              resolve(!!this.token)
            } else {
              setTimeout(checkRefresh, 100)
            }
          }
          checkRefresh()
        })
      }

      this.isRefreshing = true
      try {
        const api = new DefaultApi(undefined, '', apiClient)
        const response = await api.refreshToken({})

        const loginData = response.data.data!
        const newAccessToken = loginData.accessToken

        if (newAccessToken) {
          this.token = newAccessToken
          this.isRefreshing = false
          return true
        }

        this.isRefreshing = false
        return false
      } catch (error) {
        console.error('Refresh token failed:', error)
        this.isRefreshing = false
        return false
      }
    },

    // 4. 检查并刷新令牌：验证当前令牌有效性
    async checkAndRefreshToken(): Promise<boolean> {
      if (!this.token) {
        return false
      }
      return true
    },

    // 5. 获取当前用户信息：从store返回已缓存的用户数据
    async fetchCurrentUser(): Promise<UserInfo> {
      if (this.userInfo) {
        return this.userInfo
      } else {
        throw new Error('No user info found in store')
      }
    },
  },

  persist: {
    key: 'auth',
    storage: sessionStorage,
  },
})
