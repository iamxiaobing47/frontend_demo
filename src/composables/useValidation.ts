import { ref } from 'vue';

/**
 * 表单验证错误处理组合式函数
 * 用于将后端返回的验证错误映射到Vuetify组件的error-messages属性
 */
export function useValidation() {
  // 存储字段级验证错误
  const fieldErrors = ref<Record<string, string>>({});
  
  /**
   * 清除所有验证错误
   */
  const clearErrors = () => {
    fieldErrors.value = {};
  };
  
  /**
   * 设置字段验证错误
   * @param errors - 从后端返回的字段错误对象 { fieldName: errorMessageCode }
   */
  const setFieldErrors = (errors: Record<string, string>) => {
    fieldErrors.value = errors;
  };
  
  /**
   * 获取指定字段的错误消息
   * @param fieldName - 字段名
   * @returns 错误消息代码数组（Vuetify的error-messages属性期望数组）
   */
  const getFieldError = (fieldName: string): string[] => {
    const errorCode = fieldErrors.value[fieldName];
    return errorCode ? [errorCode] : [];
  };
  
  /**
   * 检查指定字段是否有错误
   * @param fieldName - 字段名
   * @returns 是否有错误
   */
  const hasFieldError = (fieldName: string): boolean => {
    return !!fieldErrors.value[fieldName];
  };
  
  /**
   * 处理API响应中的验证错误
   * @param response - API响应对象
   * @returns 是否包含验证错误
   */
  const handleValidationResponse = (response: any): boolean => {
    if (response?.success === false && response?.data && typeof response.data === 'object') {
      // 检查是否是字段级验证错误（包含messageCode E010）
      if (response.messageCode === 'E010') {
        setFieldErrors(response.data);
        return true;
      }
    }
    return false;
  };
  
  return {
    fieldErrors,
    clearErrors,
    setFieldErrors,
    getFieldError,
    hasFieldError,
    handleValidationResponse
  };
}