import { ref } from 'vue'
import { resolveMessage } from '@/utils/messageResolver'

// 1. 表单验证错误处理组合式函数，用于将后端验证错误映射到Vuetify组件
export function useValidation() {
  // 2. 存储字段级验证错误状态
  const fieldErrors = ref<Record<string, string>>({})

  // 3. 清除所有验证错误
  const clearErrors = () => {
    fieldErrors.value = {}
  }

  // 4. 设置字段验证错误
  const setFieldErrors = (errors: Record<string, string>) => {
    fieldErrors.value = errors
  }

  // 5. 获取指定字段的格式化错误消息
  const getFieldError = (fieldName: string): string[] => {
    const errorCode = fieldErrors.value[fieldName]
    if (errorCode) {
      let args: any[] = []

      if (errorCode === 'E014') {
        args = [fieldName]
      } else if (errorCode === 'E015') {
        args = [fieldName]
      } else if (errorCode === 'E016') {
        if (fieldName === 'password') {
          args = [fieldName, 8, 20]
        } else if (fieldName === 'username') {
          args = [fieldName, 3, 20]
        } else if (fieldName === 'email') {
          args = [fieldName, 5, 100]
        } else {
          args = [fieldName, 1, 255]
        }
      } else if (errorCode === 'E017') {
        if (fieldName === 'age') {
          args = [fieldName, 0]
        } else {
          args = [fieldName, 0]
        }
      } else if (errorCode === 'E018') {
        if (fieldName === 'age') {
          args = [fieldName, 150]
        } else {
          args = [fieldName, 999999]
        }
      } else if (errorCode.startsWith('E01')) {
        args = [fieldName]
      }

      const message = resolveMessage(errorCode, ...args)
      return [message]
    }
    return []
  }

  // 6. 检查指定字段是否有验证错误
  const hasFieldError = (fieldName: string): boolean => {
    return !!fieldErrors.value[fieldName]
  }

  // 7. 处理API响应中的验证错误
  const handleValidationResponse = (response: any): boolean => {
    if (response?.success === false && response?.data && typeof response.data === 'object') {
      if (response.messageCode === 'E010') {
        setFieldErrors(response.data)
        return true
      }
    }
    return false
  }

  return {
    fieldErrors,
    clearErrors,
    setFieldErrors,
    getFieldError,
    hasFieldError,
    handleValidationResponse,
  }
}
