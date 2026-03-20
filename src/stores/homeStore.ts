import { defineStore } from 'pinia'
import apiClient from '@/services/httpClient'
import { DefaultApi } from '@/services/generated/api'

// 1. 首页测试API存储，管理测试API调用的状态和结果
export const useHomeStore = defineStore('home', {
  state: () => ({
    // 2. API调用加载状态
    loading: false,
    // 3. API返回的数据
    data: undefined as string | undefined,
    // 4. 错误消息
    error: '',
  }),

  getters: {
    // 5. 获取测试结果，如果无数据则返回空字符串
    result(): string {
      const val = this.data ?? ''
      return val
    },

    // 6. 检查是否存在错误
    hasError(): boolean {
      return !!this.error
    },
  },

  actions: {
    // 7. 调用测试API并处理响应
    async fetchTest(): Promise<void> {
      this.loading = true
      this.error = ''
      try {
        const api = new DefaultApi(undefined, '', apiClient)
        const response = await api.test()
        this.data = response.data.data || ''
      } catch (e: any) {
        this.error = e.message || '请求失败'
      } finally {
        this.loading = false
      }
    },

    // 8. 清除测试结果和错误消息
    clearResult(): void {
      this.data = undefined
      this.error = ''
    },
  },
})
