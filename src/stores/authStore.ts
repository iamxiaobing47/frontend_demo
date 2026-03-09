import { defineStore } from 'pinia'
import apiClient from '@/services/httpClient'
import { DefaultApi } from '@/services/generated/api'
import { useMenuStore } from '@/stores/menuStore'

interface UserInfo {
  username: string
  email: string
  role: 'employee' | 'business_owner'
  businessOwnerId?: string
  locationId?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 清理可能的旧 token
    token: (() => {
      if (localStorage.getItem('mocktoken')) {
        localStorage.removeItem('mocktoken')
      }
      return localStorage.getItem('accessToken') || null
    })(),
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null') as UserInfo | null,
    isRefreshing: false,
  }),

  getters: {
    isAuthenticated(): boolean {
      return !!this.token
    },
  },

  actions: {
    async login(email: string, password: string): Promise<void> {
      // 使用生成的 API 类，但传入自定义的 httpClient
      // 传入空字符串作为 basePath，让请求使用相对路径（通过 Vite 代理）
      const api = new DefaultApi(undefined, '', apiClient)
      const response = await api.login({
        email,
        password,
      })

      // 由于 httpClient 已经处理了错误，这里只处理成功情况
      // response.data.data 不会是 undefined，因为错误情况已经被 httpClient 拦截
      const loginData = response.data.data!
      const accessToken = loginData.accessToken

      // 存储accessToken到localStorage
      this.token = accessToken || null
      localStorage.setItem('accessToken', accessToken || '')

      // 获取完整的用户信息
      const user = await this.fetchCurrentUser()
      this.userInfo = user
      localStorage.setItem('userInfo', JSON.stringify(user))

      // Set user role in menu store and fetch user-specific menus
      const menuStore = useMenuStore()
      menuStore.setUserRole(
        user.role as 'employee' | 'business_owner',
        user.businessOwnerId,
        user.locationId
      )

      // Fetch user-specific menus after successful login
      await menuStore.fetchUserMenus()

      // Update router with user-specific routes
      const { generateRoutesFromMenus } = await import('@/router')
      generateRoutesFromMenus(menuStore.menus)

      // 成功时直接返回，不需要返回 success 状态
    },

    async logout(): Promise<void> {
      try {
        // 使用生成的 API 类，但传入自定义的 httpClient
        // 传入空字符串作为 basePath，让请求使用相对路径（通过 Vite 代理）
        const api = new DefaultApi(undefined, '', apiClient)
        await api.logout()
      } catch (error) {
        console.error('Logout failed:', error)
      } finally {
        // 清除本地存储
        this.token = null
        this.userInfo = null
        localStorage.removeItem('accessToken')
        localStorage.removeItem('userInfo')
      }
    },

    async refreshToken(): Promise<boolean> {
      if (this.isRefreshing) {
        // 如果已经在刷新，等待完成
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
        // 从cookie中获取refreshToken（浏览器自动处理）
        // 注意：这里需要从localStorage中获取refreshToken或者从其他方式获取
        // 因为我们使用的是DefaultApi，需要根据实际API设计来实现
        // 目前先留空实现，因为可能需要额外的refreshToken信息
        console.warn('Refresh token functionality may need additional implementation')
        this.isRefreshing = false
        return false // 暂时返回false，因为缺少refreshToken信息
      } catch (error) {
        console.error('Refresh token failed:', error)
        // 如果刷新失败，清除所有认证信息
        this.logout()
        this.isRefreshing = false
        return false
      }
    },

    async checkAndRefreshToken(): Promise<boolean> {
      if (!this.token) {
        return false
      }

      // 这里可以添加JWT过期检查逻辑
      // 简单起见，我们直接尝试刷新或保持当前状态
      return true
    },

    async fetchCurrentUser(): Promise<UserInfo> {
      try {
        // 使用生成的 API 类，但传入自定义的 httpClient
        // 传入空字符串作为 basePath，让请求使用相对路径（通过 Vite 代理）
        const api = new DefaultApi(undefined, '', apiClient)
        const response = await api.getCurrentUser()

        if (response.data.success && response.data.data) {
          const userData = response.data.data
          return {
            username: userData.username || '',
            email: userData.email || '',
            role: (userData.role as 'employee' | 'business_owner') || 'employee',
            businessOwnerId: userData.businessOwnerId,
            locationId: userData.locationId,
          }
        } else {
          // 如果获取用户信息失败，使用已有的本地存储信息
          const storedUserInfo = localStorage.getItem('userInfo')
          if (storedUserInfo) {
            const parsed = JSON.parse(storedUserInfo)
            // 确保返回的用户信息符合 UserInfo 接口
            return {
              username: parsed.username || '',
              email: parsed.email || '',
              role: (parsed.role as 'employee' | 'business_owner') || 'employee',
              businessOwnerId: parsed.businessOwnerId,
              locationId: parsed.locationId,
            }
          } else {
            throw new Error(response.data.message || 'Failed to fetch user info')
          }
        }
      } catch (error) {
        console.error('Failed to fetch current user info:', error)
        // 如果获取失败，使用本地存储的用户信息
        const storedUserInfo = localStorage.getItem('userInfo')
        if (storedUserInfo) {
          const parsed = JSON.parse(storedUserInfo)
          // 确保返回的用户信息符合 UserInfo 接口
          return {
            username: parsed.username || '',
            email: parsed.email || '',
            role: (parsed.role as 'employee' | 'business_owner') || 'employee',
            businessOwnerId: parsed.businessOwnerId,
            locationId: parsed.locationId,
          }
        } else {
          throw error
        }
      }
    },
  },
})
