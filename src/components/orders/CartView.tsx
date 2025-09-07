
import React from "react";
import { CartItem, Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import CartTable from "./CartTable";
import CartSummary from "./CartSummary";
import CartActions from "./CartActions";

interface CartViewProps {
  cartItems: CartItem[];
  products: Product[];
  handleRemoveItem: (productId: string) => void;
  handleUpdateQuantity: (productId: string, quantity: number) => void;
  handleClearCart: () => void;
  getCartTotal: () => number;
  formatCurrency: (amount: number) => string;
  goToCheckout: () => void;
}

const CartView: React.FC<CartViewProps> = ({
  cartItems,
  products,
  handleRemoveItem,
  handleUpdateQuantity,
  handleClearCart,
  getCartTotal,
  formatCurrency,
  goToCheckout,
}) => {
  const cartProducts = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      product,
    };
  });

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Link 
          to="/dashboard" 
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Zurück zum Dashboard</span>
        </Link>
      </div>
      
      <CartTable
        cartProducts={cartProducts}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity}
      />
      
      <CartSummary totalAmount={getCartTotal()} formatCurrency={formatCurrency} />
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <CartActions 
          onContinueShopping={() => window.location.href = '/products'}
          onProceedToCheckout={goToCheckout}
          onClearCart={handleClearCart}
        />
      </div>
    </div>
  );
};

export default CartView;
