
/**
 * Security utilities for input validation and sanitization
 */

/**
 * Validates an email address format
 * @param email The email to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  // Comprehensive email validation pattern
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

/**
 * Sanitizes a string to prevent XSS attacks
 * @param input The string to sanitize
 * @returns Sanitized string
 */
export const sanitizeString = (input: string | undefined): string => {
  if (!input) return '';
  
  return input
    .trim()
    // Replace potentially harmful characters
    .replace(/[<>]/g, '')
    // Limit length to reasonable values
    .substring(0, 500);
};

/**
 * Validates a password for minimum security requirements
 * @param password The password to validate
 * @returns Object with validation result and message
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (!password || password.length < 8) {
    return { valid: false, message: "Passwort muss mindestens 8 Zeichen lang sein" };
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { valid: false, message: "Passwort muss mindestens eine Zahl enthalten" };
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Passwort muss mindestens einen Großbuchstaben enthalten" };
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Passwort muss mindestens einen Kleinbuchstaben enthalten" };
  }
  
  return { valid: true };
};

/**
 * Implements rate limiting for API operations
 * @param key Unique key to identify the operation
 * @param seconds Number of seconds to enforce between operations
 * @returns Object indicating if operation is allowed
 */
export const checkRateLimit = (key: string, seconds: number = 60): { allowed: boolean, waitSeconds?: number } => {
  try {
    const now = Date.now();
    const lastAttempt = localStorage.getItem(`rate_limit_${key}`);
    
    if (lastAttempt) {
      const timeSinceLastAttempt = now - parseInt(lastAttempt, 10);
      const minimumInterval = seconds * 1000;
      
      if (timeSinceLastAttempt < minimumInterval) {
        return {
          allowed: false,
          waitSeconds: Math.ceil((minimumInterval - timeSinceLastAttempt) / 1000)
        };
      }
    }
    
    // Set current timestamp for this operation
    localStorage.setItem(`rate_limit_${key}`, now.toString());
    return { allowed: true };
  } catch (error) {
    // If localStorage fails, default to allowing the operation
    console.error("Rate limit check failed:", error);
    return { allowed: true };
  }
};

/**
 * Safely parses JSON with error handling
 * @param jsonString The JSON string to parse
 * @param fallback Default value to return if parsing fails
 * @returns Parsed object or fallback value
 */
export const safeJsonParse = <T>(jsonString: string, fallback: T): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("JSON parse error:", error);
    return fallback;
  }
};
