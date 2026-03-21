import apiClient from '@/services/httpClient'
import { DefaultApi } from '@/services/generated/api'
import { NavigationDTO } from '@/services/generated/api'

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

export const menuService = {
  // 1. 获取用户特定的导航菜单数据
  getUserMenus: async (): Promise<ApiResponse<NavigationDTO[]>> => {
    try {
      const api = new DefaultApi(undefined, '', apiClient)
      const response = await api.getUserNavigations()
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message,
      }
    } catch (error) {
      throw error
    }
  },
}
