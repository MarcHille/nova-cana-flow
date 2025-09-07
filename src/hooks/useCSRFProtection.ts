
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for implementing CSRF protection in forms
 * Generates and validates CSRF tokens for form submissions
 */
export function useCSRFProtection() {
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  
  // Generate a new CSRF token
  const generateToken = useCallback(() => {
    const newToken = generateRandomToken();
    setCsrfToken(newToken);
    // Store in sessionStorage for verification
    try {
      sessionStorage.setItem('csrf_token', newToken);
      setIsTokenValid(true);
    } catch (error) {
      console.error('Could not store CSRF token:', error);
      setIsTokenValid(false);
    }
    return newToken;
  }, []);
  
  // Validate a CSRF token against the stored one
  const validateToken = useCallback((token: string): boolean => {
    try {
      const storedToken = sessionStorage.getItem('csrf_token');
      const isValid = storedToken === token && !!token;
      setIsTokenValid(isValid);
      return isValid;
    } catch (error) {
      console.error('Could not validate CSRF token:', error);
      setIsTokenValid(false);
      return false;
    }
  }, []);
  
  // Clear the CSRF token (e.g., after form submission)
  const clearToken = useCallback(() => {
    try {
      sessionStorage.removeItem('csrf_token');
      setCsrfToken('');
      setIsTokenValid(false);
    } catch (error) {
      console.error('Could not clear CSRF token:', error);
    }
  }, []);
  
  // Generate a random token for CSRF protection
  const generateRandomToken = (): string => {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  };
  
  // Initialize token on mount
  useEffect(() => {
    // Check if there's an existing token
    try {
      const storedToken = sessionStorage.getItem('csrf_token');
      if (storedToken) {
        setCsrfToken(storedToken);
        setIsTokenValid(true);
      } else {
        // Generate a new token if none exists
        generateToken();
      }
    } catch (error) {
      console.error('Could not access sessionStorage for CSRF token:', error);
      // Try to generate a token anyway
      generateToken();
    }
  }, [generateToken]);
  
  return {
    csrfToken,
    isTokenValid,
    generateToken,
    validateToken,
    clearToken
  };
}
