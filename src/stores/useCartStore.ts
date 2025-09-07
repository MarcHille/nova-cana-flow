
import { create } from 'zustand';
import { Product } from '@/types';
import { persist } from 'zustand/middleware';

type CartItem = {
  productId: string;
  quantity: number;
  product: Product;
};

type CartStore = {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product: Product, quantity: number) => {
        set((state) => {
          // Check if the product already exists in the cart
          const existingItem = state.items.find(
            (item) => item.productId === product.id
          );
          
          if (existingItem) {
            // Update quantity if item exists
            return {
              items: state.items.map((item) =>
                item.productId === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          } else {
            // Add new item if it doesn't exist
            return {
              items: [
                ...state.items,
                { productId: product.id, quantity, product },
              ],
            };
          }
        });
      },
      
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
