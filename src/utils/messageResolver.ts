import { messageTexts } from './messageTexts';

/**
 * Resolves a message code to its formatted message text.
 * @param messageCode the message code
 * @param args the arguments to format into the message
 * @returns the formatted message text, or the message code if not found
 */
export function resolveMessage(messageCode: string, ...args: any[]): string {
  const messageText = messageTexts[messageCode];
  if (messageText === undefined) {
    return messageCode; // Return code as fallback
  }
  
  if (args.length === 0) {
    return messageText;
  }
  
  // Format the message with arguments (simple replacement for {0}, {1}, etc.)
  try {
    let result = messageText;
    for (let i = 0; i < args.length; i++) {
      result = result.replace(new RegExp(`\\{${i}\\}`, 'g'), String(args[i] ?? ''));
    }
    return result;
  } catch (e) {
    // If formatting fails, return the raw message text
    return messageText;
  }
}

/**
 * Resolves a message code to its message text without formatting.
 * @param messageCode the message code
 * @returns the message text, or the message code if not found
 */
export function resolveMessageRaw(messageCode: string): string {
  return messageTexts[messageCode] ?? messageCode;
}