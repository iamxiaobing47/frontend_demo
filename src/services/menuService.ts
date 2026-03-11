import apiClient from '@/services/httpClient'
import { NavigationControllerApi } from '@/services/generated/api'
import { NavigationDTO } from '@/services/generated/api'
import { MenuItem } from '@/stores/menuStore'

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

export const menuService = {
  /**
   * 获取用户特定的菜单
   */
  getUserMenus: async (): Promise<ApiResponse<NavigationDTO[]>> => {
    try {
      // 使用生成的 API 类，但传入自定义的 httpClient
      // 传入空字符串作为 basePath，让请求使用相对路径（通过 Vite 代理）
      const api = new NavigationControllerApi(undefined, '', apiClient)
      const response = await api.getUserNavigations()
      // 返回原始的 NavigationDTO 数组，在 store 中进行转换
      return {
        success: true,
        data: response.data.data || [],
        message: response.data.message,
      }
    } catch (error) {
      // 错误已经在 httpClient 中处理并显示
      throw error
    }
  },
}
