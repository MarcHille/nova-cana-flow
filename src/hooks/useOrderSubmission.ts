
import { useState } from "react";
import { CartItem, Product, Address } from "@/types";
import { createSanitizedAddress, generateOrderNumber, sanitizeInput } from "@/utils/orderUtils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { validateCartHasProducts, validateOrderFormFields, validateUserCanCheckout } from "@/utils/orderValidation";
import { useOrderForm } from "./useOrderForm";
import { useOrderCalculation } from "./useOrderCalculation";

// Define order status constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

/**
 * Custom hook for order submission and processing
 */
export const useOrderSubmission = (
  cartItems: CartItem[],
  products: Product[],
  onClearCart: () => void,
  navigate: ReturnType<typeof useNavigate>
) => {
  // State for loading and form submission
  const [isLoading, setIsLoading] = useState(false);
  
  // Get form handling from useOrderForm
  const {
    formData,
    handleInputChange,
    handleSelectChange,
    copyShippingToBilling
  } = useOrderForm();
  
  // Get calculation utilities
  const { calculateSubtotal } = useOrderCalculation();
  
  // Format price for display
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };
  
  // Process the order submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    // Map cart items to include product details
    const cartProducts = cartItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        ...item,
        product,
      };
    });
    
    // Perform validation
    if (!validateCartHasProducts(cartProducts)) {
      toast.error("Ihr Warenkorb ist leer oder enthält ungültige Artikel");
      return;
    }
    
    // Validate form fields
    if (!validateOrderFormFields(formData)) {
      toast.error("Bitte füllen Sie alle erforderlichen Felder aus");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create sanitized addresses
      const shippingAddress: Address = createSanitizedAddress(
        formData.shippingName,
        formData.shippingStreet,
        formData.shippingCity,
        formData.shippingPostalCode,
        formData.shippingCountry
      );
      
      const billingAddress: Address = createSanitizedAddress(
        formData.billingName,
        formData.billingStreet,
        formData.billingCity,
        formData.billingPostalCode,
        formData.billingCountry
      );
      
      // Calculate the cart total
      const cartTotal = calculateSubtotal(cartProducts);
      
      // Create order object
      const timestamp = Date.now();
      // For security, we're using the user ID to generate the order number
      // In a real implementation, this would be the authenticated user ID
      const userId = "temp-user-id"; 
      const orderNumber = generateOrderNumber(userId, timestamp);
      
      const order = {
        id: crypto.randomUUID(),
        orderNumber,
        userId,
        items: cartItems.map(item => {
          const product = products.find(p => p.id === item.productId);
          return {
            productId: item.productId,
            quantity: item.quantity,
            price: product?.price || 0,
          };
        }),
        total: cartTotal,
        shippingAddress,
        billingAddress,
        paymentMethod: sanitizeInput(formData.paymentMethod || 'invoice'),
        notes: formData.notes ? sanitizeInput(formData.notes) : '',
        status: ORDER_STATUS.PENDING,
        createdAt: new Date().toISOString(),
      };

      // In a real implementation, this would be sent to the server
      console.log('Processing order:', order);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear the cart
      onClearCart();
      
      // Show success notification
      toast.success("Bestellung erfolgreich aufgegeben!");
      
      // Redirect to order confirmation
      navigate(`/orders/${order.id}`);
      
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error("Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    formData,
    handleInputChange,
    handleSelectChange,
    copyShippingToBilling,
    handleSubmit,
    formatPrice
  };
};

export default useOrderSubmission;
