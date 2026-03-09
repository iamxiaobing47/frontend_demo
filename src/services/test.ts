import apiClient from '@/services/httpClient'
import { DefaultApi } from '@/services/generated/api'

// 使用生成的 API 类，但传入自定义的 httpClient
export const testApi = async () => {
  const api = new DefaultApi(undefined, '', apiClient)
  const response = await api.test()

  // 由于 httpClient 已经处理了错误，这里只处理成功情况
  const resultData = response.data.data || ''
  return resultData
}
