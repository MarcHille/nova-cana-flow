
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartItem, Product } from "@/types";
import { useOrderSubmission } from "@/hooks/useOrderSubmission";
import OrderFormContent from "./OrderFormContent";
import EmptyCart from "./EmptyCart";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OrderFormProps {
  cartItems: CartItem[];
  products: Product[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
}

const OrderForm = ({
  cartItems,
  products,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
}: OrderFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    isLoading, 
    formData, 
    handleInputChange, 
    handleSelectChange, 
    copyShippingToBilling,
    handleSubmit,
    formatPrice
  } = useOrderSubmission(cartItems, products, onClearCart, navigate);

  const cartProducts = cartItems.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      ...item,
      product,
    };
  });

  const handleGoToProducts = () => {
    navigate('/products');
  };

  const handleGoBackToCart = () => {
    navigate('/orders/cart');
  };

  if (isLoading) {
    return <LoadingSpinner message="Verarbeite Bestellung..." />;
  }

  if (cartItems.length === 0) {
    // Show a message for empty cart
    toast({
      title: "Leerer Warenkorb",
      description: "Ihr Warenkorb ist leer. Bitte fügen Sie Produkte hinzu, bevor Sie fortfahren.",
    });
    return (
      <>
        <div className="mb-6">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span>Zurück zum Dashboard</span>
          </Link>
        </div>
        <EmptyCart onGoToProducts={handleGoToProducts} />
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <button 
          onClick={handleGoBackToCart}
          className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Zurück zum Warenkorb</span>
        </button>
      </div>
      <OrderFormContent
        cartProducts={cartProducts}
        formData={formData}
        onRemoveItem={onRemoveItem}
        onUpdateQuantity={onUpdateQuantity}
        onClearCart={onClearCart}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        copyShippingToBilling={copyShippingToBilling}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        formatPrice={formatPrice}
      />
    </>
  );
};

export default OrderForm;
