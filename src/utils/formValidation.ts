
/**
 * Validates an email address using a regular expression
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates a form input based on type and value
 */
export const validateField = (fieldName: string, value: string): string | null => {
  if (!value.trim()) {
    return `Bitte geben Sie ${fieldName} ein`;
  }
  
  if (fieldName === 'Ihre E-Mail-Adresse' && !validateEmail(value)) {
    return 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
  }
  
  return null;
};
