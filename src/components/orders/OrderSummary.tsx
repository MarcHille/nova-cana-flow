
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CartItem, Product } from "@/types";

interface OrderSummaryProps {
  cartProducts: Array<CartItem & { product?: Product }>;
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  formatPrice: (price: number) => string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartProducts,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  formatPrice,
}) => {
  const subtotal = cartProducts.reduce((total, item) => {
    if (!item.product) return total;
    return total + item.product.price * item.quantity;
  }, 0);
  
  const tax = subtotal * 0.19; // 19% VAT
  const total = subtotal + tax;

  return (
    <div className="glass-card p-6 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Cart Items
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClearCart}
          className="text-sm"
        >
          Clear Cart
        </Button>
      </div>
      
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {cartProducts.map((item) => (
          <div key={item.productId} className="py-4 flex flex-col sm:flex-row sm:items-center">
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-medium text-gray-900 dark:text-white truncate">
                {item.product?.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                {formatPrice(item.product?.price || 0)} per unit
              </p>
            </div>
            
            <div className="flex items-center mt-2 sm:mt-0">
              <div className="flex items-center">
                <button
                  type="button"
                  className="p-1 text-gray-600 dark:text-gray-300 hover:text-nova-600 dark:hover:text-nova-400"
                  onClick={() => {
                    if (item.quantity > 1) {
                      onUpdateQuantity(item.productId, item.quantity - 1);
                    }
                  }}
                >
                  -
                </button>
                <span className="mx-2 w-8 text-center">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  className="p-1 text-gray-600 dark:text-gray-300 hover:text-nova-600 dark:hover:text-nova-400"
                  onClick={() => {
                    const maxStock = item.product?.stock || 0;
                    if (item.quantity < maxStock) {
                      onUpdateQuantity(item.productId, item.quantity + 1);
                    }
                  }}
                >
                  +
                </button>
              </div>
              
              <div className="ml-4 min-w-[80px] text-right">
                {formatPrice((item.product?.price || 0) * item.quantity)}
              </div>
              
              <button
                type="button"
                className="ml-4 p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                onClick={() => onRemoveItem(item.productId)}
              >
                <Trash2 size={16} />
                <span className="sr-only">Remove</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {formatPrice(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-600 dark:text-gray-400">VAT (19%)</span>
          <span className="text-gray-900 dark:text-white font-medium">
            {formatPrice(tax)}
          </span>
        </div>
        <div className="flex justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          <span className="text-lg font-medium text-gray-900 dark:text-white">
            Total
          </span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
