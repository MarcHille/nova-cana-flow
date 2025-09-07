
import React from "react";
import { CartItem, Product } from "@/types";
import OrderSummary from "./OrderSummary";
import AddressForm from "./AddressForm";
import OrderNotes from "./OrderNotes";
import LoadingButton from "@/components/ui/loading-button";

interface OrderFormContentProps {
  cartProducts: Array<CartItem & { product?: Product }>;
  formData: {
    shippingName: string;
    shippingStreet: string;
    shippingCity: string;
    shippingPostalCode: string;
    shippingCountry: string;
    billingName: string;
    billingStreet: string;
    billingCity: string;
    billingPostalCode: string;
    billingCountry: string;
    paymentMethod: string;
    notes: string;
  };
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string) => (value: string) => void;
  copyShippingToBilling: () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  formatPrice: (price: number) => string;
}

const OrderFormContent: React.FC<OrderFormContentProps> = ({
  cartProducts,
  formData,
  onRemoveItem,
  onUpdateQuantity,
  onClearCart,
  handleInputChange,
  handleSelectChange,
  copyShippingToBilling,
  handleSubmit,
  isLoading,
  formatPrice,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <OrderSummary 
        cartProducts={cartProducts}
        onRemoveItem={onRemoveItem}
        onUpdateQuantity={onUpdateQuantity}
        onClearCart={onClearCart}
        formatPrice={formatPrice}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddressForm 
          type="shipping"
          formData={formData}
          onChange={handleInputChange}
          onSelectChange={handleSelectChange}
        />
        
        <AddressForm 
          type="billing"
          formData={formData}
          onChange={handleInputChange}
          onSelectChange={handleSelectChange}
          copyShippingToBilling={copyShippingToBilling}
        />
      </div>
      
      <OrderNotes 
        notes={formData.notes}
        onChange={handleInputChange}
      />
      
      <div className="flex justify-end">
        <LoadingButton 
          type="submit" 
          size="lg" 
          isLoading={isLoading} 
          disabled={cartProducts.length === 0}
          loadingText="Processing..."
        >
          Place Order
        </LoadingButton>
      </div>
    </form>
  );
};

export default OrderFormContent;
