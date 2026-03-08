import { defineStore } from "pinia";
import { ref } from "vue";
import apiClient from "@/services/api";

interface UserInfo {
  username: string;
  email: string;
}

export const useAuthStore = defineStore("auth", () => {
  // 从localStorage获取accessToken
  const token = ref<string | null>(localStorage.getItem("accessToken") || null);
  // 从localStorage获取用户信息
  const userInfo = ref<UserInfo | null>(JSON.parse(localStorage.getItem("userInfo") || "null"));

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password
      });
      
      if (response.data.success && response.data.data?.accessToken) {
        const accessToken = response.data.data.accessToken;
        const username = response.data.data.username;
        
        // 存储accessToken到localStorage
        token.value = accessToken;
        localStorage.setItem("accessToken", accessToken);
        
        // 存储用户信息到localStorage
        const user: UserInfo = { username, email };
        userInfo.value = user;
        localStorage.setItem("userInfo", JSON.stringify(user));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // 调用后端登出接口
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // 清除本地存储
      token.value = null;
      userInfo.value = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userInfo");
    }
  };

  const isAuthenticated = () => !!token.value;

  // 刷新token
  const refreshToken = async () => {
    try {
      // 从cookie中获取refreshToken（浏览器自动处理）
      const response = await apiClient.post("/auth/refresh", {});
      
      if (response.data.success && response.data.data?.accessToken) {
        const accessToken = response.data.data.accessToken;
        const username = response.data.data.username;
        
        // 更新accessToken
        token.value = accessToken;
        localStorage.setItem("accessToken", accessToken);
        
        // 更新用户信息（如果需要）
        if (userInfo.value) {
          const updatedUser: UserInfo = { ...userInfo.value, username };
          userInfo.value = updatedUser;
          localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Refresh token failed:", error);
      // 如果刷新失败，清除所有认证信息
      logout();
      return false;
    }
  };

  return {
    token,
    userInfo,
    login,
    logout,
    refreshToken,
    isAuthenticated,
  };
});
