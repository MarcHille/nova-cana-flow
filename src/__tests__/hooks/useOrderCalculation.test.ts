
import { renderHook } from '@testing-library/react';
import { useOrderCalculation } from '@/hooks/useOrderCalculation';
import { CartItem, Product } from '@/types';
import { describe, it, expect } from 'vitest';

describe('useOrderCalculation', () => {
  const mockProducts: Array<CartItem & { product?: Product }> = [
    {
      productId: '1',
      quantity: 2,
      product: {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        shortDescription: 'Short description 1',
        price: 10.00,
        imageUrl: 'image1.jpg',
        category: 'Category 1',
        stock: 5,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01')
      }
    },
    {
      productId: '2',
      quantity: 1,
      product: {
        id: '2',
        name: 'Product 2',
        description: 'Description 2',
        shortDescription: 'Short description 2',
        price: 20.00,
        imageUrl: 'image2.jpg',
        category: 'Category 2',
        stock: 10,
        createdAt: new Date('2021-01-01'),
        updatedAt: new Date('2021-01-01')
      }
    }
  ];

  describe('calculateSubtotal', () => {
    it('should calculate the correct subtotal', () => {
      const { result } = renderHook(() => useOrderCalculation());
      
      const subtotal = result.current.calculateSubtotal(mockProducts);
      
      // Product 1: 10.00 × 2 = 20.00
      // Product 2: 20.00 × 1 = 20.00
      // Total: 40.00
      expect(subtotal).toBe(40);
    });

    it('should handle empty cart', () => {
      const { result } = renderHook(() => useOrderCalculation());
      
      const subtotal = result.current.calculateSubtotal([]);
      
      expect(subtotal).toBe(0);
    });

    it('should handle missing product data', () => {
      const { result } = renderHook(() => useOrderCalculation());
      
      const mockProductsWithMissing: Array<CartItem & { product?: Product }> = [
        {
          productId: '1',
          quantity: 2,
          product: undefined
        },
        ...mockProducts
      ];
      
      const subtotal = result.current.calculateSubtotal(mockProductsWithMissing);
      
      // Should ignore the item with missing product data
      expect(subtotal).toBe(40);
    });
  });

  describe('calculateTax', () => {
    it('should calculate 19% VAT correctly', () => {
      const { result } = renderHook(() => useOrderCalculation());
      
      const tax = result.current.calculateTax(100);
      
      expect(tax).toBe(19);
    });
  });

  describe('prepareOrderItems', () => {
    it('should transform cart products into order items', () => {
      const { result } = renderHook(() => useOrderCalculation());
      
      const orderItems = result.current.prepareOrderItems(mockProducts);
      
      expect(orderItems).toEqual([
        {
          productId: '1',
          name: 'Product 1',
          quantity: 2,
          price: 10.00
        },
        {
          productId: '2',
          name: 'Product 2',
          quantity: 1,
          price: 20.00
        }
      ]);
    });

    it('should throw an error when product data is missing', () => {
      const { result } = renderHook(() => useOrderCalculation());
      
      const mockProductsWithMissing: Array<CartItem & { product?: Product }> = [
        {
          productId: '1',
          quantity: 2,
          product: undefined
        }
      ];
      
      expect(() => {
        result.current.prepareOrderItems(mockProductsWithMissing);
      }).toThrow('Produktdaten fehlen. Bitte laden Sie die Seite neu.');
    });
  });
});
