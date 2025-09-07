
import { Address } from "@/types";

/**
 * Generate order number with pharmacy id prefix for traceability
 * Improved with stronger random component for security
 */
export const generateOrderNumber = (userId: string, timestamp: number): string => {
  // Use a more secure random generation approach
  const randomBytes = new Uint8Array(4);
  window.crypto.getRandomValues(randomBytes);
  const randomPart = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, 4);
    
  const timePart = timestamp.toString().slice(-6);
  const userIdPart = userId.slice(0, 4);
  return `RX-${userIdPart}-${timePart}-${randomPart}`;
};

/**
 * Format price using the German locale with proper escaping
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price);
};

/**
 * Enhanced sanitization to prevent XSS and injection attacks
 * Following OWASP guidelines for input sanitization
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Strip HTML tags and escape special characters
  return input
    .trim()
    .replace(/<\/?[^>]+(>|$)/g, '') // Strip HTML tags
    .replace(/[&<>"'/]/g, char => { // Escape special characters
      switch (char) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#x27;';
        case '/': return '&#x2F;';
        default: return char;
      }
    })
    .substring(0, 255); // Limit length for DB safety
};

/**
 * Create a sanitized address object with additional validation
 */
export const createSanitizedAddress = (
  name: string,
  street: string,
  city: string,
  postalCode: string,
  country: string
): Address => {
  // Validate required fields
  if (!name || !street || !city || !postalCode || !country) {
    throw new Error("Alle Adressfelder müssen ausgefüllt sein");
  }
  
  // Validate postal code format (basic German format check)
  const postalCodeTrimmed = postalCode.trim();
  if (country.toLowerCase().includes("germany") && !/^\d{5}$/.test(postalCodeTrimmed)) {
    throw new Error("Ungültiges Postleitzahl-Format für Deutschland");
  }
  
  return {
    name: sanitizeInput(name),
    street: sanitizeInput(street),
    city: sanitizeInput(city),
    postalCode: sanitizeInput(postalCode),
    country: sanitizeInput(country)
  };
};
