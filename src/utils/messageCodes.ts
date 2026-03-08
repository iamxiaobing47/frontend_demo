// Message code constants organized by category:
// - E: Error (system errors, validation failures, authentication issues)
// - W: Warning (potential issues, data conflicts, retry scenarios)  
// - N: Notification (success messages, informational updates)
// - M: Message (general messages that don't fit other categories)
//
// Format: [Category][3-digit number] (e.g., E001, W001, N001, M001)

// ==================== Authentication & Authorization ====================
export const E001 = "E001"; // Username or password incorrect
export const E002 = "E002"; // User account locked
export const E003 = "E003"; // Authentication failed
export const E004 = "E004"; // Password verification failed
export const E005 = "E005"; // Password expired
export const E006 = "E006"; // Invalid refresh token
export const E007 = "E007"; // Not authenticated, please login first
export const E008 = "E008"; // Not authorized, please contact administrator

// ==================== Validation Errors ====================
export const E010 = "E010"; // Parameter error
export const E011 = "E011"; // Required field missing
export const E012 = "E012"; // Format error
export const E013 = "E013"; // Data duplicate
export const E014 = "E014"; // Field {0} cannot be empty
export const E015 = "E015"; // Field {0} format error
export const E016 = "E016"; // Field {0} length must be between {1} and {2}
export const E017 = "E017"; // Field {0} must be greater than {1}
export const E018 = "E018"; // Field {0} must be less than {1}

// ==================== Resource Errors ====================
export const E020 = "E020"; // Resource not found
export const E021 = "E021"; // {0} not found
export const E022 = "E022"; // {0} already exists
export const E023 = "E023"; // {0} conflicts with {1}

// ==================== Business Logic Errors ====================
export const E030 = "E030"; // Permission denied
export const E031 = "E031"; // User {0} permission denied
export const E032 = "E032"; // User {0} session expired
export const E033 = "E033"; // Session expired
export const E034 = "E034"; // Forbidden access
export const E035 = "E035"; // Bad request

// ==================== Operation Errors ====================
export const E040 = "E040"; // Create failed
export const E041 = "E041"; // Update failed  
export const E042 = "E042"; // Delete failed
export const E043 = "E043"; // {0} create failed
export const E044 = "E044"; // {0} update failed
export const E045 = "E045"; // {0} delete failed

// ==================== Data Processing Errors ====================
export const E050 = "E050"; // Data processing failed
export const E051 = "E051"; // Data conflict
export const E052 = "E052"; // Processing timeout

// ==================== System Errors ====================
export const E060 = "E060"; // System maintenance
export const E061 = "E061"; // Service unavailable
export const E062 = "E062"; // Network error
export const E999 = "E999"; // System exception, please contact administrator