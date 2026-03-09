import { defineStore } from "pinia";
import { DefaultApi, LoginRequest } from "@/services/generated/api";
import { useMenuStore } from "@/stores/menuStore";

// 创建API实例
const api = new DefaultApi();

interface UserInfo {
  username: string;
  email: string;
  role: "employee" | "business_owner";
  businessOwnerId?: string;
  locationId?: string;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    // 清理可能的旧 token
    token: (() => {
      if (localStorage.getItem("mocktoken")) {
        localStorage.removeItem("mocktoken");
      }
      return localStorage.getItem("accessToken") || null;
    })(),
    userInfo: JSON.parse(
      localStorage.getItem("userInfo") || "null",
    ) as UserInfo | null,
    isRefreshing: false,
  }),

  getters: {
    isAuthenticated(): boolean {
      return !!this.token;
    },
  },

  actions: {
    async login(
      email: string,
      password: string,
    ): Promise<{ success: boolean; message?: string }> {
      try {
        const loginRequest: LoginRequest = {
          email,
          password,
        };

        const response = await api.login(loginRequest);

        if (response.data.success && response.data.data?.accessToken) {
          const loginData = response.data.data;
          const accessToken = loginData.accessToken;
          const username = loginData.username || email.split("@")[0]; // 如果后端没有返回用户名，使用邮箱前缀

          // 注意：LoginResponse中没有role, businessOwnerId, locationId字段
          // 这些信息可能需要通过其他API获取，暂时设置默认值
          const userRole = "employee"; // 默认角色
          const businessOwnerId = undefined; // 从其他API获取
          const locationId = undefined; // 从其他API获取

          // 存储accessToken到localStorage
          this.token = accessToken || null;
          localStorage.setItem("accessToken", accessToken || "");

          // 存储用户信息到localStorage
          const user: UserInfo = {
            username: username || email.split("@")[0],
            email,
            role: userRole,
            businessOwnerId,
            locationId,
          };
          this.userInfo = user;
          localStorage.setItem("userInfo", JSON.stringify(user));

          // Set user role in menu store and fetch user-specific menus
          const menuStore = useMenuStore();
          menuStore.setUserRole(userRole, businessOwnerId, locationId);

          // Fetch user-specific menus after successful login
          await menuStore.fetchUserMenus();

          // Update router with user-specific routes
          const { generateRoutesFromMenus } = await import("@/router");
          generateRoutesFromMenus(menuStore.menus);

          return { success: true };
        }

        // 如果响应中有错误消息，则返回该消息
        if (response.data.messageCode) {
          return { success: false, message: response.data.messageCode };
        } else {
          return { success: false, message: "登录失败" };
        }

        // 如果响应中有错误消息，则返回该消息
        if (response.data.messageCode) {
          return { success: false, message: response.data.messageCode };
        } else {
          return { success: false, message: "登录失败" };
        }
      } catch (error: any) {
        console.error("Login failed:", error);

        // 处理网络错误或其他异常
        if (error.response?.data?.message) {
          return { success: false, message: error.response.data.message };
        } else if (error.response?.data?.messageCode) {
          return { success: false, message: error.response.data.messageCode };
        } else if (error.code === "NETWORK_ERROR") {
          return { success: false, message: "网络连接错误" };
        } else {
          return { success: false, message: "登录失败，请稍后重试" };
        }
      }
    },

    async logout(): Promise<void> {
      try {
        // 调用后端登出接口
        await api.logout();
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        // 清除本地存储
        this.token = null;
        this.userInfo = null;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
      }
    },

    async refreshToken(): Promise<boolean> {
      if (this.isRefreshing) {
        // 如果已经在刷新，等待完成
        return new Promise<boolean>((resolve) => {
          const checkRefresh = () => {
            if (!this.isRefreshing) {
              resolve(!!this.token);
            } else {
              setTimeout(checkRefresh, 100);
            }
          };
          checkRefresh();
        });
      }

      this.isRefreshing = true;
      try {
        // 从cookie中获取refreshToken（浏览器自动处理）
        // 注意：这里需要从localStorage中获取refreshToken或者从其他方式获取
        // 因为我们使用的是DefaultApi，需要根据实际API设计来实现
        // 目前先留空实现，因为可能需要额外的refreshToken信息
        console.warn(
          "Refresh token functionality may need additional implementation",
        );
        this.isRefreshing = false;
        return false; // 暂时返回false，因为缺少refreshToken信息
      } catch (error) {
        console.error("Refresh token failed:", error);
        // 如果刷新失败，清除所有认证信息
        this.logout();
        this.isRefreshing = false;
        return false;
      }
    },

    async checkAndRefreshToken(): Promise<boolean> {
      if (!this.token) {
        return false;
      }

      // 这里可以添加JWT过期检查逻辑
      // 简单起见，我们直接尝试刷新或保持当前状态
      return true;
    },
  },
});
