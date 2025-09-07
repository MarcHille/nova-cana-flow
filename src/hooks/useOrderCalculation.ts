
import { CartItem, Product, OrderItem } from "@/types";

/**
 * Hook for calculating order totals
 */
export const useOrderCalculation = () => {
  /**
   * Calculate subtotal from cart items
   */
  const calculateSubtotal = (
    cartProducts: Array<CartItem & { product?: Product }>
  ): number => {
    return cartProducts.reduce((total, item) => {
      if (!item.product) return total;
      return total + item.product.price * item.quantity;
    }, 0);
  };

  /**
   * Calculate VAT amount
   */
  const calculateTax = (subtotal: number): number => {
    return subtotal * 0.19; // 19% VAT
  };

  /**
   * Prepare order items from cart products
   */
  const prepareOrderItems = (
    cartProducts: Array<CartItem & { product?: Product }>
  ): OrderItem[] => {
    return cartProducts.map(item => {
      const product = item.product;
      
      if (!product) {
        throw new Error("Produktdaten fehlen. Bitte laden Sie die Seite neu.");
      }
      
      return {
        productId: item.productId,
        name: product.name || 'Unbekanntes Produkt',
        quantity: item.quantity,
        price: product.price || 0,
      };
    });
  };

  return {
    calculateSubtotal,
    calculateTax,
    prepareOrderItems
  };
};
