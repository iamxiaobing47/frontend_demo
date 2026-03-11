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
    token: (() => {
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
    /**
     * 用户登录方法
     * @param email 用户邮箱
     * @param password 用户密码
     * @throws 如果登录失败，httpClient 拦截器会自动处理错误并抛出异常
     * @description
     * - 调用 API 进行登录验证
     * - 成功后存储访问令牌和用户信息
     * - 设置用户角色并获取用户特定菜单
     * - 更新路由配置
     */
    async login(email: string, password: string): Promise<void> {
      // 使用生成的 API 类，传入自定义的 httpClient
      // 传入空字符串作为 basePath，让请求使用相对路径（通过 Vite 代理）
      const api = new DefaultApi(undefined, '', apiClient)
      const response = await api.login({
        email,
        password,
      })

      // httpClient 已经处理了错误，这里只处理成功情况
      // response.data.data 不会是 undefined，因为错误情况已被 httpClient 拦截
      const loginData = response.data.data!
      const accessToken = loginData.accessToken

      // 存储访问令牌到 localStorage
      this.token = accessToken || null
      localStorage.setItem('accessToken', accessToken || '')

      // 获取完整的用户信息并存储
      const user = loginData.userInfo
      if (user) {
        this.userInfo = {
          username: user.userName || '',
          email: user.email || '',
          role: user.userType === 'BUSINESS_USER' ? 'business_owner' : 'employee',
          businessOwnerId: user.orgId,
          locationId: user.orgId,
        }
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      }

      // 设置用户角色并获取用户特定菜单
      const menuStore = useMenuStore()

      // 获取用户特定菜单
      await menuStore.fetchUserMenus()
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
      // 直接返回本地存储的用户信息
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
        throw new Error('No user info found in local storage')
      }
    },
  },
})
