import { defineStore } from 'pinia'
import apiClient from '@/services/httpClient'
import { DefaultApi } from '@/services/generated/api'

/**
 * 首页测试API存储
 * 管理测试API调用的状态和结果
 */
export const useHomeStore = defineStore('home', {
  state: () => ({
    /** API调用加载状态 */
    loading: false,
    /** API返回的数据 */
    data: undefined as string | undefined,
    /** 错误消息 */
    error: '',
  }),

  getters: {
    /** 获取测试结果，如果无数据则返回空字符串 */
    result(): string {
      const val = this.data ?? ''
      return val
    },

    /** 检查是否存在错误 */
    hasError(): boolean {
      return !!this.error
    },
  },

  actions: {
    /**
     * 调用测试API
     * - 使用生成的 API 类和自定义 httpClient
     * - 错误由 httpClient 拦截器统一处理
     * - 成功时存储返回的数据
     */
    async fetchTest(): Promise<void> {
      this.loading = true
      this.error = ''
      try {
        // 使用生成的 API 类，传入自定义的 httpClient
        const api = new DefaultApi(undefined, '', apiClient)
        const response = await api.test()

        // httpClient 已经处理了错误，这里只处理成功情况
        this.data = response.data.data || ''
      } catch (e: any) {
        this.error = e.message || '请求失败'
      } finally {
        this.loading = false
      }
    },

    /** 清除测试结果和错误消息 */
    clearResult(): void {
      this.data = undefined
      this.error = ''
    },
  },
})
