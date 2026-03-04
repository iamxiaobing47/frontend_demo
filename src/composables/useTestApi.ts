import { ref } from 'vue'
import { DefaultApi } from '@/api/generated'

export function useTestApi() {
  const loading = ref(false)
  const result = ref<string>('')
  const error = ref<string>('')

  const testApi = async () => {
    loading.value = true
    error.value = ''
    try {
      const api = new DefaultApi()
      const response = await api.test()
      result.value = response.data.data || ''
    } catch (e) {
      error.value = e instanceof Error ? e.message : '请求失败'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    result,
    error,
    testApi
  }
}
