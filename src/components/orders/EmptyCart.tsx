
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface EmptyCartProps {
  onGoToProducts: () => void;
}

const EmptyCart = ({ onGoToProducts }: EmptyCartProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
      <ShoppingCart className="h-16 w-16 text-gray-400 mb-6" />
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        Ihr Warenkorb ist leer
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
        Sieht so aus, als hätten Sie noch keine Produkte hinzugefügt. Entdecken Sie unser Sortiment und finden Sie hochwertige medizinische Cannabis-Produkte für Ihre Apotheke.
      </p>
      <Button onClick={onGoToProducts}>Produkte durchsuchen</Button>
    </div>
  );
};

export default EmptyCart;
