import { NavigationControllerApi } from "./generated/api";
import { MenuItem } from "@/stores/menuStore";

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}

const navigationApi = new NavigationControllerApi();

export const menuService = {
  /**
   * 获取用户特定的菜单
   */
  getUserMenus: async (): Promise<ApiResponse<MenuItem[]>> => {
    try {
      const response = await navigationApi.getUserNavigations();
      // 将NavigationDto转换为MenuItem格式
      return {
        success: response.data.success || false,
        data: response.data.data as MenuItem[], // 假设结构兼容
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching user menus:", error);
      throw error;
    }
  },

  /**
   * 获取所有可用菜单（用于超级用户，如据点X）
   */
  getAllMenus: async (): Promise<ApiResponse<MenuItem[]>> => {
    try {
      const response = await navigationApi.getAllNavigations();
      return {
        success: response.data.success || false,
        data: response.data.data as MenuItem[], // 假设结构兼容
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching all menus:", error);
      throw error;
    }
  },

  /**
   * 根据用户类型和关联ID获取菜单
   */
  getMenusByUserType: async (
    userType: "employee" | "business_owner",
    associatedId?: string,
  ): Promise<ApiResponse<MenuItem[]>> => {
    try {
      const response = await navigationApi.getNavigationsByType(
        userType,
        associatedId,
      );
      return {
        success: response.data.success || false,
        data: response.data.data as MenuItem[], // 假设结构兼容
        message: response.data.message,
      };
    } catch (error) {
      console.error("Error fetching menus by user type:", error);
      throw error;
    }
  },
};
