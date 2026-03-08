import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { useAuthStore } from "@/stores/auth";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

const apiClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 确保发送cookie
});

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  messageCode?: string;
  messageArgs?: string[];
  message?: string;
}

// 标记正在刷新token的promise，避免重复刷新
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // 如果已经在刷新，将请求加入队列
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const authStore = useAuthStore();
        const newToken = await authStore.refreshToken();
        
        if (newToken && authStore.token) {
          // 刷新成功，更新原请求的token
          originalRequest.headers.Authorization = `Bearer ${authStore.token}`;
          processQueue(null, authStore.token);
          return apiClient(originalRequest);
        } else {
          // 刷新失败，跳转到登录页
          authStore.logout();
          window.location.href = "/login-index";
          processQueue(new Error("Token refresh failed"));
          return Promise.reject(error);
        }
      } catch (refreshError) {
        authStore.logout();
        window.location.href = "/login-index";
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  },
);

export const request = async <T = any>(
  config: AxiosRequestConfig,
): Promise<ApiResponse<T>> => {
  const response = await apiClient.request<ApiResponse<T>>(config);
  return response.data;
};

export default apiClient;
