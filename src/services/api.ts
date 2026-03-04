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
});

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  messageCode?: string;
  messageArgs?: string[];
}

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
    const authStore = useAuthStore();
    if (error.response?.status === 401) {
      authStore.logout();
      window.location.href = "/login";
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
