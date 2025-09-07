
import { 
  generateOrderNumber, 
  formatPrice, 
  sanitizeInput, 
  createSanitizedAddress 
} from "@/utils/orderUtils";
import { describe, it, expect } from 'vitest';

describe("Order Utilities", () => {
  describe("generateOrderNumber", () => {
    it("should generate an order number with the correct format", () => {
      const userId = "user123456";
      const timestamp = 1625097600000; // July 1, 2021
      
      const orderNumber = generateOrderNumber(userId, timestamp);
      
      expect(orderNumber).toMatch(/^RX-user-\d{6}-\d{4}$/);
      expect(orderNumber.length).toBe(19); // RX- (3) + user (4) + - (1) + 600000 (6) + - (1) + random (4)
    });
    
    it("should use the first 4 characters of userId", () => {
      const userId = "abcdefgh";
      const timestamp = 1625097600000;
      
      const orderNumber = generateOrderNumber(userId, timestamp);
      
      expect(orderNumber.substring(3, 7)).toBe("abcd");
    });
  });
  
  describe("formatPrice", () => {
    it("should format price in German locale", () => {
      expect(formatPrice(19.99)).toBe("19,99 €");
      expect(formatPrice(1234.56)).toBe("1.234,56 €");
    });
    
    it("should handle zero and negative values", () => {
      expect(formatPrice(0)).toBe("0,00 €");
      expect(formatPrice(-19.99)).toBe("-19,99 €");
    });
  });
  
  describe("sanitizeInput", () => {
    it("should remove HTML tags", () => {
      expect(sanitizeInput("<script>alert('XSS')</script>")).toBe("alert('XSS')");
      expect(sanitizeInput("<b>Bold text</b>")).toBe("Bold text");
    });
    
    it("should trim whitespace", () => {
      expect(sanitizeInput("  test  ")).toBe("test");
    });
    
    it("should limit string length to 255 characters", () => {
      const longInput = "a".repeat(300);
      expect(sanitizeInput(longInput).length).toBe(255);
    });
  });
  
  describe("createSanitizedAddress", () => {
    it("should create an address object with sanitized values", () => {
      const name = "  John <script>Doe</script>  ";
      const street = "<b>123</b> Main St";
      const city = "New York";
      const postalCode = "10001";
      const country = "USA";
      
      const address = createSanitizedAddress(name, street, city, postalCode, country);
      
      expect(address).toEqual({
        name: "John Doe",
        street: "123 Main St",
        city: "New York",
        postalCode: "10001",
        country: "USA"
      });
    });
  });
});
