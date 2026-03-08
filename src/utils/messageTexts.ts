// Message text mappings for all message codes.

export const messageTexts: Record<string, string> = {
  // ==================== Authentication & Authorization ====================
  "E001": "Username or password incorrect",
  "E002": "User account locked",
  "E003": "Authentication failed",
  "E004": "Password verification failed",
  "E005": "Password expired",
  "E006": "Invalid refresh token",
  "E007": "Not authenticated, please login first",
  "E008": "Not authorized, please contact administrator",

  // ==================== Validation Errors ====================
  "E010": "Parameter error",
  "E011": "Required field missing",
  "E012": "Format error",
  "E013": "Data duplicate",
  "E014": "Field {0} cannot be empty",
  "E015": "Field {0} format error",
  "E016": "Field {0} length must be between {1} and {2}",
  "E017": "Field {0} must be greater than {1}",
  "E018": "Field {0} must be less than {1}",

  // ==================== Resource Errors ====================
  "E020": "Resource not found",
  "E021": "{0} not found",
  "E022": "{0} already exists",
  "E023": "{0} conflicts with {1}",

  // ==================== Business Logic Errors ====================
  "E030": "Permission denied",
  "E031": "User {0} permission denied",
  "E032": "User {0} session expired",
  "E033": "Session expired",
  "E034": "Forbidden access",
  "E035": "Bad request",

  // ==================== Operation Errors ====================
  "E040": "Create failed",
  "E041": "Update failed",
  "E042": "Delete failed",
  "E043": "{0} create failed",
  "E044": "{0} update failed",
  "E045": "{0} delete failed",

  // ==================== Data Processing Errors ====================
  "E050": "Data processing failed",
  "E051": "Data conflict",
  "E052": "Processing timeout",

  // ==================== System Errors ====================
  "E060": "System maintenance",
  "E061": "Service unavailable",
  "E062": "Network error",
  "E999": "System exception, please contact administrator",
};

/**
 * Gets the message text for a given message code.
 * @param code the message code
 * @returns the message text, or undefined if not found
 */
export function getMessageText(code: string): string | undefined {
  return messageTexts[code];
}

/**
 * Gets the message text for a given message code, with a default fallback.
 * @param code the message code
 * @param defaultText the default text to return if code is not found
 * @returns the message text, or the default text if not found
 */
export function getMessageTextWithDefault(code: string, defaultText: string): string {
  return messageTexts[code] ?? defaultText;
}