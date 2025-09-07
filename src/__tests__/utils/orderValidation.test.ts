
import { validateCartHasProducts, validateOrderFormFields, validateUserCanCheckout } from "@/utils/orderValidation";
import { CartItem, Product } from "@/types";
import { describe, it, expect } from 'vitest';

describe("Order Validation Utilities", () => {
  describe("validateCartHasProducts", () => {
    it("should return true when cart has valid products", () => {
      const cartProducts: Array<CartItem & { product?: Product }> = [
        {
          productId: "1",
          quantity: 2,
          product: {
            id: "1",
            name: "Test Product",
            description: "Test Description",
            shortDescription: "Short",
            price: 19.99,
            imageUrl: "test.jpg",
            category: "Test",
            stock: 10,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      ];
      
      expect(validateCartHasProducts(cartProducts)).toBe(true);
    });
    
    it("should return false when cart is empty", () => {
      const cartProducts: Array<CartItem & { product?: Product }> = [];
      
      expect(validateCartHasProducts(cartProducts)).toBe(false);
    });
    
    it("should return false for invalid cart data", () => {
      // @ts-ignore - Testing invalid input
      const invalidCart = null;
      expect(validateCartHasProducts(invalidCart)).toBe(false);
      
      // Testing invalid items with proper type casting
      const invalidCartItems = [{ invalid: "data" }] as unknown as Array<CartItem & { product?: Product }>;
      expect(validateCartHasProducts(invalidCartItems)).toBe(false);
      
      // Testing negative quantity
      const negativeQuantity: Array<CartItem & { product?: Product }> = [{
        productId: "1",
        quantity: -1
      }];
      expect(validateCartHasProducts(negativeQuantity)).toBe(false);
    });
  });
  
  describe("validateOrderFormFields", () => {
    it("should return true when all required fields are filled", () => {
      const formData = {
        shippingName: "John Doe",
        shippingStreet: "123 Street",
        shippingCity: "City",
        shippingPostalCode: "12345",
        billingName: "John Doe",
        billingStreet: "123 Street",
        billingCity: "City",
        billingPostalCode: "12345"
      };
      
      expect(validateOrderFormFields(formData)).toBe(true);
    });
    
    it("should return false when shipping fields are missing", () => {
      const formData = {
        shippingName: "",
        shippingStreet: "123 Street",
        shippingCity: "City",
        shippingPostalCode: "12345",
        billingName: "John Doe",
        billingStreet: "123 Street",
        billingCity: "City",
        billingPostalCode: "12345"
      };
      
      expect(validateOrderFormFields(formData)).toBe(false);
    });
    
    it("should return false when billing fields are missing", () => {
      const formData = {
        shippingName: "John Doe",
        shippingStreet: "123 Street",
        shippingCity: "City",
        shippingPostalCode: "12345",
        billingName: "John Doe",
        billingStreet: "",
        billingCity: "City",
        billingPostalCode: "12345"
      };
      
      expect(validateOrderFormFields(formData)).toBe(false);
    });
    
    it("should return false with invalid payment method", () => {
      const formData = {
        shippingName: "John Doe",
        shippingStreet: "123 Street",
        shippingCity: "City",
        shippingPostalCode: "12345",
        billingName: "John Doe",
        billingStreet: "123 Street",
        billingCity: "City",
        billingPostalCode: "12345",
        paymentMethod: "invalid_method"
      };
      
      expect(validateOrderFormFields(formData)).toBe(false);
    });
  });
  
  describe("validateUserCanCheckout", () => {
    it("should return true for verified pharmacists", () => {
      expect(validateUserCanCheckout(true, true)).toBe(true);
    });
    
    it("should return false for unverified pharmacists", () => {
      expect(validateUserCanCheckout(true, false)).toBe(false);
    });
    
    it("should return false for non-pharmacists", () => {
      expect(validateUserCanCheckout(false, true)).toBe(false);
      expect(validateUserCanCheckout(false, false)).toBe(false);
    });
  });
});
