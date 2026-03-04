import { request } from './api'
import type { ApiResponse } from './api'
import { DefaultApi } from '@/api/generated'

const defaultApi = new DefaultApi()

export const testApi = (): Promise<ApiResponse<string>> => {
  return defaultApi.test() as Promise<ApiResponse<string>>
}
