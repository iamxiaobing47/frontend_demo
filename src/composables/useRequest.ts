import { ref, type Ref } from 'vue'

export function useRequest<T>() {
  const loading = ref(false) as Ref<boolean>
  const data = ref<T>() as Ref<T>
  const error = ref<string>('')

  const execute = async (promise: Promise<T>) => {
    loading.value = true
    error.value = ''
    try {
      const result = await promise
      data.value = result
    } catch (e: any) {
      error.value = e.message || '请求失败'
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    loading.value = false
    data.value = undefined as T
    error.value = ''
  }

  return {
    loading,
    data,
    error,
    execute,
    reset,
  }
}
