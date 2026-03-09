import apiClient from '@/services/api'
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
  getUserMenus: async (): Promise<ApiResponse<MenuItem[]>> => {
    try {
      const response = await apiClient.get('/navigations/user')
      // 将NavigationDto转换为MenuItem格式
      return {
        success: response.data.success || false,
        data: response.data.data as MenuItem[], // 假设结构兼容
        message: response.data.message,
      }
    } catch (error) {
      console.error('Error fetching user menus:', error)
      throw error
    }
  },

  /**
   * 获取所有可用菜单（用于超级用户，如据点X）
   */
  getAllMenus: async (): Promise<ApiResponse<MenuItem[]>> => {
    try {
      const response = await apiClient.get('/navigations/all')
      return {
        success: response.data.success || false,
        data: response.data.data as MenuItem[], // 假设结构兼容
        message: response.data.message,
      }
    } catch (error) {
      console.error('Error fetching all menus:', error)
      throw error
    }
  },

  /**
   * 根据用户类型和关联ID获取菜单
   */
  getMenusByUserType: async (
    userType: 'employee' | 'business_owner',
    associatedId?: string
  ): Promise<ApiResponse<MenuItem[]>> => {
    try {
      const params: Record<string, string> = { userType }
      if (associatedId) {
        params.associatedId = associatedId
      }
      const response = await apiClient.get('/navigations/by-type', { params })
      return {
        success: response.data.success || false,
        data: response.data.data as MenuItem[], // 假设结构兼容
        message: response.data.message,
      }
    } catch (error) {
      console.error('Error fetching menus by user type:', error)
      throw error
    }
  },
}
