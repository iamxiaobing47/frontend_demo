import { ref } from 'vue';
import { resolveMessage } from '@/utils/messageResolver';

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
   * @returns 错误消息文本数组（Vuetify的error-messages属性期望数组）
   */
  const getFieldError = (fieldName: string): string[] => {
    const errorCode = fieldErrors.value[fieldName];
    if (errorCode) {
      // 根据字段名和错误代码推断参数
      let args: any[] = [];
      
      if (errorCode === 'E014') {
        // Field {0} cannot be empty
        args = [fieldName];
      } else if (errorCode === 'E015') {
        // Field {0} format error
        args = [fieldName];
      } else if (errorCode === 'E016') {
        // Field {0} length must be between {1} and {2}
        // 对于常见字段，我们可以预设合理的默认值
        if (fieldName === 'password') {
          args = [fieldName, 8, 20]; // 假设密码长度要求是8-20
        } else if (fieldName === 'username') {
          args = [fieldName, 3, 20]; // 假设用户名长度要求是3-20
        } else if (fieldName === 'email') {
          args = [fieldName, 5, 100]; // 假设邮箱长度要求是5-100
        } else {
          args = [fieldName, 1, 255]; // 默认值
        }
      } else if (errorCode === 'E017') {
        // Field {0} must be greater than {1}
        if (fieldName === 'age') {
          args = [fieldName, 0];
        } else {
          args = [fieldName, 0];
        }
      } else if (errorCode === 'E018') {
        // Field {0} must be less than {1}
        if (fieldName === 'age') {
          args = [fieldName, 150];
        } else {
          args = [fieldName, 999999];
        }
      } else if (errorCode.startsWith('E01')) {
        // 其他字段级错误，至少传入字段名
        args = [fieldName];
      }
      
      const message = resolveMessage(errorCode, ...args);
      return [message];
    }
    return [];
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