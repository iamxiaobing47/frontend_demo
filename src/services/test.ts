import { DefaultApi, Configuration } from "@/api/generated";
import apiClient from "@/services/api";

// 由于生成的 API 可能不包含我们的拦截器，
// 我们直接使用我们的 apiClient

export const testApi = async () => {
  const response = await apiClient.get("/test");
  
  console.log("Test API response:", response.data);
  
  // 检查响应是否成功
  if (!response.data.success) {
    throw new Error(response.data.message || "请求失败");
  }
  
  const resultData = response.data.data || "";
  console.log("Test API returning:", resultData);
  return resultData;
};
