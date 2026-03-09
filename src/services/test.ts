import apiClient from '@/services/httpClient'
import { DefaultApi } from '@/services/generated/api'

// 使用生成的 API 类，但传入自定义的 httpClient
export const testApi = async () => {
  const api = new DefaultApi(undefined, '', apiClient)
  const response = await api.test()

  // 检查响应是否成功
  if (!response.data.success) {
    throw new Error(response.data.message || '请求失败')
  }

  const resultData = response.data.data || ''
  return resultData
}
