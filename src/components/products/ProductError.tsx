
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export interface ProductErrorProps {
  error: string;
  onRetry?: () => void;
  title?: string;
  retryLabel?: string;
}

const ProductError = ({ 
  error, 
  onRetry = () => {}, 
  title = "Fehler beim Laden der Produkte",
  retryLabel = "Erneut versuchen"
}: ProductErrorProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 text-center my-8">
      <div className="flex justify-center mb-4">
        <AlertCircle size={48} className="text-red-500" />
      </div>
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
      <Button onClick={onRetry}>{retryLabel}</Button>
    </div>
  );
};

export default ProductError;
