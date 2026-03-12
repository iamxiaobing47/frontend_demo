import { messageTexts } from './messageTexts'

// 1. 根据消息代码和参数解析格式化消息文本
export function resolveMessage(messageCode: string, ...args: any[]): string {
  const messageText = messageTexts[messageCode]
  if (messageText === undefined) {
    return messageCode
  }

  if (args.length === 0) {
    return messageText
  }

  try {
    let result = messageText
    for (let i = 0; i < args.length; i++) {
      result = result.replace(new RegExp(`\\{${i}\\}`, 'g'), String(args[i] ?? ''))
    }
    return result
  } catch (e) {
    return messageText
  }
}

// 2. 解析消息代码对应的原始消息文本（不进行参数格式化）
export function resolveMessageRaw(messageCode: string): string {
  return messageTexts[messageCode] ?? messageCode
}
