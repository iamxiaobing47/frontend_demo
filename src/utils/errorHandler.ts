import { resolveMessage } from '@/utils/messageResolver';
import { useValidation } from '@/composables/useValidation';

/**
 * 显示错误消息的通用函数
 * @param messageCode - 错误代码
 * @param args - 消息参数
 * @returns 格式化后的错误消息
 */
export function getErrorMessage(messageCode: string, ...args: any[]): string {
  return resolveMessage(messageCode, ...args);
}

/**
 * 处理API响应错误并返回可显示的消息
 * @param response - API响应对象
 * @returns 错误消息，如果无错误则返回null
 */
export function handleApiResponseError(response: any): string | null {
  if (response?.success === false) {
    if (response.message) {
      // 如果后端已经提供了完整的消息文本
      return response.message;
    } else if (response.messageCode) {
      // 如果只有消息代码，解析它
      const args = response.messageArgs || [];
      return resolveMessage(response.messageCode, ...args);
    }
  }
  return null;
}

/**
 * 在Vuetify组件中显示错误消息的辅助函数
 * @param fieldName - 字段名称
 * @param fieldErrors - 字段错误映射 { fieldName: errorCode }
 * @returns 错误消息数组
 */
export function getFieldErrorMessage(fieldName: string, fieldErrors: Record<string, string>): string[] {
  const errorCode = fieldErrors[fieldName];
  if (errorCode) {
    // 对于字段级验证错误，通常需要将字段名作为参数
    if (errorCode.startsWith('E01')) {
      return [resolveMessage(errorCode, fieldName)];
    } else {
      return [resolveMessage(errorCode)];
    }
  }
  return [];
}