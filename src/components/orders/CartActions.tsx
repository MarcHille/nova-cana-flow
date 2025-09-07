
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Trash2 } from "lucide-react";

export interface CartActionsProps {
  onContinueShopping: () => void;
  onProceedToCheckout: () => void;
  onClearCart?: () => void;
}

const CartActions = ({
  onContinueShopping,
  onProceedToCheckout,
  onClearCart,
}: CartActionsProps) => {
  return (
    <div className="mt-4 space-y-3">
      <Button
        variant="default"
        className="w-full"
        onClick={onProceedToCheckout}
      >
        Zur Kasse
      </Button>
      
      <Button
        variant="outline"
        className="w-full"
        onClick={onContinueShopping}
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        Weiter einkaufen
      </Button>
      
      {onClearCart && (
        <Button
          variant="outline"
          className="w-full text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={onClearCart}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Warenkorb leeren
        </Button>
      )}
    </div>
  );
};

export default CartActions;
