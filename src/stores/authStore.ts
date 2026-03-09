import { defineStore } from "pinia";
import apiClient from "@/services/api";
import { useMenuStore } from "@/stores/menuStore";

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
    async login(email: string, password: string): Promise<boolean> {
      try {
        const response = await apiClient.post("/auth/login", {
          email,
          password,
        });

        if (response.data.success && response.data.data?.accessToken) {
          const loginData = response.data.data;
          const accessToken = loginData.accessToken;
          const username = loginData.username;
          const userRole = loginData.role || "employee"; // Default to employee if not provided
          const businessOwnerId = loginData.businessOwnerId;
          const locationId = loginData.locationId;

          // 存储accessToken到localStorage
          this.token = accessToken;
          localStorage.setItem("accessToken", accessToken);

          // 存储用户信息到localStorage
          const user: UserInfo = {
            username,
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

          return true;
        }
        return false;
      } catch (error) {
        console.error("Login failed:", error);
        return false;
      }
    },

    async logout(): Promise<void> {
      try {
        // 调用后端登出接口
        await apiClient.post("/auth/logout");
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
        const response = await apiClient.post("/auth/refresh", {});

        if (response.data.success && response.data.data?.accessToken) {
          const accessToken = response.data.data.accessToken;
          const username = response.data.data.username;

          // 更新accessToken
          this.token = accessToken;
          localStorage.setItem("accessToken", accessToken);

          // 更新用户信息（如果需要）
          if (this.userInfo) {
            const updatedUser: UserInfo = { ...this.userInfo, username };
            this.userInfo = updatedUser;
            localStorage.setItem("userInfo", JSON.stringify(updatedUser));
          }

          this.isRefreshing = false;
          return true;
        }
        this.isRefreshing = false;
        return false;
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
