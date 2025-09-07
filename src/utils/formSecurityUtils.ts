
import { sanitizeString } from './securityUtils';

/**
 * Validates a form submission with CSRF token
 * @param formData The form data to validate
 * @param csrfToken The current CSRF token
 * @param expectedToken The expected CSRF token (from state)
 */
export const validateFormSubmission = (
  formData: Record<string, unknown>,
  csrfToken: string,
  expectedToken: string
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check CSRF token
  if (!csrfToken || csrfToken !== expectedToken) {
    errors.push('Invalid security token. Please refresh the page and try again.');
  }
  
  // Check for required fields (can be customized per form)
  if (formData.requiredFields && Array.isArray(formData.requiredFields)) {
    const requiredFields = formData.requiredFields as string[];
    for (const field of requiredFields) {
      if (!formData[field] || (typeof formData[field] === 'string' && (formData[field] as string).trim() === '')) {
        errors.push(`${field} is required.`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Sanitizes all string values in a form submission
 * @param formData The form data to sanitize
 * @returns Sanitized form data
 */
export const sanitizeFormData = (
  formData: Record<string, unknown>
): Record<string, unknown> => {
  const sanitizedData: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(formData)) {
    if (typeof value === 'string') {
      sanitizedData[key] = sanitizeString(value);
    } else {
      sanitizedData[key] = value;
    }
  }
  
  return sanitizedData;
};

/**
 * Adds CSRF token to form data
 * @param formData The original form data
 * @param csrfToken The CSRF token to add
 * @returns Form data with CSRF token included
 */
export const addCSRFToken = (
  formData: Record<string, unknown>,
  csrfToken: string
): Record<string, unknown> => {
  return {
    ...formData,
    csrf_token: csrfToken
  };
};
