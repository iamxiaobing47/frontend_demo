import { defineStore } from 'pinia'
import { testApi } from '@/services/test'

export const useIndexStore = defineStore('index', {
  state: () => ({
    loading: false,
    data: undefined as string | undefined,
    error: '',
  }),

  getters: {
    result(): string {
      const val = this.data ?? ''
      return val
    },

    hasError(): boolean {
      return !!this.error
    },
  },

  actions: {
    async fetchTest(): Promise<void> {
      this.loading = true
      this.error = ''
      try {
        const response = await testApi()
        this.data = response
      } catch (e: any) {
        this.error = e.message || '请求失败'
      } finally {
        this.loading = false
      }
    },

    clearResult(): void {
      this.data = undefined
      this.error = ''
    },
  },
})
