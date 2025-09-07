
import { CartItem, Product } from "@/types";
import { sanitizeInput } from "./orderUtils";

/**
 * Validate that the cart has products with enhanced security checks
 */
export const validateCartHasProducts = (
  cartProducts: Array<CartItem & { product?: Product }> 
): boolean => {
  if (!Array.isArray(cartProducts)) {
    return false;
  }
  
  return cartProducts.length > 0 && 
         cartProducts.every(item => 
           item && 
           typeof item.productId === 'string' && 
           typeof item.quantity === 'number' && 
           item.quantity > 0
         );
};

/**
 * Validate that all required form fields are filled and properly sanitized
 * Enhanced with additional security checks
 */
export const validateOrderFormFields = (formData: {
  shippingName: string;
  shippingStreet: string;
  shippingCity: string;
  shippingPostalCode: string;
  billingName: string;
  billingStreet: string;
  billingCity: string;
  billingPostalCode: string;
  paymentMethod?: string;
}): boolean => {
  // Enhanced validation with trimming
  const requiredFields = [
    'shippingName', 'shippingStreet', 'shippingCity', 'shippingPostalCode',
    'billingName', 'billingStreet', 'billingCity', 'billingPostalCode'
  ];
  
  // Check that all required fields exist and are non-empty after sanitization
  for (const field of requiredFields) {
    const value = formData[field as keyof typeof formData];
    
    if (typeof value !== 'string' || sanitizeInput(value).length === 0) {
      return false;
    }
  }
  
  // Validate payment method if present
  if (formData.paymentMethod) {
    const allowedPaymentMethods = ['invoice', 'bank_transfer', 'credit_card'];
    if (!allowedPaymentMethods.includes(formData.paymentMethod)) {
      return false;
    }
  }
  
  return true;
};

/**
 * Validate that checkout is only accessible to authorized pharmacists
 * with proper verification status
 */
export const validateUserCanCheckout = (
  isPharmacist: boolean, 
  isVerified: boolean
): boolean => {
  return isPharmacist && isVerified;
};
