// import apiClient from '@/services/httpClient'
// import { NavigationControllerApi } from '@/services/generated/api'
// import { MenuItem } from '@/stores/menuStore'

// export interface ApiResponse<T = any> {
//   success: boolean
//   data: T
//   message?: string
// }

// export const menuService = {
//   /**
//    * 获取用户特定的菜单
//    */
//   getUserMenus: async (): Promise<ApiResponse<MenuItem[]>> => {
//     try {
//       // 使用生成的 API 类，但传入自定义的 httpClient
//       // 传入空字符串作为 basePath，让请求使用相对路径（通过 Vite 代理）
//       const api = new NavigationControllerApi(undefined, '', apiClient)
//       const response = await api.getUserNavigations()
//       // 将NavigationDto转换为MenuItem格式
//       return {
//         success: true,
//         data: response.data.data as MenuItem[], // 假设结构兼容
//         message: response.data.message,
//       }
//     } catch (error) {
//       // 错误已经在 httpClient 中处理并显示
//       throw error
//     }
//   },

//   /**
//    * 获取所有可用菜单（用于超级用户，如据点X）
//    */
//   getAllMenus: async (): Promise<ApiResponse<MenuItem[]>> => {
//     try {
//       // 使用生成的 API 类，但传入自定义的 httpClient
//       // 传入空字符串作为 basePath，让请求使用相对路径（通过 Vite 代理）
//       const api = new NavigationControllerApi(undefined, '', apiClient)
//       const response = await api.getAllNavigations()
//       return {
//         success: true,
//         data: response.data.data as MenuItem[], // 假设结构兼容
//         message: response.data.message,
//       }
//     } catch (error) {
//       // 错误已经在 httpClient 中处理并显示
//       throw error
//     }
//   },

//   /**
//    * 根据用户类型和关联ID获取菜单
//    */
//   getMenusByUserType: async (
//     userType: 'employee' | 'business_owner',
//     associatedId?: string
//   ): Promise<ApiResponse<MenuItem[]>> => {
//     try {
//       // 使用生成的 API 类，但传入自定义的 httpClient
//       // 传入空字符串作为 basePath，让请求使用相对路径（通过 Vite 代理）
//       const api = new NavigationControllerApi(undefined, '', apiClient)
//       const response = await api.getNavigationsByType(userType, associatedId)
//       return {
//         success: true,
//         data: response.data.data as MenuItem[], // 假设结构兼容
//         message: response.data.message,
//       }
//     } catch (error) {
//       // 错误已经在 httpClient 中处理并显示
//       throw error
//     }
//   },
// }
